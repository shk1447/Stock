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
            var resInfo = new DIServiceResponseModel();
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
                                var message = memberLoic.Access(member_id, password);
                                resInfo.message = message;
                                break;
                            }
                        case "create":
                            {
                                var member_id = reqInfo.parameters["member_id"].ToString();
                                var member_name = reqInfo.parameters["member_name"].ToString();
                                var password = reqInfo.parameters["password"].ToString();
                                var privilege = reqInfo.parameters["privilege"].ToString();
                                var email = reqInfo.parameters["email"].ToString();
                                var phone_number = reqInfo.parameters["phone_number"].ToString();
                                var message = memberLoic.Create(member_id, member_name, password, privilege, email, phone_number);
                                resInfo.message = message;
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
            var retInfo = DataConverter.Serializer<DIServiceResponseModel>(resInfo);
            this.Send(retInfo);
        }
    }
}
