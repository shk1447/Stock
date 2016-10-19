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
using System.Threading;
using Common;
using Helper;
using Connector;
using System.Json;

namespace Finance
{
    public class Finance : ISourceModule
    {
        private Dictionary<string, JsonValue> config;
        private Dictionary<string, Delegate> functionDict;

        public Finance()
        {
            this.config = new Dictionary<string, JsonValue>();
            this.functionDict = new Dictionary<string, Delegate>();
            var StockInformationConfig = new JsonObject();
            StockInformationConfig.Add("days", 1);
            StockInformationConfig.Add("method", "history");
            this.config.Add("StockInformation", StockInformationConfig);
            this.functionDict.Add("StockInformation", new Func<bool>(StockInformation));
        }

        private object CurrentStock()
        {
            throw new NotImplementedException();
        }

        #region ISourceModule 멤버

        public void SetConfig(string method, JsonValue config)
        {
            foreach (var kv in config)
            {
                if (this.config.ContainsKey(method))
                {
                    if(this.config[method].ContainsKey(kv.Key))
                    {
                        this.config[method][kv.Key] = kv.Value;
                    }
                }
            }
        }

        public Dictionary<string, JsonValue> GetConfig()
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
        private static readonly DateTime unixBase = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        private bool StockInformation()
        {
            string htmlCode = "";

            for (int k = 0; k < 2; k++)
            {
                var url = "http://finance.naver.com/sise/sise_market_sum.nhn?sosok={exchange}&page={pageNumber}";

                var reqParam = new RequestParameter()
                {
                    Url = url.Replace("{pageNumber}", "1").Replace("{exchange}", k.ToString()),
                    ContentType = "text/html",
                    EncodingOption = "Default",
                    Method = "GET"
                };
                reqParam.header.Add(HttpRequestHeader.Cookie, "NNB=RWW5GGCPUDKFE; npic=53eAXAIznIDf3UUo2oRoj0dLrE7nOVYhmdpFy4/jl4bojhyRPqnOnnT51rEbtKOaCA==; _ga=GA1.2.494051065.1446683975; nx_ssl=2; BMR=s=1469068215609&r=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fquery%3D%25EB%25B6%2580%25EC%2582%25B0%25ED%2596%2589%26where%3Dm%26sm%3Dmtp_hty&r2=http%3A%2F%2Fm.naver.com%2F; naver_stock_codeList=054940%7C112610%7C000660%7C008700%7C010050%7C051370%7C093230%7C082270%7C099830%7C001740%7C089790%7C002140%7C205100%7C001250%7C000030%7C005720%7C095610%7C123420%7C122870%7C000020%7C; summary_item_type=recent; field_list=12|0000CC12; nid_iplevel=1; page_uid=f52SLdpyLO0ss6ih+G0ssssssRl-199956");

                htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                var lastPattern = "<td class=\"pgRR\"[^>]*>(.*?)</td>";
                var lastMatches = Regex.Match(htmlCode, lastPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase);

                var pagePattern = "page=(.*?)\"";
                var page = Regex.Match(lastMatches.Value, pagePattern);
                var lastNumber = int.Parse(page.Value.Replace("page=", "").Replace("\"", ""));

                try
                {
                    SetRawData(htmlCode, k == 0 ? "코스피" : "코스닥");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

                for (int i = 2; i <= lastNumber; i++)
                {
                    reqParam.Url = url.Replace("{pageNumber}", i.ToString()).Replace("{exchange}", k.ToString());
                    htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                    SetRawData(htmlCode, k == 0 ? "코스피" : "코스닥");
                }
            }

            return true;
        }

        private void SetRawData(string htmlCode, string type)
        {
            MatchCollection tableMatches = Regex.Matches(WithoutComments(htmlCode), TablePattern, ExpressionOptions);
            string tableHtmlWithoutComments = WithoutComments(tableMatches[1].Value);
            MatchCollection rowMatches = Regex.Matches(tableHtmlWithoutComments, RowPattern, ExpressionOptions);

            foreach (Match rowMatch in rowMatches)
            {
                if (!rowMatch.Value.Contains("<th"))
                {
                    MatchCollection cellMatches = Regex.Matches(rowMatch.Value, CellPattern, ExpressionOptions);

                    if (cellMatches.Count < 10) continue;

                    var result = new SetDataSourceReq();
                    result.rawdata = new List<JsonDictionary>();
                    result.source = "Finance";
                    result.category = "종목코드";
                    result.collected_at = this.config["StockInformation"]["method"].ReadAs<string>() == "history" ? "날짜" : "";
                    var json = new JsonDictionary();

                    try
                    {
                        var 종목코드 = Regex.Match(cellMatches[1].Groups[1].ToString(), "code=(.*?)\"").Groups[1].ToString();
                        var 종목유형 = type;
                        var 종목명 = Regex.Match(cellMatches[1].Groups[1].ToString(), "class=\"tltle\">(.*?)</a>").Groups[1].ToString();
                        var 액면가 = cellMatches[5].Groups[1].ToString().Replace(",", "");
                        var 시가총액 = cellMatches[6].Groups[1].ToString().Replace(",", "");
                        var 매출액 = cellMatches[7].Groups[1].ToString().Replace(",", "");
                        var 영업이익 = cellMatches[8].Groups[1].ToString().Replace(",", "");
                        var 당기순이익 = cellMatches[9].Groups[1].ToString().Replace(",", "");
                        var PER = cellMatches[10].Groups[1].ToString().Replace(",", "");
                        var PBR = cellMatches[11].Groups[1].ToString().Replace(",", "");
                        json.Add("종목코드", 종목코드); json.Add("종목유형", 종목유형); json.Add("종목명", 종목명); json.Add("액면가", 액면가);
                        json.Add("시가총액", 시가총액); json.Add("매출액", 매출액); json.Add("영업이익", 영업이익); json.Add("당기순이익", 당기순이익);
                        json.Add("PER", PER); json.Add("PBR", PBR);
                        
                        var stockData = string.Empty;
                        var nvParser = new nvParser(종목코드);
                        var siseInfo = nvParser.getSise(int.Parse(this.config["StockInformation"]["days"].ReadAs<string>()));
                        var columnInfo = new string[] {"날짜","종가","전일비","시가","고가","저가","거래량"};
                        Task.Factory.StartNew(() =>
                        {
                            for (int s = siseInfo.Length - 7; s >= 0; s = s - 7)
                            {
                                var sise = new JsonDictionary();
                                var siseDate = DateTime.Parse(siseInfo[s]).AddHours(16);
                                var siseUnix = EnvironmentHelper.GetUnixTime(siseDate) / 1000;
                                sise.Add("종목코드", 종목코드);
                                sise.Add(columnInfo[0], siseUnix);
                                sise.Add(columnInfo[1], siseInfo[s + 1]);
                                sise.Add(columnInfo[2], siseInfo[s + 2]);
                                sise.Add(columnInfo[3], siseInfo[s + 3]);
                                sise.Add(columnInfo[4], siseInfo[s + 4]);
                                sise.Add(columnInfo[5], siseInfo[s + 5]);
                                sise.Add(columnInfo[6], siseInfo[s + 6]);
                                result.rawdata.Add(sise);
                            }
                            result.rawdata.Add(json);

                            Console.WriteLine("종목명 : {0}, 데이터 갯수 : {1}", 종목명, result.rawdata.Count);

                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                        });
                        
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }
        }

        private string WithoutComments(string html)
        {
            return Regex.Replace(html, CommentPattern, string.Empty, ExpressionOptions);
        }
    }
}
