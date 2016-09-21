using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    public class GetDataStructureRes
    {
        public List<JsonDictionary> data_structure { get; set; }

        public GetDataStructureRes()
        {
            this.data_structure = new List<JsonDictionary>();
        }
    }
}
