using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Model.Common;
using Model.Request;
using ModuleInterface;
using Helper;
using Model.Response;
using System.Json;

namespace SourceModuleManager
{
    public class ModuleManager
    {
        private static ModuleManager instance;

        private Dictionary<string, ISourceModule> sourceModules = new Dictionary<string, ISourceModule>();

        public Dictionary<string, ISourceModule> SourceModules
        {
            get
            {
                return this.sourceModules;
            }
        }

        public static ModuleManager Instance
        {
            get
            {
                if (instance != null)
                {
                    return instance;
                }

                instance = new ModuleManager();

                return instance;
            }
        }

        public ModuleManager()
        {
            this.sourceModules = AssemblyLoader.LoadAll<ISourceModule>();
        }

        public Dictionary<string, Dictionary<string, JsonValue>> GetSourceModuleInfo()
        {
            var sourceDict = new Dictionary<string,Dictionary<string, JsonValue>>();

            foreach (var module in this.sourceModules)
            {
                var methodDict = new Dictionary<string, JsonValue>();
                foreach (var method in module.Value.GetConfig())
                {
                    var jsonConfig = method.Value;
                    methodDict.Add(method.Key, jsonConfig);
                }

                sourceDict.Add(module.Key, methodDict);
            }

            return sourceDict;
        }

        public void SetCollectionModule(Dictionary<string, object> data)
        {
            var tableName = "data_collection";
            var upsertQuery = MariaQueryBuilder.UpsertQuery(tableName, data);

            MariaDBConnector.Instance.SetQuery(upsertQuery);
        }

        private ISourceModule GetSourceModule(string moduleName)
        {
            return AssemblyLoader.LoadOne<ISourceModule>(moduleName);
        }

        public void ExecuteModule(JsonValue moduleInfo)
        {
            var assembly = new nvParser();
            var moduleName = moduleInfo["module_name"].ReadAs<string>();
            var methodName = moduleInfo["method_name"].ReadAs<string>();

            var module = GetSourceModule(moduleName);
            if (moduleInfo["options"] != null)
                module.SetConfig(methodName, moduleInfo["options"]);

            module.ExecuteModule(methodName);

            var whereDict = new Dictionary<string, object>() { { "name", moduleInfo["name"].ReadAs<string>() } };
            var setDict = new Dictionary<string, object>() { { "status", "done" } };
            var statusUpdate = MariaQueryBuilder.UpdateQuery("data_collection", whereDict, setDict);
            MariaDBConnector.Instance.SetQuery(statusUpdate);
        }
    }
}
