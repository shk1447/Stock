using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetDataViewRes
    {
        public string name { get; set; }

        public string view_type { get; set; }

        public string view_query { get; set; }

        public JsonDictionary options { get; set; }

        public DateTime unixtime { get; set; }
    }
}
