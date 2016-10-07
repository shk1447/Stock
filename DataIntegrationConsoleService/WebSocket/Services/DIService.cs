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
                        case "schema":
                            {
                                returnString = memberLoic.Schema();
                                break;
                            }
                        case "access":
                            {                                
                                var result = memberLoic.Access(reqInfo.parameters);
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
                case "collection" :
                    var collectionLogic = new CollectionLogic();
                    switch (target[1].ToLower())
                    {
                        case "getlist":
                            {
                                returnString = collectionLogic.GetList();
                                break;
                            }
                        case "schema":
                            {
                                returnString = collectionLogic.Schema();
                                break;
                            }
                        case "create":
                            {
                                returnString = collectionLogic.Create(reqInfo.parameters);
                                break;
                            }
                        case "modify":
                            {
                                returnString = collectionLogic.Modify(reqInfo.parameters);
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
