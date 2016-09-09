using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Request
{
    public class GetDataSourceReq
    {
        private string query;

        public string Query
        {
            get
            {
                return this.query;
            }
            set
            {
                this.query = value;
            }
        }
    }
}
