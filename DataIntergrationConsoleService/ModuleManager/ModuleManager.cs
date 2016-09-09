using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ExternalSourceMoudles;
using Model.Request;
using ModuleInterface;

namespace ExternalModuleManger
{
    public class ModuleManager
    {
        private static ModuleManager instance;

        private Dictionary<string, ISourceModule> sourceModules = new Dictionary<string, ISourceModule>();

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
            var module = new RestReceiver();
            sourceModules.Add("RestReceiver", module);
        }

        public dynamic ModuleDistributor(ExternalSourceClass config)
        {
            return sourceModules[config.ModuleName].GetData(config.Config, config.Query, config.DataType, config.Interval);
        }
    }
}
