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

namespace DataIntegrationServiceLogic
{
    public class AnalysisLogic
    {
        private static Dictionary<string, Thread> scheduleThread = new Dictionary<string, Thread>();

        private const string TableName = "data_analysis";

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

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "TARGET SOURCE"),
                                      new KeyValuePair<string, JsonValue>("value", "target_source"),
                                      new KeyValuePair<string, JsonValue>("type", "Text"),
                                      new KeyValuePair<string, JsonValue>("group", 1),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            var sourceQuery = MariaQueryDefine.getSourceInformation;
            var sources = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", sourceQuery);

            var schemaArray = new JsonArray();
            foreach (var source in sources)
            {
                var tableName = source["TABLE_NAME"].ReadAs<string>().Replace("current_", "");
                var schemaQuery = MariaQueryDefine.getSchema.Replace("{source}", tableName);
                var schemaInfo = MariaDBConnector.Instance.GetJsonObject("DynamicQueryExecuter", schemaQuery);
                var currentJson = JsonValue.Parse(schemaInfo["schema"].ReadAs<string>());
                var pastJson = JsonValue.Parse(schemaInfo["schema"].ReadAs<string>());
                currentJson["name"] = "current_" + tableName;
                schemaArray.Add(currentJson);
                pastJson["name"] = "past_" + tableName;
                schemaArray.Add(pastJson);
            }

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "ANALYSIS QUERY"),
                                      new KeyValuePair<string, JsonValue>("value", "analysis_query"),
                                      new KeyValuePair<string, JsonValue>("type", "SQLEditor"),
                                      new KeyValuePair<string, JsonValue>("group", 2),
                                      new KeyValuePair<string, JsonValue>("required", true),
                                      new KeyValuePair<string, JsonValue>("schema", schemaArray)));

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

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, true);

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery(deleteQuery);

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
                if (switchMode == "wait" || switchMode == "spinner")
                {
                    setDict["status"] = "play";
                    var statusUpdate = MariaQueryBuilder.UpdateQuery2(TableName, whereKV, setDict);
                    MariaDBConnector.Instance.SetQuery(statusUpdate);
                }

                this.ExecuteAnalysis(analysisInfo);

                return true;
            });

            switch (command.ToLower())
            {
                case "start":
                    {
                        var statusUpdate = string.Empty;
                        var thread = new Thread(new ThreadStart(() =>
                        {
                            Scheduler.ExecuteScheduler(TableName, analysisInfo["action_type"].ReadAs<string>(), whereKV, analysisInfo["schedule"], setDict, action);
                        }));
                        scheduleThread.Add(name, thread);
                        thread.Start();
                        break;
                    }
                case "stop":
                    {
                        scheduleThread[name].Abort();
                        scheduleThread.Remove(name);
                        setDict["status"] = "stop";
                        var statusUpdate = MariaQueryBuilder.UpdateQuery2(TableName, whereKV, setDict);
                        MariaDBConnector.Instance.SetQuery(statusUpdate);
                        break;
                    }
            }

            return res.ToString();
        }

        private void ExecuteAnalysis(JsonValue analysis)
        {
            var query = analysis["analysis_query"].ReadAs<string>();
            query = Regex.Replace(query, "FROM (.*?)[.]", DynamicColumnMatchEvaluator);
            //foreach (var category in analysis.categories)
            //{
            //    var query = analysis.analysis_query.Replace("{category}", category).Replace("{analysis.name}", analysis.name);
            //    foreach (var kv in analysis.options.GetDictionary())
            //    {
            //        var key = "{" + kv.Key.ToLower() + "}";
            //        query = query.Replace(key, kv.Value.ToString());
            //    }

            //    var data = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
            //    var setSource = new SetDataSourceReq()
            //    {
            //        rawdata = data,
            //        category = category,
            //        source = analysis.source,
            //        collected_at = analysis.collected_at
            //    };
            //    var setSourceQuery = MariaQueryBuilder.SetDataSource(setSource);
            //    MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
            //}
        }

        private string DynamicColumnMatchEvaluator(Match match)
        {
            var value = match.Value.Replace("rawdata.", "").Replace("`", "");

            return "column_get(`rawdata`, '" + value + "' as char) as " + value;
        }
    }
}
