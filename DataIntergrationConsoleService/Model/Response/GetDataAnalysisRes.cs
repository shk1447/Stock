using Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Response
{
    public class GetDataAnalysisRes
    {
        public string name { get; set; }

        public string source { get; set; }

        public List<string> categories { get; set; }

        public JsonDictionary options { get; set; }
    }
}
