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
    public class View : WebSocketBehavior
    {
        protected override void OnOpen()
        {
            Console.WriteLine("onOpen socket view");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("onClose socket view");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("onNessage socket view");
            var returnString = string.Empty;
            var reqInfo = JsonValue.Parse(e.Data);
            var target = reqInfo["method"].ReadAs<string>();

            byte[] file = null;
            bool isFile = false;
            var viewLogic = new ViewLogic();
            switch (target.ToLower())
            {
                case "schema":
                    {
                        returnString = viewLogic.Schema(reqInfo["parameters"]["privilege"].ReadAs<string>());
                        break;
                    }
                case "getlist":
                    {
                        returnString = viewLogic.GetList(reqInfo["parameters"]);
                        break;
                    }
                case "create":
                    {
                        returnString = viewLogic.Create(reqInfo["parameters"]);
                        break;
                    }
                case "modify":
                    {
                        returnString = viewLogic.Modify(reqInfo["parameters"]);
                        break;
                    }
                case "delete":
                    {
                        returnString = viewLogic.Delete(reqInfo["parameters"]);
                        break;
                    }
                case "execute":
                    {
                        returnString = viewLogic.Execute(reqInfo["parameters"]);
                        break;
                    }
                case "execute_item":
                    {
                        returnString = viewLogic.ExecuteItem(reqInfo["parameters"]);
                        break;
                    }
                case "download":
                    {
                        isFile = true;
                        file = viewLogic.Download(reqInfo["parameters"]);
                        break;
                    }
            }

            if (isFile)
            {
                this.Send(file);
            }
            else
            {
                this.Send(returnString);
            }
        }
    }
}
