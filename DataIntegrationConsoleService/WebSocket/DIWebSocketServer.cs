using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp.Server;

namespace DIWebSocket
{
    public class DIWebSocketServer
    {
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
            var services = Assembly.GetExecutingAssembly().DefinedTypes.Where(t => t.BaseType == typeof(WebSocketBehavior));
            var method = this.server.GetType().GetMethods().FirstOrDefault(item =>
                item.Name == "AddWebSocketService" && item.GetParameters().Length == 1 && item.GetParameters().First().Name.Equals("path", StringComparison.OrdinalIgnoreCase)
            );

            if (method == null)
            {
                throw new Exception("Not AddWebSocketService Method");
            }

            foreach (var service in services)
            {
                method.MakeGenericMethod(service).Invoke(this.server, new object[] { "/" + service.Name });
            }
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
