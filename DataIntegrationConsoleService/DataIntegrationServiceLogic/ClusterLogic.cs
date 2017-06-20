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
        public string Schema()
        {
            return string.Empty;
        }

        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "column_json(view_options) as view_options", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems, jsonObj);
            var res = MariaDBConnector.Instance.GetJsonArray(query);

            return res.ToString();
        }

        public JsonValue GetTab(JsonValue jsonValue)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery("data_view", selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(viewInfo["view_query"].ReadAs<string>());
            return res.ToString();
        }
    }
}
