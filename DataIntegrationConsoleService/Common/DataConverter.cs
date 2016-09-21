using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Runtime.Serialization.Json;

namespace Helper
{
    public static class DataConverter
    {
        public static T JsonToDictionary<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static T Deserializer<T>(string json)
        {
            using (var ms = new MemoryStream(Encoding.Unicode.GetBytes(json)))
            {
                var serializer = new DataContractJsonSerializer(typeof(T));
                return (T)serializer.ReadObject(ms);
            }
        }

        public static string DynamicToString(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static dynamic StringToDynamic(string jsonText)
        {
            dynamic dson = JObject.Parse(jsonText);
            return dson;
        }

        public static dynamic ObjectToDynamic(object target)
        {
            dynamic dson = JArray.FromObject(target);
            return dson;
        }
    }
}
