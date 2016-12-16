using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Common;
using Model.Request;
using System.Json;

namespace Connector
{
    public class MariaQueryBuilder
    {
        public static string SetDataSource(SetDataSourceReq param)
        {
            var query = CreateSourceTable(param.source);
            query = InsertSource(param.source, param.category, param.rawdata, param.collected_at, query);
            return query;
        }

        public static string SelectQuery(string table, List<string> selectedItems, JsonValue where = null)
        {
            var query = "SELECT ";

            var count = 1;
            foreach (var item in selectedItems)
            {
                var separator = count < selectedItems.Count ? ", " : "";
                query = query + item + separator;
                count++;
            }
            query = query + " FROM " + table;
            if (where != null)
            {
                query = query + " WHERE ";
                count = 1;
                foreach (var kv in where)
                {
                    var separator = count < where.Count ? "AND " : "";
                    query = query + kv.Key + " = \"" + kv.Value.ReadAs<string>() + "\" " + separator;
                    count++;
                }
            }
            return query + ";";
        }

        public static string UpdateQuery(string table, Dictionary<string, object> whereKV, Dictionary<string, object> setKV)
        {
            var query = "UPDATE " + table + " SET ";

            var count = 1;
            foreach (var kv in setKV)
            {
                var separator = count < setKV.Keys.Count ? ", " : "";
                query = query + kv.Key + " = \"" + kv.Value + "\"" + separator;
                count++;
            }
            query = query + " WHERE ";
            count = 1;
            foreach (var kv in whereKV)
            {
                var separator = count < whereKV.Keys.Count ? "AND " : "";
                query = query + kv.Key + " = \"" + kv.Value + "\" " + separator;
                count++;
            }

            return query;
        }

        public static string UpdateQuery2(string TableName, JsonValue whereKV, JsonValue setKV)
        {
            var query = "UPDATE " + TableName + " SET ";

            var count = 1;
            foreach (var kv in setKV)
            {
                var separator = count < setKV.Count ? ", " : "";
                query = query + kv.Key + " = \"" + kv.Value.ReadAs<string>() +"\"" + separator;
                count++;
            }
            query = query + " WHERE ";
            count = 1;
            foreach (var kv in whereKV)
            {
                var separator = count < whereKV.Count ? "AND " : "";
                query = query + kv.Key + " = \"" + kv.Value.ReadAs<string>() + "\" " + separator;
                count++;
            }

            return query;
        }

