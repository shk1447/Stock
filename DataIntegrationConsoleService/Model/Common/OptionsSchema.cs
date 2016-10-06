using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    [DataContract]
    public class OptionsSchema
    {
        [DataMember]
        public string value { get; set; }

        [DataMember]
        public string text { get; set; }

        [DataMember(IsRequired=false, EmitDefaultValue=false)]
        public List<FieldSchema> fields { get; set; }
    }
}
