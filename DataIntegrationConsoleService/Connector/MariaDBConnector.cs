using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using Common;
using MySql.Data.MySqlClient;
using Log;
using System.Diagnostics;
using System.Collections;
using Model.Common;
using System.Reflection;
using Helper;
using System.Json;
using Model.Request;
using System.IO;

namespace Connector
{
    public class MariaDBConnector : IConnector
    {
        public string ServerIp { get; set; }
        public string ServerPort { get; set; }
        public string Database { get; set; }
        public string Uid { get; set; }
        public string Pwd { get; set; }

        private MariaDBConnector()
        {
        }

        public static MariaDBConnector Instance
        {
            get
            {
                return Nested<MariaDBConnector>.Instance;
            }
        }

        public void Initialize()
        {
            this.SetQuery(MariaQueryDefine.CreateFunction);
            this.SetQuery(MariaQueryDefine.CreateProcedure);
            this.SetQuery("DynamicQueryExecuter", MariaQueryDefine.CreateTableQuery);
            this.SetQuery("DynamicQueryExecuter", MariaQueryBuilder.CreateSourceTable("admin"));
            var sourceList = this.GetQuery("DynamicQueryExecuter", MariaQueryDefine.GetSourceInformation);
            foreach (var source in sourceList)
            {
                MariaQueryBuilder.SourceList.Add(source["TABLE_NAME"].ToString().Replace("current_",""));
            }
        }

        #region IConnector 멤버

        public T GetOneQuery<T>(string query, object parameterValues = null) where T : new()
        {
            T ret = default(T);
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                var type = typeof(T);
                                var props = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                                reader.Read();
                                var obj = new T();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    string fieldName = reader.GetName(i);
                                    var prop = props.FirstOrDefault(x => x.Name.ToLower() == fieldName.ToLower());
                                    if (prop != null)
                                    {
                                        if (reader[i] != DBNull.Value)
                                        {
                                            if (reader[i].GetType() == typeof(byte[]))
                                            {
                                                var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                                if (!string.IsNullOrWhiteSpace(jsonString))
                                                    prop.SetValue(obj, DataConverter.Deserializer<JsonDictionary>(jsonString), null);
                                            }
                                            else if (reader[i].ToString().Contains("[]:"))
                                            {
                                                prop.SetValue(obj, reader[i].ToString().Replace("[]:", "").Split(',').ToList(), null);
                                            }
                                            else
                                            {
                                                prop.SetValue(obj, reader[i], null);
                                            }
                                        }
                                    }
                                }
                                ret = obj;
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
            }

