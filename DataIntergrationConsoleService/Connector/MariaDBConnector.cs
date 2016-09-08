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

        public DataTable GetQuery(string query, object parameterValues = null)
        {
            DataTable ret = new DataTable();

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

                            MySqlDataAdapter adap = new MySqlDataAdapter(cmd);
                            adap.Fill(ret);
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

            }

            return ret;
        }

        #endregion
    }
}