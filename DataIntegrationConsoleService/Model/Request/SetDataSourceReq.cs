using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Request
{
    public class SetDataSourceReq
    {
        public string source { get; set; }

        public string category { get; set; }

        public List<JsonDictionary> rawdata { get; set; }

        public string collected_at { get; set; }
    }
}