            return ret;
        }

        public List<T> GetQuery<T>(string query, object parameterValues = null) where T : new()
        {
            List<T> ret = new List<T>();
            
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                var type = typeof(T);
                                var props = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                                var count = 0;
                                while (reader.Read())
                                {
                                    var obj = new T();
                                    for (int i = 0; i < reader.FieldCount; i++)
                                    {
                                        string fieldName = reader.GetName(i);
                                        var prop = props.FirstOrDefault(x => x.Name.ToLower() == fieldName.ToLower());
                                        if (prop != null)
                                        {
                                            if (reader[i] != DBNull.Value)
                                            {
                                                if (reader[i].GetType() == typeof(byte[]))
                                                {
                                                    var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                                    if(!string.IsNullOrWhiteSpace(jsonString))
                                                        prop.SetValue(obj, JsonValue.Parse(jsonString), null);
                                                }
                                                else if(reader[i].ToString().Contains("[]:"))
                                                {
                                                    prop.SetValue(obj, reader[i].ToString().Replace("[]:", "").Split(',').ToList(), null);
                                                }
                                                else
                                                {
                                                    prop.SetValue(obj, reader[i], null);
                                                }
                                            }
                                        }
                                    }
                                    ret.Add(obj);
                                    count++;
                                }
                                ret = count == 0 ? null : ret;
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                            ret = null;
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                ret = null;
            }

            return ret;
        }

        public JsonDictionary GetOneQuery(string query, object parameterValues = null)
        {
            JsonDictionary ret = new JsonDictionary();

            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                reader.Read();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    object value = null;
                                    if (reader.GetValue(i).GetType() == typeof(byte[]))
                                    {
                                        var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                        if (!string.IsNullOrWhiteSpace(jsonString))
                                            value = DataConverter.Deserializer<JsonDictionary>(jsonString);
                                    }
                                    else
                                    {
                                        value = reader.GetValue(i);
                                        if (value.GetType().Name == "String" && value.ToString().Contains("[]:"))
                                            value = value.ToString().Replace("[]:", "").Split(',').ToList();
                                    }

                                    ret.Add(reader.GetName(i), value);
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                ret = null;
            }

            return ret;
        }

        public List<JsonDictionary> GetQuery(string query, object parameterValues = null)
        {
            List<JsonDictionary> ret = new List<JsonDictionary>();

            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            
                            using (var reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    var dict = new JsonDictionary();
                                    for (int i = 0; i < reader.FieldCount; i++)
                                    {
                                        object value = null;
                                        if (reader.GetValue(i).GetType() == typeof(byte[]))
                                        {
                                            var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                            if (!string.IsNullOrWhiteSpace(jsonString))
                                                value = DataConverter.Deserializer<JsonDictionary>(jsonString);
                                        }
                                        else
                                        {
                                            value = reader.GetValue(i);
                                            if (value.GetType().Name == "String" && value.ToString().Contains("[]:"))
                                                value = value.ToString().Replace("[]:", "").Split(',').ToList();
                                        }

                                        dict.Add(reader.GetName(i), value);
                                    }

                                    ret.Add(dict);
                                }
                            }
                            
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                ret = null;
            }

            return ret;
        }

        public JsonArray GetJsonArray(string query, object parameterValues = null)
        {
            var ret = new JsonArray();
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    JsonObject obj = new JsonObject();
                                    for (int i = 0; i < reader.FieldCount; i++)
                                    {
                                        //if (reader.GetValue(i).GetType().Name == "DBNull") continue;
                                        
                                        if (reader.GetValue(i).GetType() == typeof(byte[]))
                                        {
                                            var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                            if (!string.IsNullOrWhiteSpace(jsonString))
                                                obj.Add(reader.GetName(i), JsonValue.Parse(jsonString));
                                        }
                                        else if (reader.GetValue(i).GetType().Name == "DBNull")
                                        {
                                            obj.Add(reader.GetName(i), null);
                                        }
                                        else
                                        {
                                            var type = reader.GetDataTypeName(i).ToLower();
                                            var value = string.Empty;
                                            if (type.Contains("char"))
                                            {
                                                obj.Add(reader.GetName(i), reader.GetString(i));
                                            }
                                            else if (type.Contains("int"))
                                            {
                                                obj.Add(reader.GetName(i), reader.GetInt64(i));
                                            }
                                            else if (type.Contains("double") || type.Contains("float") || type.Contains("decimal"))
                                            {
                                                obj.Add(reader.GetName(i), reader.GetDouble(i));
                                            }
                                            else if (type.Contains("timestamp"))
                                            {
                                                obj.Add(reader.GetName(i), reader.GetDateTime(i));
                                            }
                                        }
                                    }
                                    ret.Add(obj);
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                            ret = null;
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                ret = null;
            }

            return ret;
        }

        public JsonObject GetJsonArrayWithSchema(string query, object parameterValues = null)
        {
            var ret = new JsonObject();
            var data = new JsonArray();
            var fields = new JsonArray();
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                bool isExists = false;
                                while (reader.Read())
                                {
                                    var count = 0;
                                    JsonObject obj = new JsonObject();
                                    for (int i = 0; i < reader.FieldCount; i++)
                                    {
                                        var fieldType = "Text";
                                        if (reader.GetValue(i).GetType() == typeof(byte[]))
                                        {
                                            fieldType = "AddFields";
                                            var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                            if (!string.IsNullOrWhiteSpace(jsonString))
                                                obj.Add(reader.GetName(i), JsonValue.Parse(jsonString));
                                        }
                                        else if (reader.GetValue(i).GetType().Name == "DBNull")
                                        {
                                            fieldType = "Text";
                                            obj.Add(reader.GetName(i), null);
                                        }
                                        else
                                        {
                                            var type = reader.GetDataTypeName(i).ToLower();
                                            var value = string.Empty;
                                            if (type.Contains("char"))
                                            {
                                                obj.Add(reader.GetName(i), reader.GetString(i));
                                            }
                                            else if (type.Contains("int"))
                                            {
                                                fieldType = "Number";
                                                obj.Add(reader.GetName(i), reader.GetInt64(i));
                                            }
                                            else if (type.Contains("double") || type.Contains("float") || type.Contains("decimal"))
                                            {
                                                fieldType = "Number";
                                                obj.Add(reader.GetName(i), reader.GetDouble(i));
                                            }
                                            else
                                            {
                                                obj.Add(reader.GetName(i), reader.GetString(i));
                                            }
                                        }

                                        if (!isExists)
                                        {
                                            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", reader.GetName(i)),
                                                            new KeyValuePair<string, JsonValue>("value", reader.GetName(i)),
                                                            new KeyValuePair<string, JsonValue>("type", fieldType),
                                                            new KeyValuePair<string, JsonValue>("group", count / 2),
                                                            new KeyValuePair<string, JsonValue>("required", false)));
                                            count++;
                                        }
                                    }
                                    data.Add(obj);
                                    isExists = true;
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                            data = null;
                            fields = null;
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                data = null;
                fields = null;
            }
            ret.Add(new KeyValuePair<string, JsonValue>("data", data));
            ret.Add(new KeyValuePair<string, JsonValue>("fields", fields));

            return ret;
        }

        public JsonObject GetJsonObject(string query, object parameterValues = null)
        {
            var ret = new JsonObject();
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            using (var reader = cmd.ExecuteReader())
                            {
                                reader.Read();
                                
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    if (reader.GetValue(i).GetType() == typeof(byte[]))
                                    {
                                        var jsonString = Encoding.UTF8.GetString(reader[i] as byte[]);
                                        if (!string.IsNullOrWhiteSpace(jsonString))
                                            ret.Add(reader.GetName(i), JsonValue.Parse(jsonString));
                                    }
                                    else if(reader.GetValue(i).GetType().Name == "DBNull")
                                    {
                                        ret.Add(reader.GetName(i), null);
                                    }
                                    else
                                    {
                                        ret.Add(reader.GetName(i), reader.GetString(i));
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[GET QUERY] " + query);
                            ret = null;
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
                ret = null;
            }

            return ret;
        }

        public JsonObject SetQuery(string query, object parameterValues = null)
        {
            var ret = new JsonObject();

            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=10;Max Pool Size=100;Pooling=true;Allow User Variables=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;
                            cmd.CommandText = query;

                            if (parameterValues != null)
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@queryText", parameterValues.ToString());
                            }
                            cmd.ExecuteNonQuery();
                            transaction.Commit();
                            ret.Add("code", "200");
                            ret.Add("message", "success");
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            //if(parameterValues != null) LogWriter.Error("[SET QUERY] " + parameterValues.ToString());
                            ret.Add("code", "400");
                            ret.Add("message", ex.Message);
                        }
                        finally
                        {
                            transaction.Dispose();
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ret.Add("code", "400");
                ret.Add("message", ex.Message);
            }

            return ret;
        }

        #endregion
    }
}