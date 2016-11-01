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
                #region Member
                case "member":
                    {
                        var memberLogic = new MemberLogic();
                        switch (target[1].ToLower())
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
                        break;
                    }
                #endregion

                #region Collection
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
                                    returnString = collectionLogic.Delete(reqInfo["parameters"]);
                                    break;
                                }
                            case "execute":
                                {
                                    returnString = collectionLogic.Execute(reqInfo["parameters"]);
                                    break;
                                }
                        }
                        break;
                    }
                #endregion

                #region Analysis
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
                        break;
                    }
                #endregion

                #region DataView
                case "view":
                    {
                        var viewLogic = new ViewLogic();
                        switch (target[1].ToLower())
                        {
                            case "schema":
                                {
                                    returnString = viewLogic.Schema();
                                    break;
                                }
                            case "getlist":
                                {
                                    returnString = viewLogic.GetList();
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
                        }
                        break;
                    }
                #endregion
            }

            this.Send(returnString);
        }
    }
}
