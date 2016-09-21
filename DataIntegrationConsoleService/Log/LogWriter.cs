using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using log4net;
using log4net.Config;

namespace Log
{
    public class LogWriter
    {
        private static readonly ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        public static void Info(object message)
        {
            log.Info(message);
        }

        public static void Error(object message)
        {
            log.Error(message);
        }

        public static void Debug(object message)
        {
            log.Debug(message);
        }

        public static void Warn(object message)
        {
            log.Warn(message);
        }

        public static void Fatal(object message)
        {
            log.Fatal(message);
        }

        public static void Info(string format, params object[] args)
        {
            log.InfoFormat(format, args);
        }

        public static void Error(string format, params object[] args)
        {
            log.ErrorFormat(format, args);
        }

        public static void Debug(string format, params object[] args)
        {
            log.DebugFormat(format, args);
        }

        public static void Warn(string format, params object[] args)
        {
            log.WarnFormat(format, args);
        }

        public static void Fatal(string format, params object[] args)
        {
            log.FatalFormat(format, args);
        }
    }
}
