using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModuleInterface
{
    public interface ISourceModule
    {
        void SetConfig(string method, Dictionary<string, object> config);

        Dictionary<string,Dictionary<string, object>> GetConfig();

        dynamic GetData(string config, string query, string type, int interval);

        object ExecuteModule(string method);
    }
}
