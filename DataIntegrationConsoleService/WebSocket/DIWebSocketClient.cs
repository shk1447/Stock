using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Connector;
using Model.Request;
using Model.Response;
using SocketIOClient;
using SocketIOClient.Messages;

namespace DIWebSocket
{
    public class DIWebSocketClient
    {
        public Client socket;

        public DIWebSocketClient(string url)
        {
            socket = new Client(url);
            socket.Opened += socket_Opened;
            socket.Error += socket_Error;

            socket.On("connect", (fn) =>
            {
                Console.WriteLine("DataIntegrationWebService Url : {0}", url);
            });
            socket.On("RequestData", RequestData);
            socket.Connect();
        }

        private void RequestData(IMessage obj)
        {
            var reqData = obj.Json.GetFirstArgAs<GetDataViewReq>();

            var selectedItems = new List<string>() { "name", "view_type", "view_query", "COLUMN_JSON(options) as options", "unixtime" };
            var whereKV = new Dictionary<string, string>() { { "name", reqData.data_view_name } };
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

            var resData = MariaDBConnector.Instance.GetQuery(view_query);
            socket.Emit("ReponseData", resData);
        }

        private string DynamicColumnMatchEvaluator(Match match)
        {
            var value = match.Value.Replace("rawdata.", "").Replace("`", "");

            return "column_get(`rawdata`, '" + value + "' as char) as " + value;
        }

        void socket_Error(object sender, ErrorEventArgs e)
        {
            Console.WriteLine("WebSocket Error Message : {0}", e.Message);
        }

        void socket_Opened(object sender, EventArgs e)
        {
            Console.WriteLine("::DataIntegrationWebService Connect::");
        }
    }
}
