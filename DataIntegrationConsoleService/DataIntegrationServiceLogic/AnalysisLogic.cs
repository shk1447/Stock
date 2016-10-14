using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Helper;
using Model.Common;

namespace DataIntegrationServiceLogic
{
    public class AnalysisLogic
    {
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

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "WEEKDAYS"),
                                      new KeyValuePair<string, JsonValue>("value", "weekdays"),
                                      new KeyValuePair<string, JsonValue>("type", "MultiSelect"),
                                      new KeyValuePair<string, JsonValue>("group", 3),
                                      new KeyValuePair<string, JsonValue>("required", true),
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
                                          )))));
            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "START"),
                                      new KeyValuePair<string, JsonValue>("value", "start"),
                                      new KeyValuePair<string, JsonValue>("type", "TimePicker"),
                                      new KeyValuePair<string, JsonValue>("group", 4),
                                      new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "END"),
                                      new KeyValuePair<string, JsonValue>("value", "end"),
                                      new KeyValuePair<string, JsonValue>("type", "TimePicker"),
                                      new KeyValuePair<string, JsonValue>("group", 4),
                                      new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "INTERVAL"),
                                      new KeyValuePair<string, JsonValue>("value", "interval"),
                                      new KeyValuePair<string, JsonValue>("type", "Number"),
                                      new KeyValuePair<string, JsonValue>("group", 4),
                                      new KeyValuePair<string, JsonValue>("datakey", "schedule"),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "UPDATED TIME"),
                                      new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                      new KeyValuePair<string, JsonValue>("type", "Data")));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "OPTIONS"),
                                      new KeyValuePair<string, JsonValue>("value", "options"),
                                      new KeyValuePair<string, JsonValue>("type", "AddFields"),
                                      new KeyValuePair<string, JsonValue>("group", 5),
                                      new KeyValuePair<string, JsonValue>("required", true)));
            return fields;
        }

        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "target_source", "analysis_query", "COLUMN_JSON(options) as options",
                                                     "COLUMN_JSON(schedule) as schedule", "status", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems);
            var res = MariaDBConnector.Instance.GetJsonArray(query);

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
    }
}
