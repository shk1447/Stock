using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Model.Common
{
    /// <summary>
    /// This key value collection is used to serialize a dictionary into json format and back.
    /// </summary>
    [Serializable]
    public sealed class JsonDictionary : ISerializable
    {
        /// <summary>
        /// Holds the internal dictionary.
        /// </summary>
        private readonly Dictionary<String, object> _dictionary;

        /// <summary>
        /// Initializes a new instance of the <see cref="KeyValueCollection"/> class.
        /// </summary>
        public JsonDictionary()
        {
            this._dictionary = new Dictionary<String, object>(StringComparer.InvariantCultureIgnoreCase);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="KeyValueCollection"/> class.
        /// </summary>
        /// 
        public JsonDictionary(Dictionary<String, object> dictionary)
        {
            this._dictionary = new Dictionary<String, object>(dictionary, StringComparer.InvariantCultureIgnoreCase);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="KeyValueCollection"/> class.
        /// </summary>
        /// 
        /// 
        protected JsonDictionary(SerializationInfo info, StreamingContext context) : this()
        {
            foreach (var entry in info)
            {
                this._dictionary.Add(entry.Name, entry.Value);
            }
        }

        /// <summary>
        /// Gets or sets the <see cref="System.String"/> with the specified key.
        /// </summary>
        public object this[String key]
        {
            get
            {
                return !this._dictionary.ContainsKey(key) ? null : this._dictionary[key];
            }
            set
            {
                this._dictionary[key] = value;
            }
        }

        /// <summary>
        /// Gets the internal dictionary as copy.
        /// </summary>
        /// <returns>The internal dictionary as copy.</returns>
        public Dictionary<String, object> GetDictionary()
        {
            return new Dictionary<String, object>(this._dictionary);
        }

        /// <summary>
        /// Populates a SerializationInfo with the data needed to serialize the target object.
        /// </summary>
        /// 
        /// 
        /// <exception cref="T:System.Security.SecurityException">The caller does not have the required permission.</exception>
        void ISerializable.GetObjectData(SerializationInfo info, StreamingContext context)
        {
            foreach (var entry in this._dictionary)
            {
                info.AddValue(entry.Key, entry.Value);
            }
        }

        /// <summary>
        /// Adds the item with the specified key.
        /// </summary>
        /// 
        /// 
        public void Add(String key, object value)
        {
            this[key] = value;
        }
    }
}
