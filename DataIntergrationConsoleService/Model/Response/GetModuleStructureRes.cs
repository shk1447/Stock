using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetModuleStructureRes
    {
        public Dictionary<string, Dictionary<string, JsonDictionary>> collection_modules { get; set; }

        public GetModuleStructureRes()
        {
            this.collection_modules = new Dictionary<string, Dictionary<string, JsonDictionary>>();
        }
    }
}
