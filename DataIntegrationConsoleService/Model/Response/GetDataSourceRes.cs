using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetDataSourceRes
    {
        public List<JsonDictionary> rawdata { get; set; }

        public GetDataSourceRes()
        {
            this.rawdata = new List<JsonDictionary>();
        }
    }
}
