using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Log;
using Model.Common;
using Newtonsoft.Json.Linq;
using ServiceStack.Text;

namespace Helper
{
    public static class DataConverter
    {
        public static List<JsonDictionary> JsonToDataTable(DataTable dt)
        {
            try
            {
                var dict = new List<JsonDictionary>();
                foreach (DataRow row in dt.Rows)
                {
                    var dic = new JsonDictionary();

                    foreach (DataColumn col in dt.Columns)
                    {
                        var value = row[col];
                        if (value == DBNull.Value)
                            value = "";
                        else if (value.GetType() == typeof(byte[]))
                            value = Encoding.UTF8.GetString(value as byte[]);
                        

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
    }
}
