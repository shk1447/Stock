using System;
using System.Collections.Generic;
using System.Json;
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
            var reqInfo = JsonValue.Parse(e.Data);   
            
            var returnString = string.Empty;
            var target = reqInfo["target"].ReadAs<string>().Split('.');
            switch (target[0].ToLower())
            {
                case "member":
                    {
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
                                    var result = memberLoic.Access(reqInfo["parameters"]);
                                    returnString = result;
                                    break;
                                }
                            case "getlist":
                                {
                                    var result = memberLoic.GetList();
                                    returnString = result;
                                    break;
                                }
                            case "create":
                                {
                                    var result = memberLoic.Create(reqInfo["parameters"]);
                                    returnString = result;
                                    break;
                                }
                            case "modify":
                                {
                                    var result = memberLoic.Modify(reqInfo["parameters"]);
                                    returnString = result;
                                    break;
                                }
                            case "delete":
                                {
                                    break;
                                }
                        }
                        break;
                    }
                case "collection":
                    {
                        var collectionLogic = new CollectionLogic();
                        switch (target[1].ToLower())
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
                                    break;
                                }
                            case "execute":
                                {
                                    break;
                                }
                        }
                        break;
                    }
                case "analysis":
                    {
                        var analysisLogic = new AnalysisLogic();
                        switch (target[1].ToLower())
                        {
                            case "schema":
                                {
                                    var result = analysisLogic.Schema();
                                    returnString = result;
                                    break;
                                }
                            case "getlist":
                                {
                                    break;
                                }
                            case "create":
                                {
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
                            case "execute":
                                {
                                    break;
                                }
                        }
                        break;
                    }
            }

            this.Send(returnString);
        }
    }
}
