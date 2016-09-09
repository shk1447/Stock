using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResponseModel
{
    public class GetDataSourceRes
    {
        private Dictionary<string, object> rawdata;

        public Dictionary<string, object> RawData
        {
            get
            {
                return this.rawdata;
            }
            set
            {
                this.rawdata = value;
            }
        }

        public GetDataSourceRes()
        {
            this.rawdata = new Dictionary<string, object>();
        }
    }
}
