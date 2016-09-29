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

            if (param != null && !string.IsNullOrWhiteSpace(param.source) && !string.IsNullOrWhiteSpace(param.category))
            {
                var query = MariaQueryBuilder.SetDataSource(param);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", query);

                res.code = "200";
                res.message = "요청 접수 완료";
            }
            else
            {
                res.code = "400";
                res.message = "잘못된 요청";
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

            var rawData = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", param.query);

            res.rawdata = rawData;

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
            res.data_structure = dataStructure;

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
                var data = new Dictionary<string, object>() { { "name", param.name }, { "source", param.source }, { "categories", param.categories }, { "collected_at", param.collected_at },
                                                          { "analysis_query", param.analysis_query }, { "options", param.options }, { "schedule", param.schedule } };

                var upsertQuery = MariaQueryBuilder.UpsertQuery("data_analysis", data);

                MariaDBConnector.Instance.SetQuery(upsertQuery);
            }

            return res;
        }

        public List<GetDataAnalysisRes> GetDataAnalysisList()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var selectedItems = new List<string>() { "name", "source", "categories", "collected_at", "analysis_query",
                                                     "COLUMN_JSON(options) as options", "COLUMN_JSON(schedule) as schedule", "unixtime" };
            var selectQuery = MariaQueryBuilder.SelectQuery("data_analysis", selectedItems);
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

            var tableName = "data_analysis";
            var selectedItems = new List<string>() { "name", "source", "categories", "collected_at", "analysis_query",
                                                     "COLUMN_JSON(options) as options", "COLUMN_JSON(schedule) as schedule", "status", "unixtime" };
            var whereKV = new Dictionary<string, object>() { { "name", name } };
            var selectQuery = MariaQueryBuilder.SelectQuery(tableName, selectedItems, whereKV);
            var analysis = MariaDBConnector.Instance.GetOneQuery<GetDataAnalysisRes>(selectQuery);

            var status = analysis.status.ToLower();

            if (command != "stop" && status == "running" || status == "waiting") return res;

            var setDict = new Dictionary<string, object>() { { "status", status } };

            var action = new Func<string, bool>((switchMode) =>
            {
                if (switchMode == "waiting" || switchMode == "scheduling")
                {
                    setDict["status"] = "running";
                    var statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
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
                            Scheduler(tableName, whereKV, analysis.schedule, setDict, action);
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

        public GetModuleStructureRes GetModuleStructure()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var res = new GetModuleStructureRes();

            res.collection_modules = ModuleManager.Instance.GetSourceModuleInfo();

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
                var data = new Dictionary<string, object>() { { "name", param.name }, { "module_name", param.module_name },
                                                          { "method_name", param.method_name }, { "options", param.options }, { "schedule", param.schedule } };

                ModuleManager.Instance.SetCollectionModule(data);
            }

            return null;
        }

        public List<GetCollectionModuleRes> GetCollectionModuleList()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }
            var selectedItems = new List<string>() { "name", "module_name", "method_name", "COLUMN_JSON(options) as options", "schedule", "unixtime" };
            var query = MariaQueryBuilder.SelectQuery("data_collection", selectedItems);
            var res = MariaDBConnector.Instance.GetQuery<GetCollectionModuleRes>(query);

            return res;
        }

        public ExecuteCollectionModuleRes ExecuteCollectionModule(string name, string command)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }
            var tableName = "data_collection";
            var res = new ExecuteCollectionModuleRes();
            var selectedItems = new List<string>() { "name", "module_name", "method_name", "column_json(options) as options", "column_json(schedule) as schedule", "status", "unixtime" };
            var whereKV = new Dictionary<string, object>() { { "name", name } };
            var query = MariaQueryBuilder.SelectQuery(tableName, selectedItems, whereKV);
            var moduleInfo = MariaDBConnector.Instance.GetOneQuery<GetCollectionModuleRes>(query);

            var status = moduleInfo.status.ToLower();

            if (command != "stop" && status == "running" || status == "waiting") return res;

            var setDict = new Dictionary<string, object>() { { "status", status } };

            var action = new Func<string, bool>((switchMode) =>
            {
                if (switchMode == "waiting" || switchMode == "scheduling")
                {
                    setDict["status"] = "running";
                    var statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
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
                            Scheduler(tableName, whereKV, moduleInfo.schedule, setDict, action);
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

            var res = new SetDataViewRes();

            var data = new Dictionary<string, object>() { { "name", param.name }, { "view_type", param.view_type },
                                                        { "view_query", param.view_query }, { "options", param.options } };

            var upsertQuery = MariaQueryBuilder.UpsertQuery("data_view", data);

            MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res;
        }

        public List<GetDataViewRes> GetDataViewList()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var selectedItems = new List<string>() { "name", "view_type", "view_query", "COLUMN_JSON(options) as options", "unixtime" };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems);
            var res = MariaDBConnector.Instance.GetQuery<GetDataViewRes>(query);

            return res;
        }

        public List<JsonDictionary> GetDataView(string name)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var selectedItems = new List<string>() { "name", "view_type", "view_query", "COLUMN_JSON(options) as options", "unixtime" };
            var whereKV = new Dictionary<string, string>() { { "name", name } };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems);
            var data_view = MariaDBConnector.Instance.GetOneQuery<GetDataViewRes>(query);

            var view_query = data_view.view_query;

            view_query = Regex.Replace(view_query, "rawdata.(.*?)`(.*?)`", DynamicColumnMatchEvaluator);

            if (data_view.options != null)
            {
                foreach (var kv in data_view.options.GetDictionary())
                {
                    var key = "{" + kv.Key.ToLower() + "}";
                    view_query = query.Replace(key, kv.Value.ToString());
                }
            }

            return MariaDBConnector.Instance.GetQuery(view_query);
        }

        #endregion

        #region Private Method

        private string DynamicColumnMatchEvaluator(Match match)
        {
            var value = match.Value.Replace("rawdata.", "").Replace("`", "");

            return "column_get(`rawdata`, '" + value + "' as char) as " + value;
        }

        private void Scheduler(string tableName, Dictionary<string, object> whereKV, JsonDictionary schedule, Dictionary<string, object> setDict, Func<string, bool> action)
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
                        if (switchMode == "running") continue;
                        action.BeginInvoke(switchMode, new AsyncCallback((result) =>
                        {
                            setDict["status"] = "scheduling";
                            statusUpdate = MariaQueryBuilder.UpdateQuery(tableName, whereKV, setDict);
                            MariaDBConnector.Instance.SetQuery(statusUpdate);
                            switchMode = "scheduling";
                        }), null);
                        if(switchMode != "scheduling") switchMode = "running";
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
                var query = analysis.analysis_query.Replace("{category}", category).Replace("{analysis.name}", analysis.name);
                foreach (var kv in analysis.options.GetDictionary())
                {
                    var key = "{" + kv.Key.ToLower() + "}";
                    query = query.Replace(key, kv.Value.ToString());
                }

                var data = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
                var setSource = new SetDataSourceReq()
                {
                    rawdata = data,
                    category = category,
                    source = analysis.source,
                    collected_at = analysis.collected_at
                };
                var setSourceQuery = MariaQueryBuilder.SetDataSource(setSource);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
            }
        }

        #endregion
    }
}