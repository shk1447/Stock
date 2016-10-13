using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    [DataContract]
    public class DataSchema
    {
        [DataMember]
        public string name { get; set; }

        [DataMember]
        public List<DataSchema> items { get; set; }

        public DataSchema(string name)
        {
            this.name = name;
        }

        public DataSchema AddItem(DataSchema schema)
        {
            if (this.items == null) { this.items = new List<DataSchema>(); }
            this.items.Add(schema);
            return this;
        }
    }
}
