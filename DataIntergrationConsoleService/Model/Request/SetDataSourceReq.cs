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
        private string source;
        private string category;
        private List<JsonDictionary> rawdata;
        private string collectedAt;

        public string Source
        {
            get
            {
                return this.source;
            }
            set
            {
                this.source = value;
            }
        }

        public string Category
        {
            get
            {
                return this.category;
            }
            set
            {
                this.category = value;
            }
        }

        public List<JsonDictionary> RawData
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

        public string CollectedAt
        {
            get
            {
                return this.collectedAt;
            }
            set
            {
                this.collectedAt = value;
            }
        }
    }
}
