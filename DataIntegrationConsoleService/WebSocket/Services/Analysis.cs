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
    public class Analysis : WebSocketBehavior
    {
        protected override void OnOpen()
        {
            //Console.WriteLine("open socket");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            //Console.WriteLine("close socket");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            var returnString = string.Empty;
            var reqInfo = JsonValue.Parse(e.Data);
            var target = reqInfo["method"].ReadAs<string>();

            var analysisLogic = new AnalysisLogic();
            switch (target.ToLower())
            {
                case "schema":
                    {
                        var result = analysisLogic.Schema();
                        returnString = result;
                        break;
                    }
                case "getlist":
                    {
                        returnString = analysisLogic.GetList();
                        break;
                    }
                case "create":
                    {
                        returnString = analysisLogic.Create(reqInfo["parameters"]);
                        break;
                    }
                case "modify":
                    {
                        returnString = analysisLogic.Modify(reqInfo["parameters"]);
                        break;
                    }
                case "delete":
                    {
                        returnString = analysisLogic.Delete(reqInfo["parameters"]);
                        break;
                    }
                case "execute":
                    {
                        returnString = analysisLogic.Execute(reqInfo["parameters"]);
                        break;
                    }
            }

            this.Send(returnString);
        }
    }
}
