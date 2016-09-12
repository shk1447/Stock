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
                                            value = Encoding.UTF8.GetString(reader.GetValue(i) as byte[]);
                                        else
                                            value = reader.GetValue(i);

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