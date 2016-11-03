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

        public string Schema()
        {
            var fields = new JsonArray();

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW NAME"),
                                      new KeyValuePair<string, JsonValue>("value", "name"),
                                      new KeyValuePair<string, JsonValue>("type", "Text"),
                                      new KeyValuePair<string, JsonValue>("group", 0),
                                      new KeyValuePair<string, JsonValue>("required", true)));

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
                                          )))));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW QUERY"),
                                      new KeyValuePair<string, JsonValue>("value", "view_query"),
                                      new KeyValuePair<string, JsonValue>("type", "TextArea"),
                                      new KeyValuePair<string, JsonValue>("group", 1),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "UPDATED TIME"),
                                      new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                      new KeyValuePair<string, JsonValue>("type", "Data")));

            return fields.ToString();
        }


        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
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
