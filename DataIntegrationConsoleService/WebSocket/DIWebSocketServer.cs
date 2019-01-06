using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DataIntegrationServiceLogic;
using DIWebSocket.Services;
using Model.Request;
using WebSocketSharp.Server;

namespace DIWebSocket
{
    public class DIWebSocketServer
    {
        /// <summary>
        /// 서버 자체에서 연결되어진 클라이언트에게 이벤트를 발생
        /// </summary>
        public Thread sendingThread = null;
        public AutoResetEvent sendEvent = new AutoResetEvent(false);
        public ConcurrentQueue<JsonObject> sendQueue = new ConcurrentQueue<JsonObject>();

        private void SendingThread()
        {
            while (true)
            {
                sendEvent.WaitOne();
                JsonObject jsonObj = null;
                if (sendQueue.TryDequeue(out jsonObj))
                {
                    this.server.WebSocketServices.Broadcast(jsonObj.ToString());
                    // this.Send(jsonObj.ToString());
                    // broad cast에 대한 로직 추가 예정
                    // this.Sessions.Broadcast(jsonObj.ToString());
                }
            }
        }

        #region | Private |
        public WebSocketServer server;
        #endregion

        #region | Singleton |
        private static DIWebSocketServer instance;
        /// <summary>
        /// WSWebSocketServer SingleTon Instance
        /// </summary>
        public static DIWebSocketServer Instance
        {
            get
            {
                return instance ?? (instance = new DIWebSocketServer());
            }
        }
        #endregion

        private void SetServices()
        {
            this.server.AddWebSocketService<DIService>("/diservice", initializer);
        }

        private DIService initializer()
        {
            var init = new DIService(ref sendEvent, ref sendQueue);

            return init;
        }

        /// <summary>
        /// Web Socket Start
        /// </summary>
        /// <param name="url"></param>
        public void Start(string port)
        {
            if (this.server != null)
            {
                return;
            }

            Console.WriteLine("Web Socket Server Start : ws://" + System.Net.IPAddress.Any + ":" + port);
            this.server = new WebSocketServer(System.Net.IPAddress.Any, Convert.ToInt32(port));
            SetServices();
            this.server.Start();
            this.sendingThread = new Thread(SendingThread);
            this.sendingThread.Start();
        }

        /// <summary>
        /// Web Socket Stop
        /// </summary>
        public void Stop()
        {
            this.server.Stop();
        }
    }
}
