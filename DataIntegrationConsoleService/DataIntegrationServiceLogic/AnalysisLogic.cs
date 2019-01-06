using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Connector;
using Helper;
using Model.Common;
using Model.Request;
using System.Diagnostics;
using Common;
using Log;

namespace DataIntegrationServiceLogic
{
    public class AnalysisLogic
    {
        private static Dictionary<string, Thread> scheduleThread = new Dictionary<string, Thread>();

        private const string TableName = "data_analysis";
        private AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue;

        public AnalysisLogic(ref AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }

        public string Schema()
        {
            var fields = this.SetSchema();

            return fields.ToString();
        }

        private JsonArray SetSchema()
        {
            var fields = new JsonArray();
            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "STATUS"),
                                      new KeyValuePair<string, JsonValue>("value", "status"),
                                      new KeyValuePair<string, JsonValue>("type", "Action")));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "ANALYSIS NAME"),
                                      new KeyValuePair<string, JsonValue>("value", "name"),
                                      new KeyValuePair<string, JsonValue>("type", "Text"),
                                      new KeyValuePair<string, JsonValue>("group", 0),
                                      new KeyValuePair<string, JsonValue>("required", true)));
            
            var sourceQuery = MariaQueryDefine.GetSourceInformation;
            var sources = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", sourceQuery);
            var sourceArray = new JsonArray();
            if (sources != null)
            {
                foreach (var source in sources)
                {
                    var sourceName = source["TABLE_NAME"].ReadAs<string>().Replace("current_", "");
                    sourceArray.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", sourceName),
                                                   new KeyValuePair<string, JsonValue>("value", sourceName)));
                }
            }
            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "TARGET SOURCE"),
                                      new KeyValuePair<string, JsonValue>("value", "target_source"),
                                      new KeyValuePair<string, JsonValue>("type", "Select"),
                                      new KeyValuePair<string, JsonValue>("group", 1),
                                      new KeyValuePair<string, JsonValue>("required", true),
                                      new KeyValuePair<string, JsonValue>("options", sourceArray)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "ANALYSIS QUERY"),
                                      new KeyValuePair<string, JsonValue>("value", "analysis_query"),
                                      new KeyValuePair<string, JsonValue>("type", "Editor"),
                                      new KeyValuePair<string, JsonValue>("group", 2),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "ACTION TYPE"),
                                      new KeyValuePair<string, JsonValue>("value", "action_type"),
                                      new KeyValuePair<string, JsonValue>("type", "Select"),
                                      new KeyValuePair<string, JsonValue>("group", 3),
                                      new KeyValuePair<string, JsonValue>("required", true),
                                      new KeyValuePair<string, JsonValue>("dynamic", true),
                                      new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                          new JsonObject(
                                              new KeyValuePair<string, JsonValue>("text", "예약 실행"),
                                              new KeyValuePair<string, JsonValue>("value", "schedule"),
                                              new KeyValuePair<string, JsonValue>("fields", new JsonArray(
                                                  new JsonObject(new KeyValuePair<string, JsonValue>("text", "WEEKDAYS"),
                                                      new KeyValuePair<string, JsonValue>("value", "weekdays"),
                                                      new KeyValuePair<string, JsonValue>("type", "MultiSelect"),
                                                      new KeyValuePair<string, JsonValue>("group", 4),
                                                      new KeyValuePair<string, JsonValue>("required", false),
                                                      new KeyValuePair<string, JsonValue>("temp", true),
                                                      new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                                      new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                                          new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "월요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "MON")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "화요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "TUE")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "수요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "WED")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "목요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "THU")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "금요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "FRI")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "토요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "SAT")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("text", "일요일"),
                                                              new KeyValuePair<string, JsonValue>("value", "SUN")
                                                          )))),
                                                    new JsonObject(new KeyValuePair<string, JsonValue>("text", "START"),
                                                        new KeyValuePair<string, JsonValue>("value", "start"),
                                                        new KeyValuePair<string, JsonValue>("type", "TimePicker"),
                                                        new KeyValuePair<string, JsonValue>("group", 5),
                                                        new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("required", false)),
                                                    new JsonObject(new KeyValuePair<string, JsonValue>("text", "END"),
                                                        new KeyValuePair<string, JsonValue>("value", "end"),
                                                        new KeyValuePair<string, JsonValue>("type", "TimePicker"),
                                                        new KeyValuePair<string, JsonValue>("group", 5),
                                                        new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("required", false)),
                                                    new JsonObject(new KeyValuePair<string, JsonValue>("text", "INTERVAL"),
                                                        new KeyValuePair<string, JsonValue>("value", "interval"),
                                                        new KeyValuePair<string, JsonValue>("type", "Number"),
                                                        new KeyValuePair<string, JsonValue>("group", 5),
                                                        new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("required", false))
                                          ))), new JsonObject(
                                                new KeyValuePair<string, JsonValue>("text", "즉시 실행"),
                                                new KeyValuePair<string, JsonValue>("value", "once"))))
                                      ));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "UPDATED TIME"),
                                      new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                      new KeyValuePair<string, JsonValue>("type", "Data")));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "OPTIONS"),
                                      new KeyValuePair<string, JsonValue>("value", "options"),
                                      new KeyValuePair<string, JsonValue>("type", "AddFields"),
                                      new KeyValuePair<string, JsonValue>("group", 6),
                                      new KeyValuePair<string, JsonValue>("required", true)));
            return fields;
        }

        private void Notify()
        {
            var result = this.GetList();
            var msg = new JsonObject(new KeyValuePair<string, JsonValue>("result", result),
                                     new KeyValuePair<string, JsonValue>("broadcast", true),
                                     new KeyValuePair<string, JsonValue>("target", "analysis"),
                                     new KeyValuePair<string, JsonValue>("method", "getlist"));
            this.concurrentQueue.Enqueue(msg);
            this.autoResetEvent.Set();
        }

        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "target_source", "analysis_query", "action_type", "COLUMN_JSON(options) as options",
                                                     "COLUMN_JSON(schedule) as schedule", "status", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var result = MariaDBConnector.Instance.GetJsonArray(query);

            var state = scheduleThread.Count > 0 ? "running" : "stop";
            var res = new JsonObject(new KeyValuePair<string, JsonValue>("state", state), new KeyValuePair<string, JsonValue>("result", result));

            return res.ToString();
        }

        public string Create(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, false);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            this.Notify();

            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, true);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            this.Notify();

            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", deleteQuery);

            this.Notify();

            return res.ToString();
        }

        public string Execute(JsonValue jsonValue)
        {
            var res = new JsonObject();
            res.Add("code", "200");
            res.Add("message", "success");

            var name = jsonValue["name"].ReadAs<string>();
            var command = jsonValue["command"].ReadAs<string>();

            var selectedItems = new List<string>() { "name", "target_source", "analysis_query", "action_type", "COLUMN_JSON(options) as options",
                                                     "COLUMN_JSON(schedule) as schedule", "status", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var whereKV = new JsonObject(); whereKV.Add("name", name);

            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, whereKV);
            var analysisInfo = MariaDBConnector.Instance.GetJsonObject(query);

            var status = analysisInfo["status"].ReadAs<string>().ToLower();

            if (command != "stop" && (status == "play" || status == "wait" || status == "spinner"))
            {
                res["code"] = 400; res["message"] = "fail";
                return res.ToString();
            }

            var setDict = new JsonObject();
            setDict.Add("status", status);

            var action = new Func<string, bool>((switchMode) =>
            {
                try
                {
                    if (switchMode == "wait" || switchMode == "stop")
                    {
                        setDict["status"] = "play";
                        var statusUpdate = MariaQueryBuilder.UpdateQuery(TableName, whereKV, setDict);
                        MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);

                        this.Notify();
                    }
                    this.ExecuteAnalysis(analysisInfo);
                }
                catch (Exception ex)
                {
                    LogWriter.Error(ex.ToString());
                }

                return true;
            });

            switch (command.ToLower())
            {
                case "start":
                    {
                        var statusUpdate = string.Empty;
                        var thread = new Thread(new ThreadStart(() =>
                        {
                            Scheduler.ExecuteScheduler(TableName, analysisInfo["action_type"].ReadAs<string>(), whereKV, analysisInfo["schedule"], setDict, action, this.Notify);
                        }));

                        if (scheduleThread.ContainsKey(name)) scheduleThread.Remove(name);
                        scheduleThread.Add(name, thread);
                        thread.Start();
                        Thread.Sleep(100);
                        break;
                    }
                case "stop":
                    {
                        scheduleThread[name].Abort();
                        scheduleThread.Remove(name);
                        setDict["status"] = "stop";
                        var statusUpdate = MariaQueryBuilder.UpdateQuery(TableName, whereKV, setDict);
                        MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", statusUpdate);
                        this.Notify();
                        break;
                    }
            }

            return res.ToString();
        }

        private void ExecuteAnalysis(JsonValue analysis)
        {
            var analysis_name = analysis["name"].ReadAs<string>();
            var target_source = analysis["target_source"].ReadAs<string>();
            var analysis_query = analysis["analysis_query"].ReadAs<string>();
            var analysis_options = analysis["options"];
            Console.WriteLine("{0} Analysis Start : {1}", analysis_name, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            if (analysis_query.Contains("{category}"))
            {
                var categories_query = "SELECT category FROM current_" + target_source;
                var categories = MariaDBConnector.Instance.GetJsonArray(categories_query);
                foreach (var row in categories)
                {
                    var category = row["category"].ReadAs<string>();
                    var query = analysis_query.Replace("{category}", category).Replace("{analysis_name}", analysis_name);
                    foreach (var kv in analysis_options)
                    {
                        var key = "{" + kv.Key.ToLower() + "}";
                        query = query.Replace(key, kv.Value.ReadAs<string>());
                    }

                    var data = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
                    if (data != null)
                    {
                        var setSource = new SetDataSourceReq()
                        {
                            rawdata = data,
                            category = category,
                            source = target_source,
                            collected_at = "날짜"
                        };
                        if (setSource.rawdata.Count > 0)
                        {
                            ThreadPool.QueueUserWorkItem((a) =>
                            {
                                var setSourceQuery = MariaQueryBuilder.SetDataSource(setSource);
                                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                            });
                        }
                    }
                }
            }
            else
            {
                var query = analysis_query.Replace("{analysis_name}", analysis_name);
                foreach (var kv in analysis_options)
                {
                    var key = "{" + kv.Key.ToLower() + "}";
                    query = query.Replace(key, kv.Value.ReadAs<string>());
                }

                var data = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
                if (data != null)
                {
                    var setSource = new SetDataSourceReq()
                    {
                        rawdata = data,
                        category = "카테고리",
                        source = target_source,
                        collected_at = "날짜"
                    };
                    if (setSource.rawdata.Count > 0)
                    {
                        var setSourceQuery = MariaQueryBuilder.SetDataSource(setSource);
                        MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                    }
                }
            }
            Console.WriteLine("{0} Analysis End : {1}", analysis_name, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        }
    }
}