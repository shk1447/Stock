using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ExternalSourceMoudles;
using Model.Common;
using Model.Request;
using ModuleInterface;

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

        public ISourceModule GetSourceModule(string moduleName)
        {
            return AssemblyLoader.LoadOne<ISourceModule>(moduleName);
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

        public dynamic ModuleDistributor(ExternalSourceClass config)
        {
            return sourceModules[config.ModuleName].GetData(config.Config, config.Query, config.DataType, config.Interval);
        }
    }
}
