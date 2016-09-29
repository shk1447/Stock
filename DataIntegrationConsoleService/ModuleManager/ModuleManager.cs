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

        public Dictionary<string, Dictionary<string, JsonDictionary>> GetSourceModuleInfo()
        {
            var sourceDict = new Dictionary<string,Dictionary<string, JsonDictionary>>();

            foreach (var module in this.sourceModules)
            {
                var methodDict = new Dictionary<string, JsonDictionary>();
                foreach (var method in module.Value.GetConfig())
                {
                    var jsonConfig = new JsonDictionary(method.Value);
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

        public void ExecuteModule(GetCollectionModuleRes moduleInfo)
        {
            var assembly = new nvParser();
            var moduleName = moduleInfo.module_name;
            var methodName = moduleInfo.method_name;

            var module = GetSourceModule(moduleName);
            if (moduleInfo.options != null)
                module.SetConfig(methodName, moduleInfo.options.GetDictionary());

            module.ExecuteModule(methodName);

            var whereDict = new Dictionary<string, object>() { { "name", moduleInfo.name } };
            var setDict = new Dictionary<string, object>() { { "status", "done" } };
            var statusUpdate = MariaQueryBuilder.UpdateQuery("data_collection", whereDict, setDict);
            MariaDBConnector.Instance.SetQuery(statusUpdate);
        }
    }
}
