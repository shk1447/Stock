using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading;
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
        private AutoResetEvent sendEvent;
        private ConcurrentQueue<JsonObject> sendQueue;

        public DIService(ref AutoResetEvent sendEvent, ref ConcurrentQueue<JsonObject> sendQueue)
        {
            this.sendEvent = sendEvent;
            this.sendQueue = sendQueue;
        }
        protected override void OnOpen()
        {
            Console.WriteLine("open");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("close");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            var result = new JsonObject();
            var reqInfo = JsonValue.Parse(e.Data);
            foreach (var item in reqInfo)
            {
                result.Add(new KeyValuePair<string, JsonValue>(item.Key, item.Value));
            }
            JsonValue returnString = string.Empty;
            var target = reqInfo["target"].ReadAs<string>();
            var method = reqInfo["method"].ReadAs<string>();
            switch (target.ToLower())
            {
                #region Member
                case "member":
                    {
                        var memberLogic = new MemberLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
                        {
                            case "schema":
                                {
                                    returnString = memberLogic.Schema();
                                    break;
                                }
                            case "access":
                                {

                                    returnString = memberLogic.Access(reqInfo["parameters"]);
                                    break;
                                }
                            case "getlist":
                                {
                                    returnString = memberLogic.GetList();
                                    break;
                                }
                            case "create":
                                {
                                    returnString = memberLogic.Create(reqInfo["parameters"]);
                                    break;
                                }
                            case "modify":
                                {
                                    returnString = memberLogic.Modify(reqInfo["parameters"]);
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
                        var collectionLogic = new CollectionLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
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
                        var analysisLogic = new AnalysisLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
                        {
                            case "schema":
                                {
                                    returnString = analysisLogic.Schema();
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
                        var viewLogic = new ViewLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
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
                                    returnString = viewLogic.Download(reqInfo["parameters"]);
                                    break;
                                }
                        }
                        break;
                    }
                #endregion

                #region Input
                case "input":
                    {
                        var inputLogic = new InputLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
                        {
                            case "getlist":
                                {
                                    returnString = inputLogic.GetList(reqInfo["parameters"]);
                                    break;
                                }
                            case "create":
                                {
                                    returnString = inputLogic.Create(reqInfo["parameters"]);
                                    break;
                                }
                            case "modify":
                                {
                                    returnString = inputLogic.Modify(reqInfo["parameters"]);
                                    break;
                                }
                            case "delete":
                                {
                                    returnString = inputLogic.Delete(reqInfo["parameters"]);
                                    break;
                                }
                        }
                        break;
                    }
                #endregion

                #region Cluster
                case "cluster":
                    {
                        var clusterLogic = new ClusterLogic(ref this.sendEvent, ref this.sendQueue);
                        switch (method.ToLower())
                        {
                            case "schema":
                                {
                                    break;
                                }
                            case "getlist":
                                {
                                    returnString = clusterLogic.GetList(reqInfo["parameters"]);
                                    break;
                                }
                            case "gettab":
                                {
                                    returnString = clusterLogic.GetTab(reqInfo["parameters"]);
                                    break;
                                }
                            case "getplayback":
                                {
                                    returnString = clusterLogic.GetPlayback(reqInfo["parameters"]);
                                    break;
                                }
                        }
                        break;
                    }
                #endregion
            }

            result.Add(new KeyValuePair<string, JsonValue>("result", returnString));
            this.Send(result.ToString());
        }
    }
}
