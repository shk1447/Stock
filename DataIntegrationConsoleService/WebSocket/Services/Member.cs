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
    public class Member : WebSocketBehavior
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

            var memberLogic = new MemberLogic();
            switch (target.ToLower())
            {
                case "schema":
                    {
                        returnString = memberLogic.Schema();
                        break;
                    }
                case "access":
                    {
                        var result = memberLogic.Access(reqInfo["parameters"]);
                        returnString = result;
                        break;
                    }
                case "getlist":
                    {
                        var result = memberLogic.GetList();
                        returnString = result;
                        break;
                    }
                case "create":
                    {
                        var result = memberLogic.Create(reqInfo["parameters"]);
                        returnString = result;
                        break;
                    }
                case "modify":
                    {
                        var result = memberLogic.Modify(reqInfo["parameters"]);
                        returnString = result;
                        break;
                    }
                case "delete":
                    {
                        returnString = memberLogic.Delete(reqInfo["parameters"]);
                        break;
                    }
            }
            
            this.Send(returnString);
        }
    }
}