        public static string UpsertQuery(string table, Dictionary<string, object> row, bool upsert = true)
        {
            var query = "INSERT INTO " + table;
            var columninfo = "(";
            foreach (var column in row)
            {
                columninfo = columninfo + "`" + column.Key + "`,";
            }

            query = query + columninfo.Substring(0, columninfo.Length - 1) + ") VALUES ";
            var updateQuery = " ON DUPLICATE KEY UPDATE ";
            var values = "(";
            foreach (var kv in row)
            {
                if (columninfo.Contains(kv.Key))
                {
                    var value = "\"\"";
                    if (kv.Value != null)
                    {
                        if (kv.Value.GetType().Name == "JsonDictionary" || kv.Value.GetType().Name == "Object")
                        {
                            var test = kv.Value as JsonDictionary;
                            value = JsonToColumnCreate(test.GetDictionary());
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
                        else if (kv.Value.GetType().Name == "Object[]")
                        {
                            var list = kv.Value as Object[];
                            value = "[]:";
                            foreach (var v in list)
                            {
                                value = value + v + ",";
                            }
                            value = list.Length > 0 ? value.Substring(0, value.Length - 1) : value;
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

            if(upsert) query = query + updateQuery.Substring(0, updateQuery.Length - 1) + ";";

            return query;
        }

        public static string UpsertQuery(string table, JsonValue row, bool upsert = true)
        {
            var query = "INSERT INTO " + table;
            var values = "(";
            var columns = "(";
            var lastData = new Dictionary<string, object>();
            var updateQuery = " ON DUPLICATE KEY UPDATE ";
            foreach (var kv in row)
            {
                var value = "\"\"";
                columns = columns + "`" + kv.Key + "`,";
                if (kv.Value.JsonType == JsonType.String || kv.Value.JsonType == JsonType.Boolean || kv.Value.JsonType == JsonType.Number)
                {
                    value = "\"" + kv.Value.ReadAs<string>() + "\"";
                }
                else if (kv.Value.JsonType == JsonType.Array || kv.Value.JsonType == JsonType.Object)
                {
                    value = CreateJsonColumn(kv.Value, string.Empty);
                }
                values = values + value + ",";

                updateQuery = updateQuery + kv.Key + " = " + value + ",";
            }

            query = query + columns.Substring(0, columns.Length - 1) + ") VALUES ";
            query = query + values.Substring(0, values.Length - 1) + ")";

            if (upsert) query = query + updateQuery.Substring(0, updateQuery.Length - 1) + ";";

            return query;
        }

        public static string DeleteQuery(string table, JsonValue where)
        {
            var query = "DELETE FROM " + table + " WHERE ";

            foreach (var kv in where)
            {
                query = query + kv.Key + "='" + kv.Value.ReadAs<string>() + "' AND ";
            }

            query = query.Substring(0, query.Length - 4);

            return query;
        }

        private static string CreateJsonColumn(JsonValue json, string value)
        {
            value = "COLUMN_CREATE(";
            foreach (var kv in json)
            {
                if (kv.Value.JsonType == JsonType.String || kv.Value.JsonType == JsonType.Boolean || kv.Value.JsonType == JsonType.Number)
                {
                    value = value + "\"" + kv.Key + "\",\"" + kv.Value.ReadAs<string>() + "\",";
                }
                else if (kv.Value.JsonType == JsonType.Array || kv.Value.JsonType == JsonType.Object)
                {
                    value = value + "\"" + kv.Key + "\"," + CreateJsonColumn(kv.Value, value) + ",";
                }
            }
            value = value.Substring(0, value.Length - 1) + ")"; ;
            return value;
        }

        public static string InsertSource(string source, string category, List<JsonDictionary> rawData, string collectedAt, string query)
        {
            var categoryList = new List<string>();
            var fieldsQuery = "INSERT INTO fields_" + source + " (category, rawdata, unixtime) VALUES ";
            var currentQuery = "INSERT INTO current_" + source + " (category, rawdata, unixtime) VALUES ";
            var pastQuery = "INSERT INTO past_" + source + " (category, rawdata, unixtime) VALUES ";
            var collectedDate = "CURTIME(3)";
            var duplicateQuery = string.Empty;
            var fieldCreateQuery = string.Empty;
            var dynamicCategory = string.Empty;

            foreach (var item in rawData)
            {
                if (item == null) continue;

                var pastCreate = "COLUMN_CREATE(";
                var fieldCreate = "COLUMN_CREATE(";
                var duplicateUpdate = "COLUMN_ADD(rawdata,";

                var last = new Dictionary<string, object>();
                var itemDict = item.GetDictionary();
                if (itemDict.Count == 0) continue;
                if (itemDict.ContainsKey(collectedAt)) collectedDate = "FROM_UNIXTIME(" + itemDict[collectedAt].ToString() + ")";
                if (itemDict.ContainsKey(category)) dynamicCategory = itemDict[category].ToString();
                else dynamicCategory = category;

                foreach (var kv in itemDict)
                {
                    var type = "text";
                    double doubleTemp;
                    DateTime datetimeTemp;
                    if (double.TryParse(kv.Value.ToString(), out doubleTemp))
                        type = "number";
                    else if (DateTime.TryParse(kv.Value.ToString(), out datetimeTemp))
                        type = "datetime";

                    duplicateUpdate = duplicateUpdate + "\"" + kv.Key + "\",COLUMN_GET(VALUES(rawdata), \"" + kv.Key + "\" as char),";
                    fieldCreate = fieldCreate + "\"" + kv.Key + "\",\"" + type + "\",";
                    pastCreate = pastCreate + "\"" + kv.Key + "\",\"" + kv.Value + "\",";
                }

                duplicateQuery = duplicateUpdate.Substring(0, duplicateUpdate.Length - 1) + ")";
                fieldCreateQuery = fieldCreate.Substring(0, fieldCreate.Length - 1) + ")";

                pastCreate = pastCreate.Substring(0, pastCreate.Length - 1) + ")";
                pastQuery = pastQuery + "(\"" + dynamicCategory + "\"," + pastCreate + ", " + collectedDate + "),";
                currentQuery = currentQuery + "(\"" + dynamicCategory + "\"," + pastCreate + ", " + collectedDate + "),";
                fieldsQuery = fieldsQuery + "(\"" + dynamicCategory + "\"," + fieldCreate + ", " + collectedDate + "),";
            }

            query = query + pastQuery.Substring(0, pastQuery.Length - 1) + " ON DUPLICATE KEY UPDATE rawdata = " + duplicateQuery + ",category = VALUES(category), unixtime=VALUES(unixtime);";
            query = query + currentQuery.Substring(0, currentQuery.Length - 1) + " ON DUPLICATE KEY UPDATE rawdata = " + duplicateQuery + ",category = VALUES(category), unixtime=VALUES(unixtime);";
            query = query + fieldsQuery.Substring(0, fieldsQuery.Length - 1) + " ON DUPLICATE KEY UPDATE rawdata = " + duplicateQuery + ",category = VALUES(category), unixtime=VALUES(unixtime);";
            
            return query;
        }

        public static string CreateSourceTable(string source)
        {
            var currentTable = "current_" + source;
            var pastTable = "past_" + source;
            var fieldsTable = "fields_" + source;
            var query = MariaQueryDefine.createCurrentTable.Replace("{tableName}", fieldsTable) +
                        MariaQueryDefine.createCurrentTable.Replace("{tableName}", currentTable) +
                        MariaQueryDefine.createPastTable.Replace("{tableName}", pastTable);

            return query;
        }

        public static string JsonToColumnCreate(Dictionary<string,object> jsonObj)
        {
            var kvString = "COLUMN_CREATE( ";

            foreach (var kv in jsonObj)
            {
                kvString = kvString + "\"" + kv.Key + "\",\"" + kv.Value + "\",";
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
