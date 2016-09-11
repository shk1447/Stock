using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ModuleInterface;

namespace NaverFinance
{
    public class NaverFinance : ISourceModule
    {
        private Dictionary<string, Dictionary<string,object>> config;
        private Dictionary<string, Delegate> functionDict;

        public NaverFinance()
        {
            this.config = new Dictionary<string, Dictionary<string, object>>();
            this.functionDict = new Dictionary<string, Delegate>();
            var getSiseConfig = new Dictionary<string,object>();
            
            this.config.Add("GetStockInfo", getSiseConfig);
            this.functionDict.Add("GetStockInfo", new Func<DataTable>(GetStockInfo));
        }

        #region ISourceModule 멤버

        public void SetConfig(string method, Dictionary<string, object> config)
        {
            foreach (var kv in config)
            {
                if(this.config.ContainsKey(kv.Key))
                {
                    if(this.config.ContainsKey(method))
                    {
                        this.config[method][kv.Key] = kv.Value;
                    }
                }
            }
        }

        public Dictionary<string, Dictionary<string, object>> GetConfig()
        {
            try
            {
                var thoho = this.functionDict["GetStockInfo"].DynamicInvoke();
            }
            catch (Exception ex)
            {
            }

            return this.config;
        }

        public dynamic GetData(string config, string query, string type, int interval)
        {
            throw new NotImplementedException();
        }

        #endregion

        private int GetSise()
        {
            try
            {

            }
            catch (Exception ex)
            {

            }

            return 0;
        }

        private DataTable GetStockInfo()
        {
            System.Net.ServicePointManager.Expect100Continue = false;
            System.Net.ServicePointManager.DefaultConnectionLimit = 1000;
            System.Net.WebRequest.DefaultWebProxy = null;

            string htmlCode = "";
            var ds = new DataSet();
            for (int k = 0; k < 2; k++)
            {
                var url = "http://finance.naver.com/sise/sise_market_sum.nhn?sosok={exchange}&page={pageNumber}";

                WebResponse response;
                WebRequest request = HttpWebRequest.Create(url.Replace("{pageNumber}","1").Replace("{exchange}",k.ToString()));
                request.Headers.Add(HttpRequestHeader.Cookie, "NNB=77DCUJJNP6QFO; npic=QcmfGgCjMM+5v91FvE2Uw4tcWuDRYwcUMC10ZJ8TsvSbQ8QEUYAyC0qRXgypP0zhCA==; nx_ssl=2; field_list=12|0201241");
                request.Proxy = null;
                using (response = request.GetResponse())
                {
                    using (StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.Default))
                    {
                        htmlCode = sr.ReadToEnd();
                    }
                }

                var lastPattern = "<td class=\"pgRR\"[^>]*>(.*?)</td>";
                var lastMatches = Regex.Match(htmlCode, lastPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase);

                var pagePattern = "page=(.*?)\"";
                var page = Regex.Match(lastMatches.Value, pagePattern);
                var lastNumber = int.Parse(page.Value.Replace("page=", "").Replace("\"", ""));

                HtmlParser.ParseDataSet(htmlCode, ref ds);

                for (int i = 2; i <= lastNumber; i++)
                {
                    request = HttpWebRequest.Create(url.Replace("{pageNumber}", i.ToString()).Replace("{exchange}", k.ToString()));
                    request.Headers.Add(HttpRequestHeader.Cookie, "NNB=77DCUJJNP6QFO; npic=QcmfGgCjMM+5v91FvE2Uw4tcWuDRYwcUMC10ZJ8TsvSbQ8QEUYAyC0qRXgypP0zhCA==; nx_ssl=2; field_list=12|0201241");
                    request.Proxy = null;
                    using (response = request.GetResponse())
                    {
                        using (StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.Default))
                        {
                            htmlCode = sr.ReadToEnd();
                        }
                    }

                    HtmlParser.ParseDataSet(htmlCode, ref ds);
                }
            }

            return ds.Tables[1];
        }
    }
}
