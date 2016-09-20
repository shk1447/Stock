using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Request
{
    public class SetCollectionModuleReq
    {
        private string name;
        private string moduleName;
        private string methodName;
        private JsonDictionary options;
        private JsonDictionary schedule;

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

        public string ModuleName
        {
            get
            {
                return this.moduleName;
            }
            set
            {
                this.moduleName = value;
            }
        }

        public string MethodName
        {
            get
            {
                return this.methodName;
            }
            set
            {
                this.methodName = value;
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

        public JsonDictionary Schedule
        {
            get
            {
                return this.schedule;
            }
            set
            {
                this.schedule = value;
            }
        }
    }
}
