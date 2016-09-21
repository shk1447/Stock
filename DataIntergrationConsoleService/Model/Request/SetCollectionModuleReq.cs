using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Request
{
    public class SetCollectionModuleReq
    {
        public string name { get; set; }

        public string module_name { get; set; }

        public string method_name { get; set; }

        public JsonDictionary options { get; set; }

        public JsonDictionary schedule { get; set; }
    }
}
