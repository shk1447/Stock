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

        private List<JsonDictionary> GetCollectionModule(string name)
        {
            return MariaDBConnector.Instance.GetQuery("SELECT name,modulename,methodname,COLUMN_JSON(options) as options,scheduletime,unixtime FROM datacollection WHERE name = '" + name + "';");
        }

        private ISourceModule GetSourceModule(string moduleName)
        {
            return AssemblyLoader.LoadOne<ISourceModule>(moduleName);
        }

        public void ExecuteModule(string name)
        {
            var moduleInfo = GetCollectionModule(name);

            foreach (var item in moduleInfo)
            {
                var moduleName = item["modulename"].ToString();
                var methodName = item["methodname"].ToString();
                var options = DataConverter.JsonToDictionary<JsonDictionary>(item["options"].ToString()).GetDictionary();
                 
                var module = GetSourceModule(moduleName);
                module.SetConfig(methodName, options);
                var result = module.ExecuteModule(methodName) as SetDataSourceReq;
            }

            //module.ExecuteModule(methodName);
            //MariaDBConnector.Instance.SetQuery();
        }

    }
}
