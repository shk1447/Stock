using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RequestModel
{
    public class ExternalSourceClass
    {
        public string SourceKey { get; set; }

        public string ModuleName { get; set; }

        public string Config { get; set; }

        public string Query { get; set; }

        public string DataType { get; set; }

        public int Interval { get; set; }
    }
}
