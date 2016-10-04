using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Model.Common;

namespace Model.Response
{
    [DataContract]
    public class Collection
    {
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public string module_name { get; set; }
        [DataMember]
        public string method_name { get; set; }
        [DataMember]
        public JsonDictionary options { get; set; }
        [DataMember]
        public JsonDictionary schedule { get; set; }
        [DataMember]
        public string status { get; set; }
    }
}
