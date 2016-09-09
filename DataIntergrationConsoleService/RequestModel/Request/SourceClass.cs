using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RequestModel
{
    public class SourceClass
    {
        public string Source { get; set; }

        public List<Dictionary<object, object>> Data { get; set; }

        public string TimeField { get; set; }
    }
}