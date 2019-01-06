using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Model.Common;

namespace DataIntegrationServiceLogic
{
    public class InputLogic
    {
        private const string TableName = "current_{user}";
        private System.Threading.AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue;

        public InputLogic(ref System.Threading.AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }

        private void Notify()
        {

        }

        public string GetList(JsonValue jsonObj)
        {
            var userId = jsonObj["member_id"].ReadAs<string>();
            var selectedItems = new List<string>() { "category", "column_json(rawdata) as rawdata", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName.Replace("{user}",userId), selectedItems);
            var res = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", query);

            return res.ToString();
        }

        public string Create(JsonValue jsonObj)
        {
            var source = jsonObj["member_id"].ReadAs<string>();
            var category = jsonObj["category"].ReadAs<string>();
            var rawdata = jsonObj["rawdata"];
            var insertSource = new List<JsonDictionary>();
            var jsonDict = new JsonDictionary();
            foreach (var item in rawdata)
            {
                jsonDict.Add(item.Key, item.Value.ReadAs<string>());
            }
            insertSource.Add(jsonDict);
            var query = MariaQueryBuilder.InsertSource(source, category, insertSource, "", "");
            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", query);
            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var source = jsonObj["member_id"].ReadAs<string>();
            var category = jsonObj["category"].ReadAs<string>();
            var rawdata = jsonObj["rawdata"];
            var insertSource = new List<JsonDictionary>();
            var jsonDict = new JsonDictionary();
            foreach (var item in rawdata)
            {
                jsonDict.Add(item.Key, item.Value.ReadAs<string>());
            }
            insertSource.Add(jsonDict);
            var query = MariaQueryBuilder.InsertSource(source, category, insertSource, "", "");
            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", query);
            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var source = jsonObj["member_id"].ReadAs<string>();
            var category = jsonObj["category"].ReadAs<string>();
            var queryBuilder = new StringBuilder("DELETE FROM ");
            queryBuilder.Append("current_").Append(source).Append(" WHERE category = '").Append(category).Append("';")
                        .Append("DELETE FROM ").Append("past_").Append(source).Append(" WHERE category = '").Append(category).Append("';");
                        //.Append("DELETE FROM ").Append("fields_").Append(source).Append(" WHERE category = '").Append(category).Append("';");
            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", queryBuilder.ToString());

            return res.ToString();
        }
    }
}
