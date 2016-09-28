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

        #region IConnector 멤버

        public T GetOneQuery<T>(string query, object parameterValues = null) where T : new()
        {
            T ret = default(T);
            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=15;Max Pool Size=1000;Pooling=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
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
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=15;Max Pool Size=1000;Pooling=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
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
                                                        prop.SetValue(obj, DataConverter.Deserializer<JsonDictionary>(jsonString), null);
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

        public JsonDictionary GetOneQuery(string query, object parameterValues = null)
        {
            JsonDictionary ret = new JsonDictionary();

            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=15;Max Pool Size=1000;Pooling=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
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
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};Min Pool Size=15;Max Pool Size=1000;Pooling=true;", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
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

        public bool SetQuery(string query, object parameterValues = null)
        {
            var ret = true;

            try
            {
                string connectionString = string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};", this.ServerIp, this.ServerPort, this.Database, this.Uid, this.Pwd);
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
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            LogWriter.Error(ex.ToString());
                            LogWriter.Error("[SET QUERY] " + parameterValues.ToString());
                            ret = false;
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
                ret = false;
            }

            return ret;
        }

        #endregion
    }
}