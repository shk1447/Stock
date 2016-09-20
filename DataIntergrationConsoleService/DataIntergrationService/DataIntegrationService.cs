using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Common;
using Connector;
using Newtonsoft.Json.Linq;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.Diagnostics;
using Model.Response;
using Model.Request;
using SourceModuleManager;
using Helper;
using Model.Common;


namespace DataIntegrationService
{
    [ServiceBehavior(ConcurrencyMode = ConcurrencyMode.Multiple, InstanceContextMode = InstanceContextMode.PerCall)]
    public partial class DataIntegrationService : IDataIntegrationService
    {
        public DataIntegrationService()
        {
        }

        #region IDataIntegrationService 멤버


        public SetDataSourceRes SetDataSource(Stream stream)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            SetDataSourceReq param = null;
            using (var streamReader = new StreamReader(stream))
            {
                param = DataConverter.JsonToDictionary<SetDataSourceReq>(streamReader.ReadToEnd());
            }

            var res = new SetDataSourceRes();

            if (param != null && !string.IsNullOrWhiteSpace(param.Source) && !string.IsNullOrWhiteSpace(param.Category))
            {
                var query = MariaQueryBuilder.SetDataSource(param);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", query);

                res.Code = "200";
                res.Message = "요청 접수 완료";
            }
            else
            {
                res.Code = "400";
                res.Message = "잘못된 요청";
            }

            return res;
        }

        public GetDataSourceRes GetDataSource(GetDataSourceReq param)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new GetDataSourceRes();

            var rawData = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", param.Query);

            res.RawData = rawData;

