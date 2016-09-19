using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;
using Model.Request;

namespace Connector
{
    public class MariaQueryBuilder
    {
        public static string SetDataSource(SetDataSourceReq param)
        {
            var query = CreateSourceTable(param.Source);
            query = InsertSource(param.Source, param.Category, param.RawData, param.CollectedAt, query);
            return query;
        }

        public static string UpsertQuery(string table, Dictionary<string, object> row)
        {
            var query = "INSERT INTO " + table;
            var columninfo = "(";
            foreach (var column in row)
            {
                columninfo = columninfo + "`" + column.Key + "`,";
            }

            query = query + columninfo.Substring(0, columninfo.Length - 1) + ") VALUES ";
            var lastData = new Dictionary<string, object>();
            var updateQuery = " ON DUPLICATE KEY UPDATE ";
            var values = "(";
            foreach (var kv in row)
            {
                if (columninfo.Contains(kv.Key))
                {
                    var value = "\"\"";
                    if (kv.Value != null)
                    {
                        if (kv.Value.GetType().Name == "JsonDictionary")
                        {
                            var test = kv.Value as JsonDictionary;
                            value = JsonToColumnCreate(test.GetDictionary(), ref lastData);
                        }
                        else if (kv.Value.GetType().Name == "List`1")
                        {
                            var list = kv.Value as List<string>;
                            value = "[]:";
                            foreach (var v in list)
                            {
                                value = value + v + ",";
                            }
                            value = list.Count > 0 ? value.Substring(0, value.Length - 1) : value;
                            value = "\"" + value + "\"";
                        }
                        else
                        {
                            value = "\"" + kv.Value.ToString() + "\"";
                        }
                    }
                    values = values + value + ",";
                    updateQuery = updateQuery + kv.Key + " = " + value + ",";
                }
            }
            query = query + values.Substring(0, values.Length - 1) + ")";

            query = query + updateQuery.Substring(0, updateQuery.Length - 1) + ";";

            return query;
        }

        public static string InsertSource(string source, string category, List<JsonDictionary> rawData, string collectedAt, string query)
        {
            var currentQuery = "INSERT INTO current_" + source + " (category, rawdata, unixtime) VALUES ";
            var pastQuery = "INSERT INTO past_" + source + " (category, rawdata, unixtime) VALUES ";
            var collectedDate = "CURTIME(3)";
            var lastRawData = new Dictionary<string, object>();

            foreach (var item in rawData)
            {
                var itemDict = item.GetDictionary();
                if (itemDict.Count == 0) continue;
                var dynamicCategory = category;
                if (itemDict.ContainsKey(collectedAt)) collectedDate = "FROM_UNIXTIME(" + itemDict[collectedAt].ToString() + ")";
                if (itemDict.ContainsKey(category)) dynamicCategory = itemDict[category].ToString();

                var createQuery = JsonToColumnCreate(itemDict, ref lastRawData);

                pastQuery = pastQuery + "(\"" + dynamicCategory + "\"," + createQuery + ", " + collectedDate + "),";
                currentQuery = currentQuery + "(\"" + dynamicCategory + "\"," + createQuery + ", " + collectedDate + "),";
            }

            var updateQuery = JsonToColumnAdd(lastRawData, "rawdata");

            query = query + pastQuery.Substring(0, pastQuery.Length - 1) + ";";
            query = query + currentQuery.Substring(0, currentQuery.Length - 1) + " ON DUPLICATE KEY UPDATE rawdata = " + updateQuery + ",unixtime = " + collectedDate + ";";
            return query;
        }

        public static string CreateSourceTable(string source)
        {
            var currentTable = "current_" + source;
            var pastTable = "past_" + source;
            var query = MariaQueryDefine.createCurrentTable.Replace("{tableName}", currentTable) + MariaQueryDefine.createPastTable.Replace("{tableName}", pastTable);

            return query;
        }

        public static string JsonToColumnCreate(Dictionary<string,object> jsonObj, ref Dictionary<string, object> lastData)
        {
            var kvString = "COLUMN_CREATE(";

            foreach (var kv in jsonObj)
            {
                kvString = kvString + "\"" + kv.Key + "\",\"" + kv.Value + "\",";

                if (!lastData.ContainsKey(kv.Key))
                {
                    lastData.Add(kv.Key, kv.Value);
                }
                else
                {
                    lastData[kv.Key] = kv.Value;
                }
            }

            kvString = kvString.Substring(0, kvString.Length - 1) + ")"; ;

            return kvString;
        }

        public static string JsonToColumnAdd(Dictionary<string,object> jsonObj, string columnName)
        {
            var kvString = "COLUMN_ADD(" + columnName + ",";

            foreach (var kv in jsonObj)
            {
                kvString = kvString + "\"" + kv.Key + "\",\"" + kv.Value + "\",";
            }

            kvString = kvString.Substring(0, kvString.Length - 1) + ")"; ;

            return kvString;
        }

        public static string GetDataStructure(List<JsonDictionary> listInfo)
        {
            var indexing = 1;
            var resultQuery = string.Empty;
            foreach (JsonDictionary items in listInfo)
            {
                var source = items["TABLE_NAME"].ToString().Replace("current_", "");
                resultQuery = resultQuery + MariaQueryDefine.getStructureInformation.Replace("{source}", source);
                if (listInfo.Count != indexing)
                    resultQuery = resultQuery + " UNION ALL ";
                indexing++;
            }
            return resultQuery;
        }
    }
}
