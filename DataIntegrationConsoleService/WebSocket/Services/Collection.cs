using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataIntegrationServiceLogic;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace DIWebSocket.Services
{
    public class Collection : WebSocketBehavior
    {
        protected override void OnOpen()
        {
            Console.WriteLine("onOpen socket collection");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("onClose socket collection");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("onMessage socket collection");

            var returnString = string.Empty;
            var reqInfo = JsonValue.Parse(e.Data);
            var target = reqInfo["method"].ReadAs<string>();

            var collectionLogic = new CollectionLogic();
            switch (target.ToLower())
            {
                case "schema":
                    {
                        returnString = collectionLogic.Schema();
                        break;
                    }
                case "getlist":
                    {
                        returnString = collectionLogic.GetList();
                        break;
                    }
                case "create":
                    {
                        returnString = collectionLogic.Create(reqInfo["parameters"]);
                        break;
                    }
                case "modify":
                    {
                        returnString = collectionLogic.Modify(reqInfo["parameters"]);
                        break;
                    }
                case "delete":
                    {
                        returnString = collectionLogic.Delete(reqInfo["parameters"]);
                        break;
                    }
                case "execute":
                    {
                        returnString = collectionLogic.Execute(reqInfo["parameters"]);
                        break;
                    }
            }

            this.Send(returnString);
        }
    }
}