            return res;
        }

        public GetDataStructureRes GetDataStructure()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new GetDataStructureRes();

            var query = MariaQueryDefine.getSourceInformation;
            var tableInfo = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);

            var structureQuery = MariaQueryBuilder.GetDataStructure(tableInfo);

            var dataStructure = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", structureQuery);
            res.DataStructure = dataStructure;

            return res;
        }

        public SetDataAnalysisRes SetDataAnalysis(List<SetDataAnalysisReq> parameters)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new SetDataAnalysisRes();

            foreach (var param in parameters)
            {
                var data = new Dictionary<string, object>() { { "name", param.Name }, { "source", param.Source }, { "categories", param.Categories }, { "collectedat", param.CollectedAt },
                                                          { "analysisquery", param.AnalysisQuery }, { "options", param.Options }, { "schedule", param.Schedule } };

                var upsertQuery = MariaQueryBuilder.UpsertQuery("dataanalysis", data);

                MariaDBConnector.Instance.SetQuery(upsertQuery);
            }

            return res;
        }

        public List<GetDataAnalysisRes> GetDataAnalysis()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var selectedItems = new List<string>() { "name", "source", "categories", "collectedat", "analysisquery",
                                                     "COLUMN_JSON(options) as options", "COLUMN_JSON(schedule) as schedule", "unixtime" };
            var selectQuery = MariaQueryBuilder.SelectQuery("dataanalysis", selectedItems);
            var res = MariaDBConnector.Instance.GetQuery<GetDataAnalysisRes>(selectQuery);

            return res;
        }

        public ExecuteDataAnalysisRes ExecuteDataAnalysis(string name, string command)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new ExecuteDataAnalysisRes();

            var selectedItems = new List<string>() { "name", "source", "categories", "collectedat", "analysisquery",
                                                     "COLUMN_JSON(options) as options", "COLUMN_JSON(schedule) as schedule", "status", "unixtime" };
            var whereKV = new Dictionary<string, string>() { { "name", name } };
            var selectQuery = MariaQueryBuilder.SelectQuery("dataanalysis", selectedItems, whereKV);
            var analysis = MariaDBConnector.Instance.GetOneQuery<GetDataAnalysisRes>(selectQuery);

            var status = analysis.status.ToLower();

            if (command != "stop" && status == "running" || status == "waiting") return res;

            var setDict = new Dictionary<string, string>() { { "status", status } };

            var action = new Func<string, bool>((switchMode) =>
            {
                if (switchMode == "waiting" || switchMode == "scheduling")
                {
                    setDict["status"] = "running";
                    var statusUpdate = MariaQueryBuilder.UpdateQuery("dataanalysis", whereKV, setDict);
                    MariaDBConnector.Instance.SetQuery(statusUpdate);
                }

                ExecuteAnalysis(analysis);
                return true;
            });

            switch (command.ToLower())
            {
                case "start":
                    {
                        var statusUpdate = string.Empty;
                        var thread = new Thread(new ThreadStart(() =>
                        {
                            Scheduler("dataanalysis", whereKV, analysis.schedule, setDict, action);
                        }));
                        thread.Start();
                        break;
                    }
                case "stop":
                    {
                        break;
                    }
            }

            return res;
        }

        private void Scheduler(string tableName, Dictionary<string, string> whereKV, JsonDictionary schedule, Dictionary<string, string> setDict, Func<string, bool> action)
        {
            string statusUpdate = string.Empty;
            var switchMode = "waiting";
            if (schedule != null)
            {
                var start = DateTime.Parse(schedule["start"].ToString()).TimeOfDay;
                var end = DateTime.Parse(schedule["end"].ToString()).TimeOfDay;
                //MON,TUE,WED,THU,FRI,SAT,SUN
                var weekDays = schedule["weekdays"].ToString().Split(',').ToList();
                var interval = int.Parse(schedule["interval"].ToString());

                while (true)
                {
                    var nowWeekDay = DateTime.Now.DayOfWeek.ToString().Substring(0, 3).ToUpper();
                    var nowTime = DateTime.Now.TimeOfDay;

                    if (weekDays.Contains(nowWeekDay) && nowTime > start && nowTime < end)
                    {
                        action.BeginInvoke(switchMode, new AsyncCallback((result) =>
                        {
                            setDict["status"] = "scheduling";
                            statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery(statusUpdate);
                            switchMode = "scheduling";
                        }), null);
                    }
                    else
                    {
                        if (switchMode == "scheduling" || switchMode == "waiting")
                        {
                            setDict["status"] = "waiting";
                            statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery(statusUpdate);
                        }

                        switchMode = "waiting";
                    }
                    Thread.Sleep(interval);
                }
            }
            else
            {
                action.BeginInvoke(switchMode, new AsyncCallback((result) =>
                {
                    setDict["status"] = "done";
                    statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                    MariaDBConnector.Instance.SetQuery(statusUpdate);
                }), null);
            }
        }

        private void ExecuteAnalysis(GetDataAnalysisRes analysis)
        {
            foreach (var category in analysis.categories)
            {
                var query = analysis.analysisquery.Replace("{category}", category).Replace("{analysis.name}", analysis.name);
                foreach (var kv in analysis.options.GetDictionary())
                {
                    var key = "{" + kv.Key.ToLower() + "}";
                    query = query.Replace(key, kv.Value.ToString());
                }

                var data = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
                var setSource = new SetDataSourceReq()
                {
                    RawData = data,
                    Category = category,
                    Source = analysis.source,
                    CollectedAt = analysis.collectedAt
                };
                var setSourceQuery = MariaQueryBuilder.SetDataSource(setSource);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
            }
        }

        public GetModuleStructureRes GetModuleStructure()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new GetModuleStructureRes();

            res.CollectionModules = ModuleManager.Instance.GetSourceModuleInfo();

            return res;
        }

        public SetCollectionModuleRes SetCollectionModule(List<SetCollectionModuleReq> parameters)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            foreach (var param in parameters)
            {
                var data = new Dictionary<string, object>() { { "name", param.Name }, { "modulename", param.ModuleName },
                                                          { "methodname", param.MethodName }, { "options", param.Options }, { "schedule", param.Schedule } };

                ModuleManager.Instance.SetCollectionModule(data);
            }

            return null;
        }

        public List<GetCollectionModuleRes> GetCollectionModule()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }
            var selectedItems = new List<string>() { "name", "modulename", "methodname", "COLUMN_JSON(options) as options", "schedule", "unixtime" };
            var query = MariaQueryBuilder.SelectQuery("datacollection", selectedItems);
            var res = MariaDBConnector.Instance.GetQuery<GetCollectionModuleRes>(query);

            return res;
        }

        public ExecuteCollectionModuleRes ExecuteCollectionModule(string name, string command)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }
            var res = new ExecuteCollectionModuleRes();
            var selectedItems = new List<string>() { "name", "modulename", "methodname", "column_json(options) as options", "column_json(schedule) as schedule", "status", "unixtime" };
            var whereKV = new Dictionary<string, string>() { { "name", name } };
            var query = MariaQueryBuilder.SelectQuery("datacollection", selectedItems, whereKV);
            var moduleInfo = MariaDBConnector.Instance.GetOneQuery<GetCollectionModuleRes>(query);

            var status = moduleInfo.Status.ToLower();

            if (command != "stop" && status == "running" || status == "waiting") return res;

            var setDict = new Dictionary<string, string>() { { "status", status } };

            var action = new Func<string, bool>((switchMode) =>
            {
                if (switchMode == "waiting" || switchMode == "scheduling")
                {
                    setDict["status"] = "running";
                    var statusUpdate = MariaQueryBuilder.UpdateQuery("datacollection", whereKV, setDict);
                    MariaDBConnector.Instance.SetQuery(statusUpdate);
                }

                ModuleManager.Instance.ExecuteModule(moduleInfo);

                return true;
            });

            switch (command.ToLower())
            {
                case "start":
                    {
                        var statusUpdate = string.Empty;
                        var thread = new Thread(new ThreadStart(() =>
                        {
                            Scheduler("datacollection", whereKV, moduleInfo.Schedule, setDict, action);
                        }));
                        thread.Start();
                        break;
                    }
                case "stop":
                    {
                        break;
                    }
            }

            return res;
        }

        public SetDataViewRes SetDataView(SetDataViewReq param)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            throw new NotImplementedException();
        }

        public GetDataViewRes GetDataView(GetDataViewReq param)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            throw new NotImplementedException();
        }

        #endregion
    }
}