﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using Connector;
using DataIntegrationService;

namespace DataIntegrationConsoleService
{
    class Program
    {
        private static DataIntegrationServiceStarter serviceStarter;

        static void Main(string[] args)
        {
            var appDomain = AppDomain.CurrentDomain;

            appDomain.UnhandledException += appDomain_UnhandledException;
            MariaDBConnector.Instance.ServerIp = ConfigurationManager.AppSettings["DatabaseIP"];
            MariaDBConnector.Instance.ServerPort = ConfigurationManager.AppSettings["DatabasePort"];
            MariaDBConnector.Instance.Uid = ConfigurationManager.AppSettings["DatabaseUid"];
            MariaDBConnector.Instance.Database = ConfigurationManager.AppSettings["Database"];
            MariaDBConnector.Instance.Pwd = ConfigurationManager.AppSettings["DatabasePwd"];
            try
            {
                serviceStarter = new DataIntegrationServiceStarter(CheckUrl(ConfigurationManager.AppSettings["DataIntegrationServiceUrl"]));

                if (serviceStarter.HostOpenInfo())
                {
                    Console.ReadLine();
                }
            }
            catch (Exception ex)
            {
                Log.LogWriter.Error(ex.ToString());
            }
        }

        public static string CheckUrl(string url)
        {
            var val = url;

            if (!url.EndsWith("/"))
            {
                val = val + "/";
            }

            if (!url.StartsWith("http://"))
            {
                val = "http://" + val;
            }

            return val;
        }

        static void appDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            throw new NotImplementedException();
        }
    }
}