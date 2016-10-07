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

        public OptionsSchema(string value, string text)
        {
            this.value = value;
            this.text = text;
        }

        public OptionsSchema AddFields(FieldSchema field)
        {
            if (this.fields == null) { this.fields = new List<FieldSchema>(); }
            this.fields.Add(field);

            return this;
        }
    }
}
