using Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Request
{
    public class SetDataAnalysisReq
    {
        public string name { get; set; }

        public string source { get; set; }

        public List<string> categories { get; set; }

        public string collected_at { get; set; }

        public string analysis_query { get; set; }

        public JsonDictionary options { get; set; }

        public JsonDictionary schedule { get; set; }
    }
}
