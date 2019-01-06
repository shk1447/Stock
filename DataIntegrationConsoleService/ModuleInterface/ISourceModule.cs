using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModuleInterface
{
    public interface ISourceModule
    {
        void SetConfig(string method, JsonValue config);

        Dictionary<string,JsonValue> GetConfig();

        dynamic GetData(string config, string query, string type, int interval);

        object ExecuteModule(string method, string collection_name, Func<string, bool> callback);

        void Initialize();
    }
}
