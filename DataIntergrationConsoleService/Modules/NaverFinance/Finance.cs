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

namespace Finance
{
    public class Finance : ISourceModule
    {
        private Dictionary<string, Dictionary<string,object>> config;
        private Dictionary<string, Delegate> functionDict;

        public Finance()
        {
            this.config = new Dictionary<string, Dictionary<string, object>>();
            this.functionDict = new Dictionary<string, Delegate>();
            var StockInformationConfig = new Dictionary<string,object>();
            StockInformationConfig.Add("nvParser", null);
            this.config.Add("StockInformation", StockInformationConfig);
            this.functionDict.Add("StockInformation", new Func<bool>(StockInformation));
        }

        private object CurrentStock()
        {
            throw new NotImplementedException();
        }

        #region ISourceModule 멤버

        public void SetConfig(string method, Dictionary<string, object> config)
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
                    result.RawData = new List<JsonDictionary>();
                    result.Source = "Finance";
                    result.Category = "종목코드";
                    result.CollectedAt = "날짜";
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
                        var siseInfo = nvParser.getSise(500);
                        var columnInfo = new string[] {"날짜","종가","전일비","시가","고가","저가","거래량"};
                        Task.Factory.StartNew(() =>
                        {
                            for (int s = siseInfo.Length - 7; s >= 0; s = s - 7)
                            {
                                var sise = new JsonDictionary();
                                var siseDate = DateTime.Parse(siseInfo[s]).AddHours(18);
                                var siseUnix = EnvironmentHelper.GetUnixTime(siseDate) / 1000;
                                sise.Add("종목코드", 종목코드);
                                sise.Add(columnInfo[0], siseUnix);
                                sise.Add(columnInfo[1], siseInfo[s + 1]);
                                sise.Add(columnInfo[2], siseInfo[s + 2]);
                                sise.Add(columnInfo[3], siseInfo[s + 3]);
                                sise.Add(columnInfo[4], siseInfo[s + 4]);
                                sise.Add(columnInfo[5], siseInfo[s + 5]);
                                sise.Add(columnInfo[6], siseInfo[s + 6]);
                                result.RawData.Add(sise);
                            }
                            result.RawData.Add(json);

                            Console.WriteLine("종목명 : {0}, 데이터 갯수 : {1}", 종목명, result.RawData.Count);

                            var message = DataConverter.DynamicToString(result);
                            var selfUrl = "http://localhost:1447/SetDataSource";
                            var param = new RequestParameter()
                            {
                                Url = selfUrl,
                                ContentType = "text",
                                EncodingOption = "UTF8",
                                Method = "POST",
                                PostMessage = message
                            };

                            HttpsRequest.Instance.GetResponseByHttps(param);
                        });
                        
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }
        }

        private string GoogleStock(SetDataSourceReq result, string 종목코드, string stockData)
        {
            var googleUrl = "http://www.google.com/finance/getprices?q={code}&i=86400&p=40Y&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg";
            var reqParam = new RequestParameter()
            {
                Url = googleUrl.Replace("{code}", 종목코드),
                ContentType = "application/json",
                EncodingOption = "UTF8",
                Method = "GET"
            };

            stockData = this.DecodeHex(HttpsRequest.Instance.GetResponseByHttps(reqParam));

            var histroyCsv = Regex.Split(stockData, @"\n");
            var query = "날짜,종가,고가,저가,시가,거래량,CDAYS";
            var standardTime = string.Empty;
            for (int i = 7; i < histroyCsv.Length - 1; i++)
            {
                var keyArr = query.Split(',');
                var dDict = new JsonDictionary();
                var row = histroyCsv[i].Split(',');
                for (int k = 0; k < row.Length - 1; k++)
                {
                    if (k == 0)
                    {
                        if (row[k].Trim().Contains("a"))
                        {
                            standardTime = row[k].Trim().Replace("a", "");
                            dDict.Add(keyArr[k].Trim(), standardTime);
                        }
                        else
                        {
                            dDict.Add(keyArr[k].Trim(), (int.Parse(standardTime) + (86400 * int.Parse(row[k]))).ToString());
                        }
                        continue;
                    }

                    dDict.Add(keyArr[k].Trim(), row[k].Trim());
                }
                dDict.Add("종목코드", 종목코드);
                result.RawData.Add(dDict);
            }
            return stockData;
        }

        private string DecodeHex(string data)
        {
            data = data.Replace(@"\x22", "&quot;");
            data = data.Replace(@"\x23", "#");
            data = data.Replace(@"\x24", "$");
            data = data.Replace(@"\x25", "%");
            data = data.Replace(@"\x26", "&");
            data = data.Replace(@"\x27", "'");
            data = data.Replace(@"\x28", "(");
            data = data.Replace(@"\x29", ")");
            data = data.Replace(@"\x2A", "*");
            data = data.Replace(@"\x2B", "+");
            data = data.Replace(@"\x2C", ",");
            data = data.Replace(@"\x2D", "-");
            data = data.Replace(@"\x2E", ".");
            data = data.Replace(@"\x2F", "/");
            data = data.Replace(@"\x30", "0");
            data = data.Replace(@"\x31", "1");
            data = data.Replace(@"\x32", "2");
            data = data.Replace(@"\x33", "3");
            data = data.Replace(@"\x34", "4");
            data = data.Replace(@"\x35", "5");
            data = data.Replace(@"\x36", "6");
            data = data.Replace(@"\x37", "7");
            data = data.Replace(@"\x38", "8");
            data = data.Replace(@"\x39", "9");
            data = data.Replace(@"\x3A", ":");
            data = data.Replace(@"\x3B", ";");
            data = data.Replace(@"\x3C", "<");
            data = data.Replace(@"\x3D", "=");
            data = data.Replace(@"\x3E", ">");
            data = data.Replace(@"\x3F", "?");
            return data;
        }
        private readonly object lockList = new object();
        private string NaverStock(SetDataSourceReq result, string 종목코드, string html)
        {
            var url = "http://finance.naver.com/item/sise_day.nhn?code={code}&page={pageNumber}";

            var reqParam = new RequestParameter()
                {
                    Url =url.Replace("{code}", 종목코드).Replace("{pageNumber}", "1"),
                    ContentType = "text/html",
                    EncodingOption = "Default",
                    Method = "GET"
                };
            html = HttpsRequest.Instance.GetResponseByHttps(reqParam);

            var lastPattern = "<td class=\"pgRR\"[^>]*>(.*?)</td>";
            var lastMatches = Regex.Match(html, lastPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase);

            var pagePattern = "page=(.*?)\"";
            var page = Regex.Match(lastMatches.Value, pagePattern);
            var lastNumber = int.Parse(page.Value.Replace("page=", "").Replace("\"", ""));
            
            for (int i = lastNumber; i > 0; i--)
            {
                var pageNum = i.ToString();
                reqParam.Url = url.Replace("{code}", 종목코드).Replace("{pageNumber}", pageNum);
                html = HttpsRequest.Instance.GetResponseByHttps(reqParam);
                try
                {
                    MatchCollection a = Regex.Matches(WithoutComments(html), TablePattern, ExpressionOptions);
                    string b = WithoutComments(a[0].Value);
                    MatchCollection c = Regex.Matches(b, RowPattern, ExpressionOptions);
                    for (int q = c.Count - 1; q >= 0; q--)
                    {
                        var row = c[q];
                        if (!row.Value.Contains("<th"))
                        {
                            try
                            {
                                MatchCollection cell = Regex.Matches(row.Value, CellPattern, ExpressionOptions);
                                if (cell.Count < 7) continue;
                                var json2 = new JsonDictionary();
                                var spanPattern = "<span[^>]*>(.*?)</span>";
                                var 날짜 = Regex.Match(cell[0].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value;
                                var unixtime = Convert.ToInt32((DateTime.Parse(날짜).AddHours(18).ToUniversalTime() - unixBase).TotalSeconds);
                                var 종가 = Regex.Match(cell[1].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value.Replace(",", "");
                                var 시가 = Regex.Match(cell[3].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value.Replace(",", "");
                                var 고가 = Regex.Match(cell[4].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value.Replace(",", "");
                                var 저가 = Regex.Match(cell[5].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value.Replace(",", "");
                                var 거래량 = Regex.Match(cell[6].Groups[1].Value, spanPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase).Groups[1].Value.Replace(",", "");
                                json2.Add("종목코드", 종목코드); json2.Add("종가", 종가); json2.Add("시가", 시가); json2.Add("고가", 고가); json2.Add("저가", 저가);
                                json2.Add("거래량", 거래량); json2.Add("날짜", unixtime);

                                result.RawData.Add(json2);
                            }
                            catch (Exception ex)
                            {
                                continue;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

            }
            
            return html;
        }

        private string WithoutComments(string html)
        {
            return Regex.Replace(html, CommentPattern, string.Empty, ExpressionOptions);
        }
    }
}
