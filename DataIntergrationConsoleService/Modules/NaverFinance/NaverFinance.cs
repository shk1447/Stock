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
using Model.Common;
using Model.Request;
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
            var StockInformationConfig = new Dictionary<string,object>();

            this.config.Add("StockInformation", StockInformationConfig);
            this.functionDict.Add("StockInformation", new Func<object>(StockInformation));
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
            return this.config;
        }

        public object ExecuteModule(string method)
        {
            var result = this.functionDict[method].DynamicInvoke();

            return result;
        }

        public dynamic GetData(string config, string query, string type, int interval)
        {
            throw new NotImplementedException();
        }

        #endregion

        private const RegexOptions ExpressionOptions = RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase;

        private const string CommentPattern = "<!--(.*?)-->";
        private const string TablePattern = "<table[^>]*>(.*?)</table>";
        private const string HeaderPattern = "<th[^>]*>(.*?)</th>";
        private const string RowPattern = "<tr[^>]*>(.*?)</tr>";
        private const string CellPattern = "<td[^>]*>(.*?)</td>";

        private SetDataSourceReq StockInformation()
        {
            System.Net.ServicePointManager.Expect100Continue = false;
            System.Net.ServicePointManager.DefaultConnectionLimit = 1000;
            System.Net.WebRequest.DefaultWebProxy = null;

            string htmlCode = "";
            var ds = new DataSet();
            var result = new SetDataSourceReq();
            var columnList = new List<string>() { "종목코드", "종목유형", "종목명", "액면가", "시가총액", "매출액", "영업이익", "당기순이익", "PER", "PBR" };
            result.RawData = new List<JsonDictionary>();
            result.Source = "NaverFinance";
            result.Category = "종목코드";
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

                SetRawData(htmlCode, result, columnList, k == 0 ? "코스피" : "코스닥");

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

                    SetRawData(htmlCode, result, columnList, k == 0 ? "코스피" : "코스닥");
                }
            }

            return result;
        }

        private static void SetRawData(string htmlCode, SetDataSourceReq result, List<string> columnList, string type)
        {
            MatchCollection tableMatches = Regex.Matches(WithoutComments(htmlCode), TablePattern, ExpressionOptions);
            string tableHtmlWithoutComments = WithoutComments(tableMatches[1].Value);
            MatchCollection rowMatches = Regex.Matches(tableHtmlWithoutComments, RowPattern, ExpressionOptions);

            foreach (Match rowMatch in rowMatches)
            {
                if (!rowMatch.Value.Contains("<th"))
                {
                    MatchCollection cellMatches = Regex.Matches(rowMatch.Value, CellPattern, ExpressionOptions);

                    var json = new JsonDictionary();
                    if (cellMatches.Count < columnList.Count) continue;

                    try
                    {
                        var 종목코드 = Regex.Match(cellMatches[1].Groups[1].ToString(), "code=(.*?)\"").Groups[1].ToString();
                        var 종목유형 = type;
                        var 종목명 = Regex.Match(cellMatches[1].Groups[1].ToString(), "class=\"tltle\">(.*?)</a>").Groups[1].ToString();
                        var 액면가 = cellMatches[5].Groups[1].ToString();
                        var 시가총액 = cellMatches[6].Groups[1].ToString();
                        var 매출액 = cellMatches[7].Groups[1].ToString();
                        var 영업이익 = cellMatches[8].Groups[1].ToString();
                        var 당기순이익 = cellMatches[9].Groups[1].ToString();
                        var PER = cellMatches[10].Groups[1].ToString();
                        var PBR = cellMatches[11].Groups[1].ToString();
                        json.Add("종목코드", 종목코드); json.Add("종목유형", 종목유형); json.Add("종목명", 종목명); json.Add("액면가", 액면가);
                        json.Add("시가총액", 시가총액); json.Add("매출액", 매출액); json.Add("영업이익", 영업이익); json.Add("당기순이익", 당기순이익);
                        json.Add("PER", PER); json.Add("PBR", PER);
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                    result.RawData.Add(json);
                }
            }
        }

        private static string WithoutComments(string html)
        {
            return Regex.Replace(html, CommentPattern, string.Empty, ExpressionOptions);
        }
    }
}
