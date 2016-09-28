using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataIntegrationServiceLogic;
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
            var returnString = string.Empty;
            var target = reqInfo.target.Split('.');
            switch (target[0].ToLower())
            {
                case "member" :
                    var memberLoic = new MemberLogic();
                    switch (target[1].ToLower())
                    {
                        case "access":
                            {                                
                                var member_id = reqInfo.parameters["member_id"].ToString();
                                var password = reqInfo.parameters["password"].ToString();
                                var result = memberLoic.Access(member_id, password);
                                returnString = result;
                                break;
                            }
                        case "create":
                            {
                                var result = memberLoic.Create(reqInfo.parameters);
                                returnString = result;
                                break;
                            }
                        case "modify":
                            {
                                break;
                            }
                        case "delete":
                            {
                                break;
                            }
                    }
                    break;
            }

            this.Send(returnString);
        }
    }
}
