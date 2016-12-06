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
using NaverFinance;
using HtmlAgilityPack;

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
            var FinanceInformationConfig = new JsonObject();
            var EmptyInformationConfig = new JsonObject();
            var StockInformationConfig = new JsonObject();
            StockInformationConfig.Add("days", 1);
            StockInformationConfig.Add("method", "history");
            this.config.Add("StockInformation", StockInformationConfig);
            this.config.Add("FinanceInformation", FinanceInformationConfig);
            this.config.Add("EmptyInformation", EmptyInformationConfig);
            this.functionDict.Add("StockInformation", new Func<string, bool>(StockInformation));
            this.functionDict.Add("FinanceInformation", new Func<string, bool>(FinanceInformation));
            this.functionDict.Add("EmptyInformation", new Func<string, bool>(EmptyInformation));
        }

        #region ISourceModule 멤버

        public void Initialize()
        {
            string htmlCode = "";
            var stock_json = new JsonArray();
            Console.WriteLine("Initialize Stock List!");
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

                htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                var lastPattern = "<td class=\"pgRR\"[^>]*>(.*?)</td>";
                var lastMatches = Regex.Match(htmlCode, lastPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase);

                var pagePattern = "page=(.*?)\"";
                var page = Regex.Match(lastMatches.Value, pagePattern);
                var lastNumber = int.Parse(page.Value.Replace("page=", "").Replace("\"", ""));

                try
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
                            
                            var 종목코드 = Regex.Match(cellMatches[1].Groups[1].ToString(), "code=(.*?)\"").Groups[1].ToString();
                            var 종목유형 = k == 0 ? "코스피" : "코스닥";
                            var 종목명 = Regex.Match(cellMatches[1].Groups[1].ToString(), "class=\"tltle\">(.*?)</a>").Groups[1].ToString();


                            stock_json.Add(new JsonObject(new KeyValuePair<string, JsonValue>("code", 종목코드),
                                                          new KeyValuePair<string, JsonValue>("name", 종목명),
                                                          new KeyValuePair<string, JsonValue>("type", 종목유형)));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

                for (int i = 2; i <= lastNumber; i++)
                {
                    reqParam.Url = url.Replace("{pageNumber}", i.ToString()).Replace("{exchange}", k.ToString());
                    htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                    MatchCollection tableMatches = Regex.Matches(WithoutComments(htmlCode), TablePattern, ExpressionOptions);
                    string tableHtmlWithoutComments = WithoutComments(tableMatches[1].Value);
                    MatchCollection rowMatches = Regex.Matches(tableHtmlWithoutComments, RowPattern, ExpressionOptions);
                    foreach (Match rowMatch in rowMatches)
                    {
                        if (!rowMatch.Value.Contains("<th"))
                        {
                            MatchCollection cellMatches = Regex.Matches(rowMatch.Value, CellPattern, ExpressionOptions);

                            if (cellMatches.Count < 10) continue;

                            var 종목코드 = Regex.Match(cellMatches[1].Groups[1].ToString(), "code=(.*?)\"").Groups[1].ToString();
                            var 종목유형 = k == 0 ? "코스피" : "코스닥";
                            var 종목명 = Regex.Match(cellMatches[1].Groups[1].ToString(), "class=\"tltle\">(.*?)</a>").Groups[1].ToString();

                            stock_json.Add(new JsonObject(new KeyValuePair<string, JsonValue>("code", 종목코드),
                                                          new KeyValuePair<string, JsonValue>("name", 종목명),
                                                          new KeyValuePair<string, JsonValue>("type", 종목유형)));
                        }
                    }
                    Console.Write(".");
                }
            }
            Console.WriteLine("");
            var resultPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory);
            System.IO.File.WriteAllText(Path.Combine(resultPath, "stocklist.json"), stock_json.ToString());
            Console.WriteLine("Complete Stock List!");
        }

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

        public object ExecuteModule(string method, string collectionName)
        {
            var result = this.functionDict[method].DynamicInvoke(collectionName);

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
        private const string TheadPattern = "<thead[^>]*>(.*?)</thead>";
        private const string TbodyPattern = "<tbody[^>]*>(.*?)</tbody>";
        private const string HeaderPattern = "<th[^>]*>(.*?)</th>";
        private const string RowPattern = "<tr[^>]*>(.*?)</tr>";
        private const string CellPattern = "<td[^>]*>(.*?)</td>";
        private static readonly DateTime unixBase = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        private string WithoutComments(string html)
        {
            return Regex.Replace(html, CommentPattern, string.Empty, ExpressionOptions);
        }

        private bool StockInformation(string collectionName)
        {
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);

            foreach (var stock in stockJson)
            {
                var result = new SetDataSourceReq();
                result.rawdata = new List<JsonDictionary>();
                result.source = collectionName;
                result.category = "종목코드";
                result.collected_at = this.config["StockInformation"]["method"].ReadAs<string>() == "history" ? "날짜" : "";

                var code = stock.Value["code"].ReadAs<string>();
                var name = stock.Value["name"].ReadAs<string>();
                var type = stock.Value["type"].ReadAs<string>();

                var nvParser = new nvParser(code);
                var siseInfo = nvParser.getSise(int.Parse(this.config["StockInformation"]["days"].ReadAs<string>()));
                var columnInfo = new string[] { "날짜", "종가", "전일비", "시가", "고가", "저가", "거래량" };

                for (int s = siseInfo.Length - 7; s >= 0; s = s - 7)
                {
                    var sise = new JsonDictionary();
                    var siseDate = DateTime.Parse(siseInfo[s]).AddHours(16);
                    var siseUnix = EnvironmentHelper.GetUnixTime(siseDate) / 1000;
                    sise.Add("종목코드", code);
                    sise.Add("종목명", name);
                    sise.Add("종목유형", type);
                    sise.Add(columnInfo[0], siseUnix);
                    sise.Add(columnInfo[1], siseInfo[s + 1]);
                    sise.Add(columnInfo[2], siseInfo[s + 2]);
                    sise.Add(columnInfo[3], siseInfo[s + 3]);
                    sise.Add(columnInfo[4], siseInfo[s + 4]);
                    sise.Add(columnInfo[5], siseInfo[s + 5]);
                    sise.Add(columnInfo[6], siseInfo[s + 6]);
                    result.rawdata.Add(sise);
                }

                Task.Factory.StartNew(() =>
                        {
                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                        });
            }

            return true;
        }

        private bool FinanceInformation(string collectionName)
        {
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);
            
            foreach (var stock in stockJson)
            {
                var result = new SetDataSourceReq();
                result.rawdata = new List<JsonDictionary>();
                result.source = collectionName;
                result.category = "종목코드";
                result.collected_at = "날짜";
                
                var code = stock.Value["code"].ReadAs<string>();
                var name = stock.Value["name"].ReadAs<string>();
                var type = stock.Value["type"].ReadAs<string>();
                var url = "http://companyinfo.stock.naver.com/v1/company/ajax/cF1001.aspx?cmp_cd={code}&fin_typ=0&freq_typ=Y";

                var reqParam = new RequestParameter()
                {
                    Url = url.Replace("{code}", code),
                    ContentType = "text/html",
                    EncodingOption = "UTF8",
                    Method = "GET"
                };

                var htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);
                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(htmlCode);
                var titleNodes = doc.DocumentNode.SelectNodes("//th[contains(@class,'bg txt title')]");
                var dateNodes = doc.DocumentNode.SelectNodes("//th[contains(@class,' bg')]");
                var dataNodes = doc.DocumentNode.SelectNodes("//td[contains(@class,'num')]");
                
                for(int i = 1; i < dateNodes.Count; i++)
                {
                    var finance = new JsonDictionary();

                    var dateNode = dateNodes[i];
                    var dateText = dateNode.InnerText.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("&nbsp;", "");
                    if (string.IsNullOrWhiteSpace(dateText)) continue;
                    var dateValue = dateText.Substring(0, 7);
                    var date = DateTime.Parse(dateValue);
                    var unixtime = EnvironmentHelper.GetUnixTime(date) / 1000;

                    finance.Add("종목코드", code);
                    finance.Add("종목유형", type);
                    finance.Add("종목명", name);
                    finance.Add("날짜", unixtime);

                    for (int j = 0; j < titleNodes.Count; j++)
                    {
                        var titleNode = titleNodes[j];
                        var dataNode = dataNodes[j * (dateNodes.Count - 1) + (i - 1)];

                        var key = titleNode.InnerText.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("&nbsp;", "");
                        var value = dataNode.InnerText.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("&nbsp;", "").Replace(",", "");

                        if (string.IsNullOrWhiteSpace(value)) continue;
                        finance.Add(key, value);
                    }

                    if (finance.GetDictionary().Keys.Count < 5) continue;
                    result.rawdata.Add(finance);
                }

                Task.Factory.StartNew(() =>
                {
                    var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                    MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                });
            }

            return true;
        }

        private bool EmptyInformation(string collectionName)
        {
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);

            foreach (var stock in stockJson)
            {
                var result = new SetDataSourceReq();
                result.rawdata = new List<JsonDictionary>();
                result.source = collectionName;
                result.category = "종목코드";
                result.collected_at = "날짜";

                var finance = new JsonDictionary();
                var code = stock.Value["code"].ReadAs<string>();
                var name = stock.Value["name"].ReadAs<string>();
                var type = stock.Value["type"].ReadAs<string>();

                finance.Add("종목코드", code);
                finance.Add("종목유형", type);
                finance.Add("종목명", name);

                result.rawdata.Add(finance);

                Task.Factory.StartNew(() =>
                {
                    var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                    MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                });
            }
            return true;
        }
    }
}
