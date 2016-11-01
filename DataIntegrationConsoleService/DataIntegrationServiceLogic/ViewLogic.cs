﻿using System;
using System.Collections.Generic;
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


        public string GetList()
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
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
            var data = MariaDBConnector.Instance.GetJsonArray(viewInfo["view_query"].ReadAs<string>());
            var res = new JsonObject();

            var fields = new JsonArray();
            if (data.Count > 0)
            {
                var count = 0;
                foreach (var item in data[0])
                {
                    fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", item.Key),
                                          new KeyValuePair<string, JsonValue>("value", item.Key),
                                          new KeyValuePair<string, JsonValue>("type", "Text"),
                                          new KeyValuePair<string, JsonValue>("group", count / 2),
                                          new KeyValuePair<string, JsonValue>("required", false)));

                    count++;
                }
            }
            res.Add(new KeyValuePair<string, JsonValue>("data", data));
            res.Add(new KeyValuePair<string, JsonValue>("fields", fields));
            return res.ToString();
        }
    }
}
