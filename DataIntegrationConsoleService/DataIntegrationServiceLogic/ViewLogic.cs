using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;

namespace DataIntegrationServiceLogic
{
    public class ViewLogic
    {
        private const string TableName = "data_view";

        public string Schema(string privilege)
        {
            var fields = new JsonArray();

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW NAME"),
                                      new KeyValuePair<string, JsonValue>("value", "name"),
                                      new KeyValuePair<string, JsonValue>("type", "Text"),
                                      new KeyValuePair<string, JsonValue>("group", 0),
                                      new KeyValuePair<string, JsonValue>("required", true)));
            if (privilege == "super")
            {
                fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW TYPE"),
                                          new KeyValuePair<string, JsonValue>("value", "view_type"),
                                          new KeyValuePair<string, JsonValue>("type", "Select"),
                                          new KeyValuePair<string, JsonValue>("group", 0),
                                          new KeyValuePair<string, JsonValue>("required", true),
                                          new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                              new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "실시간"),
                                                  new KeyValuePair<string, JsonValue>("value", "current")
                                              ), new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "과거"),
                                                  new KeyValuePair<string, JsonValue>("value", "past")
                                              ), new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "영상"),
                                                  new KeyValuePair<string, JsonValue>("value", "video")
                                              )))));

                fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW QUERY"),
                                          new KeyValuePair<string, JsonValue>("value", "view_query"),
                                          new KeyValuePair<string, JsonValue>("type", "TextArea"),
                                          new KeyValuePair<string, JsonValue>("group", 1),
                                          new KeyValuePair<string, JsonValue>("required", true)));
            }
            else
            {
                var sourceArray = new JsonArray();
                var sourceQuery = MariaQueryDefine.GetSourceInformation;
                var sources = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", sourceQuery);
                if (sources != null)
                {
                    foreach (var source in sources)
                    {
                        var sourceName = source["TABLE_NAME"].ReadAs<string>().Replace("current_", "");
                        var schemaQuery = MariaQueryDefine.GetSchema.Replace("{source}", sourceName);
                        var schemas = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", schemaQuery);
                        var schemaArray = new JsonArray();
                        var columnList = new List<string>();
                        foreach (var schema in schemas)
                        {
                            var columnArray = schema["column_list"].ReadAs<string>().Split(',');
                            foreach (var column in columnArray)
                            {
                                if (!columnList.Contains(column))
                                {
                                    columnList.Add(column);
                                    schemaArray.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", column),
                                                                   new KeyValuePair<string, JsonValue>("value", column)));
                                }
                            }
                        }
                        var schemaFields = new JsonObject(new KeyValuePair<string, JsonValue>("text", "FIELDS"),
                                                          new KeyValuePair<string, JsonValue>("value", "view_fields"),
                                                          new KeyValuePair<string, JsonValue>("type", "MultiSelect"),
                                                          new KeyValuePair<string, JsonValue>("group", 2),
                                                          new KeyValuePair<string, JsonValue>("required", true),
                                                          new KeyValuePair<string, JsonValue>("temp", true),
                                                          new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                          new KeyValuePair<string, JsonValue>("options", schemaArray));

                        sourceArray.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", sourceName),
                                                       new KeyValuePair<string, JsonValue>("value", sourceName),
                                                       new KeyValuePair<string, JsonValue>("fields", new JsonArray(schemaFields))));
                    }
                }

                var current_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                          new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                          new KeyValuePair<string, JsonValue>("type", "Select"),
                                                          new KeyValuePair<string, JsonValue>("group", 1),
                                                          new KeyValuePair<string, JsonValue>("required", true),
                                                          new KeyValuePair<string, JsonValue>("dynamic", true),
                                                          new KeyValuePair<string, JsonValue>("temp", true),
                                                          new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                          new KeyValuePair<string, JsonValue>("options", sourceArray)));
                var past_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                          new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                          new KeyValuePair<string, JsonValue>("type", "Select"),
                                                          new KeyValuePair<string, JsonValue>("group", 1),
                                                          new KeyValuePair<string, JsonValue>("required", true),
                                                          new KeyValuePair<string, JsonValue>("dynamic", true),
                                                          new KeyValuePair<string, JsonValue>("temp", true),
                                                          new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                          new KeyValuePair<string, JsonValue>("options", sourceArray)));

                past_sourceFields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SAMPLING"),
                                                     new KeyValuePair<string, JsonValue>("value", "view_sampling"),
                                                     new KeyValuePair<string, JsonValue>("type", "Select"),
                                                     new KeyValuePair<string, JsonValue>("group", 3),
                                                     new KeyValuePair<string, JsonValue>("required", true),
                                                     new KeyValuePair<string, JsonValue>("dynamic", true),
                                                     new KeyValuePair<string, JsonValue>("temp", true),
                                                     new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                     new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                                             new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "MAX"),
                                                                 new KeyValuePair<string, JsonValue>("value", "max")
                                                             ),new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "MIN"),
                                                                 new KeyValuePair<string, JsonValue>("value", "min")
                                                             ),new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "AVG"),
                                                                 new KeyValuePair<string, JsonValue>("value", "avg")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "LAST"),
                                                                 new KeyValuePair<string, JsonValue>("value", "last")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "FIRST"),
                                                                 new KeyValuePair<string, JsonValue>("value", "first")
                                                             )))));

                past_sourceFields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SAMPLING PERIOD"),
                                                     new KeyValuePair<string, JsonValue>("value", "view_sampling_period"),
                                                     new KeyValuePair<string, JsonValue>("type", "Select"),
                                                     new KeyValuePair<string, JsonValue>("group", 3),
                                                     new KeyValuePair<string, JsonValue>("required", true),
                                                     new KeyValuePair<string, JsonValue>("dynamic", true),
                                                     new KeyValuePair<string, JsonValue>("temp", true),
                                                     new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                     new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                                             new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "ALL"),
                                                                 new KeyValuePair<string, JsonValue>("value", "all")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "DAY"),
                                                                 new KeyValuePair<string, JsonValue>("value", "day")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "WEEK"),
                                                                 new KeyValuePair<string, JsonValue>("value", "week")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "MONTH"),
                                                                 new KeyValuePair<string, JsonValue>("value", "month")
                                                             ), new JsonObject(
                                                                 new KeyValuePair<string, JsonValue>("text", "YEAR"),
                                                                 new KeyValuePair<string, JsonValue>("value", "year")
                                                             )))));
                
                fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW TYPE"),
                                          new KeyValuePair<string, JsonValue>("value", "view_type"),
                                          new KeyValuePair<string, JsonValue>("type", "Select"),
                                          new KeyValuePair<string, JsonValue>("group", 0),
                                          new KeyValuePair<string, JsonValue>("dynamic", true),
                                          new KeyValuePair<string, JsonValue>("required", true),
                                          new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                              new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "실시간"),
                                                  new KeyValuePair<string, JsonValue>("value", "current"),
                                                  new KeyValuePair<string, JsonValue>("fields", current_sourceFields)
                                              ), new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "과거"),
                                                  new KeyValuePair<string, JsonValue>("value", "past"),
                                                  new KeyValuePair<string, JsonValue>("fields", past_sourceFields)
                                              ), new JsonObject(
                                                  new KeyValuePair<string, JsonValue>("text", "영상"),
                                                  new KeyValuePair<string, JsonValue>("value", "video"),
                                                  new KeyValuePair<string, JsonValue>("fields", new JsonArray())
                                              )))));
            }
            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "UPDATED TIME"),
                                        new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                        new KeyValuePair<string, JsonValue>("type", "Data")));

            return fields.ToString();
        }


        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "column_json(view_options) as view_options", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonObj);
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

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery(deleteQuery);

            return res.ToString();
        }

        public string Execute(JsonValue jsonValue)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(viewInfo["view_query"].ReadAs<string>());
            return res.ToString();
        }

        public byte[] Download(JsonValue jsonValue)
        {
            var repository = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory + ConfigurationManager.AppSettings["FileRepository"]).Replace(@"\", "/");
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var filePath = repository + "/" + "temp.csv";
            var outFileQuery = viewInfo["view_query"].ReadAs<string>() + " INTO OUTFILE '" + filePath + "' CHARACTER SET utf8 FIELDS TERMINATED BY ','";
            MariaDBConnector.Instance.SetQuery(outFileQuery);
            var result = File.ReadAllBytes(filePath);
            File.Delete(filePath);
            return result;
        }
    }
}
