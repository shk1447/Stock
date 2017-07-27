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
using HtmlAgilityPack;

namespace SourceModuleManager
{
    public class ModuleManager
    {
        private nvParser assem01 = new nvParser();
        private HtmlDocument assem02 = new HtmlDocument();

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

        public void Initialize()
        {
            foreach (var module in this.sourceModules)
            {
                module.Value.Initialize();
            }
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

        public void ExecuteModule(JsonValue moduleInfo, Func<string, bool> event_callback)
        {
            var collectionName = moduleInfo["name"].ReadAs<string>();
            var moduleName = moduleInfo["module_name"].ReadAs<string>();
            var methodName = moduleInfo["method_name"].ReadAs<string>();

            var module = this.sourceModules[moduleName];
            if (moduleInfo["options"] != null)
                module.SetConfig(methodName, moduleInfo["options"]);

            module.ExecuteModule(methodName, collectionName, event_callback);
        }
    }
}
