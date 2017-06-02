using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataIntegrationServiceLogic
{
    public class ClusterLogic
    {
        private System.Threading.AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<System.Json.JsonObject> concurrentQueue;

        public ClusterLogic(ref System.Threading.AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<System.Json.JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }
        public string Schema()
        {
            return string.Empty;
        }

        public string GetList()
        {
            return string.Empty;
        }
    }
}
