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
        public static List<string> SourceList = new List<string>();

        public static string SetDataSource(SetDataSourceReq param)
        {
            var query = string.Empty;
            if (!SourceList.Contains(param.source)) {
                query = CreateSourceTable(param.source);
                lock (SourceList)
                {
                    SourceList.Add(param.source.ToLower());
                }
            }
            query = InsertSource(param.source, param.category, param.rawdata, param.collected_at, query);
            return query;
        }

        public static string SelectQuery(string table, List<string> selectedItems, JsonValue where = null)
        {
            var queryBuilder = new StringBuilder("SELECT ");

            var count = 1;
            foreach (var item in selectedItems)
            {
                var separator = count < selectedItems.Count ? ", " : "";
                queryBuilder.Append(item);
                queryBuilder.Append(separator);
                count++;
            }
            queryBuilder.Append(" FROM ");
            queryBuilder.Append(table);
            if (where != null)
            {
                queryBuilder.Append(" WHERE ");
                count = 1;
                foreach (var kv in where)
                {
                    var separator = count < where.Count ? "AND " : "";
                    queryBuilder.Append(kv.Key).Append(" = \"").Append(kv.Value.ReadAs<string>()).Append("\" ").Append(separator);
                    count++;
                }
            }
            return queryBuilder.Append(";").ToString();
        }

        public static string UpdateQuery(string TableName, JsonValue whereKV, JsonValue setKV)
        {
            var queryBuilder = new StringBuilder("UPDATE ");
            queryBuilder.Append(TableName).Append(" SET ");

            var count = 1;
            foreach (var kv in setKV)
            {
                var separator = count < setKV.Count ? ", " : "";
                queryBuilder.Append(kv.Key).Append(" = \"").Append(kv.Value.ReadAs<string>()).Append("\"").Append(separator);
                count++;
            }
            queryBuilder.Append(" WHERE ");
            count = 1;
            foreach (var kv in whereKV)
            {
                var separator = count < whereKV.Count ? "AND " : "";
                queryBuilder.Append(kv.Key).Append(" = \"").Append(kv.Value.ReadAs<string>()).Append("\" ").Append(separator);
                count++;
            }

            return queryBuilder.Append(";").ToString();
        }

        public static string UpsertQuery(string table, Dictionary<string, object> row, bool upsert = true)
        {
            var queryBuilder = new StringBuilder("INSERT INTO ").Append(table);
            var columninfo = "(";
            foreach (var column in row)
            {
                columninfo = columninfo + "`" + column.Key + "`,";
            }

            queryBuilder.Append(columninfo.Substring(0, columninfo.Length - 1)).Append(") VALUES ");
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
            queryBuilder.Append(values.Substring(0, values.Length - 1)).Append(")");

            if (upsert) queryBuilder.Append(updateQuery.Substring(0, updateQuery.Length - 1));

            return queryBuilder.Append(";").ToString();
        }

        public static string UpsertQuery(string table, JsonValue row, bool upsert = true)
        {
            var queryBuilder = new StringBuilder("INSERT INTO ").Append(table);
            //var query = "INSERT INTO " + table;
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
                    value = CreateJsonColumn(kv.Value);
                }
                values = values + value + ",";

                updateQuery = updateQuery + kv.Key + " = " + value + ",";
            }

            queryBuilder.Append(columns.Substring(0, columns.Length - 1)).Append(") VALUES ");
            queryBuilder.Append(values.Substring(0, values.Length - 1)).Append(")");

            if (upsert) queryBuilder.Append(updateQuery.Substring(0, updateQuery.Length - 1));

            return queryBuilder.Append(";").ToString();
        }

        public static string DeleteQuery(string table, JsonValue where)
        {
            var queryBuilder = new StringBuilder("DELETE FROM ").Append(table).Append(" WHERE ");

            var count = 1;
            foreach (var kv in where)
            {
                var separator = count < where.Count ? "AND " : "";
                queryBuilder.Append(kv.Key).Append("='").Append(kv.Value.ReadAs<string>()).Append("' ").Append(separator);
                count++;
            }

            return queryBuilder.Append(";").ToString();
        }

        private static string CreateJsonColumn(JsonValue json)
        {
            var queryBuilder = new StringBuilder("COLUMN_CREATE(");

            var count = 1;
            foreach (var kv in json)
            {
                var separator = count < json.Count ? ", " : "";
                if (kv.Value.JsonType == JsonType.String || kv.Value.JsonType == JsonType.Boolean || kv.Value.JsonType == JsonType.Number)
                {
                    queryBuilder.Append("\"").Append(kv.Key).Append("\",\"").Append(kv.Value.ReadAs<string>()).Append("\"").Append(separator);
                }
                else if (kv.Value.JsonType == JsonType.Array || kv.Value.JsonType == JsonType.Object)
                {
                    queryBuilder.Append("\"").Append(kv.Key).Append("\",").Append(CreateJsonColumn(kv.Value)).Append(separator);
                }
                count++;
            }
            queryBuilder.Append(")");
            return queryBuilder.ToString();
        }

        public static string InsertSource(string source, string category, List<JsonDictionary> rawData, string collectedAt, string query)
        {
            var categoryList = new List<string>();
            var resultQueryBuilder = new StringBuilder(query);

            var pastQueryBuilder = new StringBuilder("INSERT INTO past_").Append(source).Append(" (unixtime, category, rawdata ) VALUES ");
            var fieldsQueryBuilder = new StringBuilder("INSERT INTO fields_").Append(source).Append(" (unixtime, category, rawdata ) VALUES ");
            var currentQueryBuilder = new StringBuilder("INSERT INTO current_").Append(source).Append(" (unixtime, category, rawdata ) VALUES ");

            var collectedDate = "CURTIME(3)";

            var prevCategory = string.Empty;
            var duplicateQuery = string.Empty;
            var dynamicCategory = string.Empty;

            var row = 1;
            var currentValid = new Dictionary<string, Dictionary<string,string>>();
            var totalFields = new Dictionary<string,string>();
            foreach (var item in rawData)
            {
                if (item == null) continue;

                var rowSeparator = row < rawData.Count ? "," : "";

                var dataCreateBuilder = new StringBuilder("COLUMN_CREATE(");

                var itemDict = item.GetDictionary();
                if (itemDict.Count == 0) continue;
                if (itemDict.ContainsKey(collectedAt)) collectedDate = new StringBuilder("FROM_UNIXTIME(").Append(itemDict[collectedAt].ToString()).Append(")").ToString();
                if (itemDict.ContainsKey(category)) dynamicCategory = itemDict[category].ToString();
                else dynamicCategory = category;

                var cell = 1;
                foreach (var kv in itemDict)
                {
                    var cellSeparator = cell < itemDict.Count ? "," : "";

                    dataCreateBuilder.Append("\"").Append(kv.Key).Append("\",\"").Append(kv.Value).Append("\"").Append(cellSeparator);

                    if (!totalFields.ContainsKey(kv.Key)) totalFields.Add(kv.Key, kv.Value.ToString());
                    else totalFields[kv.Key] = kv.Value.ToString();

                    cell++;
                }

                dataCreateBuilder.Append(")");
                pastQueryBuilder.Append("(").Append(collectedDate).Append(",\"").Append(dynamicCategory).Append("\",").Append(dataCreateBuilder.ToString())
                                              .Append(")").Append(rowSeparator);
                currentQueryBuilder.Append("(").Append(collectedDate).Append(",\"").Append(dynamicCategory).Append("\",").Append(dataCreateBuilder.ToString())
                                                         .Append(")").Append(rowSeparator);
                row++;
            }
            var dupl_cnt = 1;
            var duplicateUpdateBuilder = new StringBuilder("COLUMN_ADD(rawdata,");
            var fieldCreateBuilder = new StringBuilder("COLUMN_CREATE(");
            foreach (var duplicate in totalFields)
            {
                var type = "text";
                double doubleTemp;
                DateTime datetimeTemp;
                if (double.TryParse(duplicate.Value.ToString(), out doubleTemp))
                    type = "number";
                else if (DateTime.TryParse(duplicate.Value.ToString(), out datetimeTemp))
                    type = "datetime";

                var duplSeparator = dupl_cnt < totalFields.Count ? "," : "";
                fieldCreateBuilder.Append("\"").Append(duplicate.Key).Append("\",\"").Append(type).Append("\"").Append(duplSeparator);
                duplicateUpdateBuilder.Append("\"").Append(duplicate.Key).Append("\",IF(COLUMN_EXISTS(VALUES(rawdata), \"").Append(duplicate.Key).Append("\"),")
                    .Append("COLUMN_GET(VALUES(rawdata), \"").Append(duplicate.Key).Append("\" as char),").Append("COLUMN_GET(rawdata, \"").Append(duplicate.Key).Append("\" as char))")
                    .Append(duplSeparator);
                dupl_cnt++;
            }
            fieldCreateBuilder.Append(")");
            fieldsQueryBuilder.Append("(").Append(collectedDate).Append(",\"").Append("").Append("\",").Append(fieldCreateBuilder.ToString()).Append(")");
            duplicateQuery = duplicateUpdateBuilder.Append(")").ToString();

            resultQueryBuilder.Append(pastQueryBuilder.ToString()).Append(" ON DUPLICATE KEY UPDATE rawdata = ").Append(duplicateQuery)
                              .Append(",category = VALUES(category), unixtime=VALUES(unixtime);");
            resultQueryBuilder.Append(currentQueryBuilder.ToString()).Append(" ON DUPLICATE KEY UPDATE rawdata = ").Append(duplicateQuery)
                              .Append(",category = VALUES(category), unixtime=VALUES(unixtime);");
            resultQueryBuilder.Append(fieldsQueryBuilder.ToString()).Append(" ON DUPLICATE KEY UPDATE rawdata = ").Append(duplicateQuery)
                              .Append(",category = VALUES(category), unixtime=VALUES(unixtime);");
            return resultQueryBuilder.ToString();
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
            var queryBuilder = new StringBuilder("COLUMN_CREATE( ");

            var count = 1;
            foreach (var kv in jsonObj)
            {
                var separator = count < jsonObj.Count ? "," : "";
                queryBuilder.Append("\"").Append(kv.Key).Append("\",\"").Append(kv.Value).Append("\"").Append(separator);
                count++;
            }
            queryBuilder.Append(")");

            return queryBuilder.ToString();
        }

        public static string JsonToColumnAdd(Dictionary<string,object> jsonObj, string columnName)
        {
            var queryBuilder = new StringBuilder("COLUMN_ADD(").Append(columnName).Append(",");

            var count = 1;
            foreach (var kv in jsonObj)
            {
                var separator = count < jsonObj.Count ? "," : "";
                queryBuilder.Append("\"").Append(kv.Key).Append("\",\"").Append(kv.Value).Append("\"").Append(separator);
            }
            queryBuilder.Append(")");

            return queryBuilder.ToString();
        }
    }
}
