﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using Connector;
using DataIntegrationService;
using Log;
using SourceModuleManager;

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

            Console.WriteLine("Module Initialize Start!");
            ModuleManager.Instance.Initialize();
            Console.WriteLine("Module Initialize Complete!");

            var repository = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory + ConfigurationManager.AppSettings["FileRepository"]);
            if (!Directory.Exists(repository))
            {
                Directory.CreateDirectory(repository);
            }

            try
            {
                serviceStarter = new DataIntegrationServiceStarter(CheckUrl(ConfigurationManager.AppSettings["ServiceUrl"]));

                if (serviceStarter.HostOpenInfo())
                {
                    Console.ReadLine();
                }
            }
            catch (Exception ex)
            {
                LogWriter.Error(ex.ToString());
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
            LogWriter.Error(e.ExceptionObject.ToString());
        }
    }
}
