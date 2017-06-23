using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;

namespace DataIntegrationServiceLogic
{
    public class ClusterLogic
    {
        private System.Threading.AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<System.Json.JsonObject> concurrentQueue;

        public ClusterLogic(ref System.Threading.AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<System.Json.JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }

        public ClusterLogic()
        {
            // TODO: Complete member initialization
        }
        public string Schema()
        {
            return string.Empty;
        }

        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "column_json(view_options) as view_options", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems, jsonObj);
            var res = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", query);

            return res.ToString();
        }

        public JsonValue GetTab(JsonValue jsonValue)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", viewInfo["view_query"].ReadAs<string>());
            return res.ToString();
        }

        public string GetPlayback(JsonValue jsonValue)
        {
            var start = jsonValue["start"].ReadAs<double>();
            var end = jsonValue["end"].ReadAs<double>();
            var view_source = jsonValue["view"]["view_options"]["view_source"].ReadAs<string>();
            var view_fields = jsonValue["view"]["view_options"]["view_fields"].ReadAs<JsonObject>();

            var query = string.Empty;
            var queryBuilder = new StringBuilder();
                
            queryBuilder.Append("SELECT * FROM (SELECT category,");
            foreach (var item in view_fields)
            {
                var value = item.Value.ReadAs<string>();
                queryBuilder.Append("column_get(`rawdata`, '").Append(value).Append("' as char) as `").Append(value).Append("`,");
            }
            queryBuilder.Append("unixtime ");
            queryBuilder.Append("FROM past_").Append(view_source).Append(") as result ");
            queryBuilder.Append("WHERE unixtime >= FROM_UNIXTIME(").Append(start).Append(") AND unixtime <= FROM_UNIXTIME(").Append(end).Append(")");
            query = queryBuilder.ToString();

            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", query);
            return res.ToString();
        }
    }
}
