﻿using System;
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
        [DataMember]
        public JsonDictionary attributes { get; set; }
        [DataMember]
        public List<JsonDictionary> options { get; set; }

        public FieldSchema(string text, string value, string type, int group, bool required = false)
        {
            this.text = text; this.value = value; this.type = type; this.group = group; this.required = required;
            this.attributes = new JsonDictionary();
            this.options = new List<JsonDictionary>();
        }

        public FieldSchema AddAttributes(string key, object value)
        {
            this.attributes.Add(key, value);
            return this;
        }

        public FieldSchema AddOptions(JsonDictionary option)
        {
            this.options.Add(option);
            return this;
        }
    }
}