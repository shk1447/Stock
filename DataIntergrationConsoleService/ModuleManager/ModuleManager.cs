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
            var upsertQuery = MariaQueryBuilder.UpsertQuery("datacollection", data);

            MariaDBConnector.Instance.SetQuery(upsertQuery);
        }

        private List<GetCollectionModuleRes> GetCollectionModule(string name)
        {
            var selectedItems = new List<string>() { "name", "modulename", "methodname", "column_json(options) as options", "scheduletime", "unixtime" };
            var whereKV = new Dictionary<string, string>() { { "name", name } };
            var query = MariaQueryBuilder.SelectQuery("datacollection", selectedItems, whereKV);
            return MariaDBConnector.Instance.GetQuery<GetCollectionModuleRes>(query); 
        }

        private ISourceModule GetSourceModule(string moduleName)
        {
            return AssemblyLoader.LoadOne<ISourceModule>(moduleName);
        }

        public void ExecuteModule(string name)
        {
            var moduleInfo = GetCollectionModule(name);

            var whereDict = new Dictionary<string, string>() { { "name", name } };
            var setDict = new Dictionary<string, string>() { { "status", "running" } };
            var statusUpdate = MariaQueryBuilder.UpdateQuery("datacollection", whereDict, setDict);
            MariaDBConnector.Instance.SetQuery(statusUpdate);

            Task.Factory.StartNew(() =>
            {
                foreach (var item in moduleInfo)
                {
                    var moduleName = item.ModuleName;
                    var methodName = item.MethodName;
                    var options = item.Options == null ? new Dictionary<string, object>() : item.Options.GetDictionary();
                    var module = GetSourceModule(moduleName);
                    module.SetConfig(methodName, options);
                    var result = module.ExecuteModule(methodName) as SetDataSourceReq;
                }

                setDict["status"] = "done";
                statusUpdate = MariaQueryBuilder.UpdateQuery("datacollection", whereDict, setDict);
                MariaDBConnector.Instance.SetQuery(statusUpdate);
            });
        }
    }
}
