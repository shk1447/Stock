using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Log;
using Newtonsoft.Json.Linq;
using ServiceStack.Text;
using Newtonsoft.Json;

namespace Helper
{
    public static class DataConverter
    {
        public static string DataTableToJSON(DataTable dataTable)
        {
            var lst = dataTable.AsEnumerable()
                .Select(r => r.Table.Columns.Cast<DataColumn>()
                        .Select(c => new KeyValuePair<string, object>(c.ColumnName, r[c.Ordinal])
                       ).ToDictionary(z => z.Key, z => z.Value.GetType() == typeof(byte[]) ? 
                           Encoding.Default.GetString(z.Value as byte[]) : z.Value)).ToList();

            return JsonConvert.SerializeObject(lst);
        }

        public static string JsonToDataTable(DataTable dt)
        {
            try
            {
                var serializer = new JsonStringSerializer();

                var dict = new List<Dictionary<String, Object>>();
                foreach (DataRow row in dt.Rows)
                {
                    var dic = new Dictionary<String, Object>();

                    foreach (DataColumn col in dt.Columns)
                    {
                        var value = row[col];
                        if (value == DBNull.Value)
                            value = "";
                        else if (value.GetType() == typeof(byte[]))
                        {
                            value = serializer.DeserializeFromString<Dictionary<string, dynamic>>(Encoding.UTF8.GetString(value as byte[]));
                        }
                        else
                        {
                            value = value.ToString();
                        }

                        dic[col.ColumnName] = value;
                    }
                    dict.Add(dic);
                }

                var jsonString = serializer.SerializeToString<dynamic>(dict).Replace(@"\", "");

                return jsonString;
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                return null;
            }
        }

        public static List<Dictionary<object, object>> ListToDataTable(DataTable dt)
        {
            try
            {
                var serializer = new JsonStringSerializer();
                var dict = new List<Dictionary<object, object>>();
                foreach (DataRow row in dt.Rows)
                {
                    var dic = new Dictionary<object, object>();

                    foreach (DataColumn col in dt.Columns)
                    {
                        var value = row[col];
                        if (value == DBNull.Value)
                            value = "";
                        else if (value.GetType() == typeof(byte[]))
                        {
                            value = serializer.DeserializeFromString<Dictionary<string, dynamic>>(Encoding.UTF8.GetString(value as byte[]));
                        }

                        dic[col.ColumnName] = value;
                    }
                    dict.Add(dic);
                }

                return dict;
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                return null;
            }
        }


        public static string DataTableToXml(DataTable dataTable)
        {
            StringWriter writer = new StringWriter();
            dataTable.WriteXml(writer, true);
            return writer.ToString();
        }

        public static T JsonToDictionary<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
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
