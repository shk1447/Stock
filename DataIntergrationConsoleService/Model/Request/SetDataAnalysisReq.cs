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
        private string name;
        private string source;
        private List<string> categories;
        private string collectedAt;
        private string analysisQuery;
        private JsonDictionary options;
        private string scheduletime;

        public string Name
        {
            get
            {
                return this.name;
            }
            set
            {
                this.name = value;
            }
        }

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

        public List<string> Categories
        {
            get
            {
                return this.categories;
            }
            set
            {
                this.categories = value;
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

        public string AnalysisQuery
        {
            get
            {
                return this.analysisQuery;
            }
            set
            {
                this.analysisQuery = value;
            }
        }

        public JsonDictionary Options
        {
            get
            {
                return this.options;
            }
            set
            {
                this.options = value;
            }
        }

        public string ScheduleTime
        {
            get
            {
                return this.scheduletime;
            }
            set
            {
                this.scheduletime = value;
            }
        }
    }
}
