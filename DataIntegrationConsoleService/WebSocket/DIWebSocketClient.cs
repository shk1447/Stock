using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocketIOClient;

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
                socket.Emit("fromclient", "test");
                socket.On("fromserver", test);
            });

            socket.Connect();
        }

        private void test(SocketIOClient.Messages.IMessage obj)
        {
            //obj.Json.GetArgsAs<
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
