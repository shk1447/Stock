using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class EnvironmentHelper
    {
        private static EnvironmentHelper instance;

        public static EnvironmentHelper Instance
        {
            get
            {
                if (instance != null)
                {
                    return instance;
                }

                instance = new EnvironmentHelper();

                return instance;
            }
        }

        public string OS_VERSION;
        public string PLATFORM;
        public string IPADDRESS;
        public string HOST;

        private static readonly DateTime unixBase = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        public static Int64 GetUnixNow()
        {
            return Convert.ToInt64((DateTime.UtcNow - unixBase).TotalSeconds * 1000);
        }

        public static Int64 GetUnixTime(DateTime datetime)
        {
            return Convert.ToInt64((datetime.ToUniversalTime() - unixBase).TotalSeconds * 1000);
        }

        public EnvironmentHelper()
        {
            this.OS_VERSION = Environment.OSVersion.VersionString;
            this.PLATFORM = Environment.OSVersion.Platform.ToString();
            this.HOST = Dns.GetHostName();
            foreach (IPAddress ip in Dns.GetHostEntry(this.HOST).AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    this.IPADDRESS = this.IPADDRESS + ip.ToString() + ",";
                }
            }
            this.IPADDRESS = this.IPADDRESS.Substring(0, this.IPADDRESS.Length - 1);
        }

        public static DateTime GetDateTime(int unixTime)
        {
            return unixBase.AddSeconds(unixTime);
        }

        public static string GetDateTimeString(int unixTime)
        {
            return unixBase.AddSeconds(unixTime).ToString("yyyy-MM-dd HH:mm");
        }
    }
}
