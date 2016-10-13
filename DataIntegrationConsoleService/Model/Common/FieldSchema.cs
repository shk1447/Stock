using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    [DataContract]
    public class FieldSchema
    {
        [DataMember]
        public string text { get; set; }

        [DataMember]
        public string value { get; set; }

        [DataMember]
        public string type { get; set; }

        [DataMember]
        public int group { get; set; }

        [DataMember]
        public bool required { get; set; }

        [DataMember(IsRequired = false, EmitDefaultValue = false)]
        public string datakey { get; set; }

        [DataMember(IsRequired = false, EmitDefaultValue = false)]
        public bool temp { get; set; }

        [DataMember(IsRequired = false, EmitDefaultValue = false)]
        public bool dynamic { get; set; } 

        [DataMember]
        public JsonDictionary attributes { get; set; }

        [DataMember]
        public List<OptionsSchema> options { get; set; }

        [DataMember(IsRequired = false, EmitDefaultValue = false)]
        public List<DataSchema> schema { get; set; }

        public FieldSchema(string text, string value, string type, int group, bool required = false)
        {
            this.text = text; this.value = value; this.type = type; this.group = group; this.required = required;
            this.attributes = new JsonDictionary();
            this.options = new List<OptionsSchema>();
        }

        public FieldSchema AddAttributes(string key, object value)
        {
            this.attributes.Add(key, value);
            return this;
        }

        public FieldSchema AddOptions(OptionsSchema option)
        {
            this.options.Add(option);
            return this;
        }

        public FieldSchema AddSchema(DataSchema schema)
        {
            this.schema.Add(schema);
            return this;
        }
    }
}
