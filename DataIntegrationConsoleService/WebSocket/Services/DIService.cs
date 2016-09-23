using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Helper;
using Model.Common;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace DIWebSocket.Services
{
    public class DIService : WebSocketBehavior
    {
        protected override void OnOpen()
        {
            Console.WriteLine("open socket");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("close socket");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            var reqInfo = DataConverter.Deserializer<DIServiceRequestModel>(e.Data);
            
            //var retInfo = DataConverter.Serializer<DIServiceRequestModel>(reqInfo);
            this.Send("OK");
        }
    }
}
