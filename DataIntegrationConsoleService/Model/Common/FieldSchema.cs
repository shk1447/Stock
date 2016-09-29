using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    public class FieldSchema
    {
        public string text { get; set; }
        public string value { get; set; }
        public string type { get; set; }
        public int group { get; set; }
        public List<JsonDictionary> options { get; set; }

        public FieldSchema(string text, string value, string type, int group, List<JsonDictionary> options)
        {
            this.text = text; this.value = value; this.type = type; this.group = group;
            this.options = new List<JsonDictionary>();
        }
    }
}
