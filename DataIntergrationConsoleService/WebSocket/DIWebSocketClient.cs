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
        public DIWebSocketClient(string url)
        {
            url = "http://127.0.0.1:3000";
            Client aa = new Client(url);
        }
    }
}
