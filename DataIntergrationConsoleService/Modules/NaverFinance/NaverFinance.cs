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
                request.Headers.Add(HttpRequestHeader.Cookie, "NNB=RWW5GGCPUDKFE; npic=53eAXAIznIDf3UUo2oRoj0dLrE7nOVYhmdpFy4/jl4bojhyRPqnOnnT51rEbtKOaCA==; _ga=GA1.2.494051065.1446683975; nx_ssl=2; BMR=s=1469068215609&r=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D%25EB%25B6%2580%25EC%2582%25B0%25ED%2596%2589%26where%3Dm%26sm%3Dmtp_hty&r2=http%3A%2F%2Fm.naver.com%2F; naver_stock_codeList=054940%7C112610%7C000660%7C008700%7C010050%7C051370%7C093230%7C082270%7C099830%7C001740%7C089790%7C002140%7C205100%7C001250%7C000030%7C005720%7C095610%7C123420%7C122870%7C000020%7C; summary_item_type=recent; field_list=12|0000CC12; nid_iplevel=1; page_uid=f52SLdpyLO0ss6ih+G0ssssssRl-199956");
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
                    request.Headers.Add(HttpRequestHeader.Cookie, "NNB=RWW5GGCPUDKFE; npic=53eAXAIznIDf3UUo2oRoj0dLrE7nOVYhmdpFy4/jl4bojhyRPqnOnnT51rEbtKOaCA==; _ga=GA1.2.494051065.1446683975; nx_ssl=2; BMR=s=1469068215609&r=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D%25EB%25B6%2580%25EC%2582%25B0%25ED%2596%2589%26where%3Dm%26sm%3Dmtp_hty&r2=http%3A%2F%2Fm.naver.com%2F; naver_stock_codeList=054940%7C112610%7C000660%7C008700%7C010050%7C051370%7C093230%7C082270%7C099830%7C001740%7C089790%7C002140%7C205100%7C001250%7C000030%7C005720%7C095610%7C123420%7C122870%7C000020%7C; summary_item_type=recent; field_list=12|0000CC12; nid_iplevel=1; page_uid=f52SLdpyLO0ss6ih+G0ssssssRl-199956");
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
