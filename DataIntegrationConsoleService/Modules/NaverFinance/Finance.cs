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
using System.Diagnostics;

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
            var KOSPI_KOSDAQ_Config = new JsonObject();
            var AllStockInformationConfig = new JsonObject();
            var CurrentStockInformationConfig = new JsonObject();
            CurrentStockInformationConfig.Add("date", "");
            var FinanceInformationConfig = new JsonObject();
            var EmptyInformationConfig = new JsonObject();
            this.config.Add("KOSPI_KOSDAQ", KOSPI_KOSDAQ_Config);
            this.config.Add("AllStockInformation", AllStockInformationConfig);
            this.config.Add("CurrentStockInformation", CurrentStockInformationConfig);
            this.config.Add("FinanceInformation", FinanceInformationConfig);
            this.config.Add("EmptyInformation", EmptyInformationConfig);
            this.functionDict.Add("AllStockInformation", new Func<string, bool>(AllStockInformation));
            this.functionDict.Add("KOSPI_KOSDAQ", new Func<string, bool>(KOSPI_KOSDAQ));
            this.functionDict.Add("CurrentStockInformation", new Func<string, Func<string, bool>, bool>(CurrentStockInformation));
            this.functionDict.Add("FinanceInformation", new Func<string, bool>(FinanceInformation));
            this.functionDict.Add("EmptyInformation", new Func<string, bool>(EmptyInformation));
        }

        #region ISourceModule 멤버

        public void Initialize()
        {
            try
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
                                var 상장주식수 = cellMatches[7].Groups[1].Value.Replace(",", "") + "000";


                                stock_json.Add(new JsonObject(new KeyValuePair<string, JsonValue>("code", 종목코드),
                                                              new KeyValuePair<string, JsonValue>("name", 종목명),
                                                              new KeyValuePair<string, JsonValue>("type", 종목유형),
                                                              new KeyValuePair<string, JsonValue>("cnt", 상장주식수)));
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
                                var 상장주식수 = cellMatches[7].Groups[1].Value.Replace(",", "") + "000";

                                stock_json.Add(new JsonObject(new KeyValuePair<string, JsonValue>("code", 종목코드),
                                                              new KeyValuePair<string, JsonValue>("name", 종목명),
                                                              new KeyValuePair<string, JsonValue>("type", 종목유형),
                                                              new KeyValuePair<string, JsonValue>("cnt", 상장주식수)));
                            }
                        }
                        EnvironmentHelper.ProgressBar(i, lastNumber);
                    }
                }
                Console.WriteLine("");
                var resultPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory);
                System.IO.File.WriteAllText(Path.Combine(resultPath, "stocklist.json"), stock_json.ToString());
                Console.WriteLine("Complete Stock List!");
            }
            catch
            {
                Console.WriteLine("Fail Stock List!");
            }
        }

        public void SetConfig(string method, JsonValue config)
        {
            foreach (var kv in config)
            {
                if (this.config.ContainsKey(method))
                {
                    if (this.config[method].ContainsKey(kv.Key))
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

        public object ExecuteModule(string method, string collectionName, Func<string, bool> callback)
        {
            var result = this.functionDict[method].DynamicInvoke(collectionName, callback);

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

        private bool AllStockInformation(string collectionName)
        {
            Console.WriteLine("{0} Collector Start : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);
            var progress = 1;
            foreach (var stock in stockJson)
            {
                try
                {
                    var result = new SetDataSourceReq();
                    result.rawdata = new List<JsonDictionary>();
                    result.source = collectionName;
                    result.category = "종목코드";
                    result.collected_at = "날짜";

                    var code = stock.Value["code"].ReadAs<string>();
                    var name = stock.Value["name"].ReadAs<string>();
                    var type = stock.Value["type"].ReadAs<string>();
                    var cnt = stock.Value["cnt"].ReadAs<string>();
                    var url = "http://finance.naver.com/item/sise_day.nhn?code={code}&page={page}";

                    var reqParam = new RequestParameter()
                    {
                        Url = url.Replace("{code}", code).Replace("{page}", "1"),
                        ContentType = "text/html",
                        EncodingOption = "Default",
                        Method = "GET"
                    };

                    var htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                    var lastPattern = "<td class=\"pgRR\"[^>]*>(.*?)</td>";
                    var lastMatches = Regex.Match(htmlCode, lastPattern, RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnoreCase);

                    var pagePattern = "page=(.*?)\"";
                    var page = Regex.Match(lastMatches.Value, pagePattern);
                    var lastNumber = 1;
                    if (!string.IsNullOrWhiteSpace(page.Value))
                    {
                        lastNumber = int.Parse(page.Value.Replace("page=", "").Replace("\"", ""));
                    }
                    var columnInfo = new string[] { "날짜", "종가", "전일비", "시가", "고가", "저가", "거래량", "전일비율" };
                    for (int i = lastNumber; i >= 1; i--)
                    {
                        reqParam.Url = url.Replace("{code}", code).Replace("{page}", i.ToString());
                        htmlCode = HttpsRequest.Instance.GetResponseByHttps(reqParam);

                        MatchCollection tableMatches = Regex.Matches(WithoutComments(htmlCode), TablePattern, ExpressionOptions);
                        string tableHtmlWithoutComments = WithoutComments(tableMatches[0].Value);
                        MatchCollection rowMatches = Regex.Matches(tableHtmlWithoutComments, RowPattern, ExpressionOptions);

                        for (int j = rowMatches.Count - 1; j >= 0; j--)
                        {
                            Match rowMatch = rowMatches[j];
                            if (!rowMatch.Value.Contains("<th"))
                            {
                                MatchCollection cellMatches = Regex.Matches(rowMatch.Value, CellPattern, ExpressionOptions);
                                if (cellMatches.Count == 7)
                                {
                                    var sise = new JsonDictionary();
                                    sise.Add("종목코드", code);
                                    sise.Add("종목명", name);
                                    sise.Add("종목유형", type);
                                    sise.Add("상장주식수", cnt);
                                    var index = 0;
                                    foreach (Match cellMatch in cellMatches)
                                    {
                                        var key = columnInfo[index];
                                        var valuePattern = "<span [^>]*>(.*?)</span>";
                                        var valueMatch = Regex.Match(cellMatch.Groups[1].Value.Replace("\n", "").Replace("\t", ""), valuePattern);
                                        var value = valueMatch.Groups[1].Value;
                                        if (index == 0)
                                        {
                                            if (string.IsNullOrWhiteSpace(value))
                                            {
                                                break;
                                            }
                                            var siseDate = DateTime.Parse(value).AddHours(16);
                                            value = (EnvironmentHelper.GetUnixTime(siseDate) / 1000).ToString();
                                        }
                                        if (index == 2) value = cellMatch.Value.Contains("하락") ? "-" + value : value;
                                        sise.Add(key, value.Replace(",", string.Empty));

                                        index++;
                                    }
                                    if (index == 7)
                                    {
                                        if (result.rawdata.Count > 0)
                                        {
                                            var diff = double.Parse(sise["전일비"].ToString());
                                            var prevPrice = double.Parse(result.rawdata[result.rawdata.Count - 1]["종가"].ToString());
                                            sise.Add(columnInfo[index], prevPrice > 0 ? diff / prevPrice * 100 : 0);
                                        }
                                        result.rawdata.Add(sise);
                                    }
                                }
                            }
                        }
                    }
                    if (result.rawdata.Count > 0)
                    {
                        ThreadPool.QueueUserWorkItem((a) =>
                        {
                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                        });
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
                EnvironmentHelper.ProgressBar(progress, stockJson.Count);
                progress++;
            }
            Console.WriteLine("{0} Collector End : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            return true;
        }

        private bool CurrentStockInformation(string collectionName, Func<string,bool> callback)
        {
            Console.WriteLine("{0} Collector Start : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);
            var progress = 1;
            foreach (var stock in stockJson)
            {
                try
                {
                    var result = new SetDataSourceReq();
                    result.rawdata = new List<JsonDictionary>();
                    result.source = collectionName;
                    result.category = "종목코드";
                    result.collected_at = "날짜";

                    var code = stock.Value["code"].ReadAs<string>();
                    var name = stock.Value["name"].ReadAs<string>();
                    var type = stock.Value["type"].ReadAs<string>();
                    var cnt = stock.Value["cnt"].ReadAs<string>();
                    var state = stock.Value.ContainsKey("state") ? stock.Value["state"].ReadAs<bool>() : false;

                    var nvParser = new nvParser(code);
                    string[] siseInfo;
                    var date = this.config["CurrentStockInformation"]["date"].ReadAs<string>();
                    if (string.IsNullOrWhiteSpace(date))
                    {
                        siseInfo = nvParser.getSise(2);
                    }
                    else
                    {
                        siseInfo = nvParser.getSise(date, 2);
                    }

                    if (siseInfo.Length < 7) continue;
                    var columnInfo = new string[] { "날짜", "종가", "전일비", "시가", "고가", "저가", "거래량", "전일비율" };

                    var sise = new JsonDictionary();
                    var siseDate = DateTime.Parse(siseInfo[0]).AddHours(16);
                    var siseUnix = EnvironmentHelper.GetUnixTime(siseDate) / 1000;
                    sise.Add("종목코드", code);
                    sise.Add("종목명", name);
                    sise.Add("종목유형", type);
                    sise.Add("상장주식수", cnt);
                    sise.Add(columnInfo[0], siseUnix);
                    sise.Add(columnInfo[1], siseInfo[1]);
                    var sign = string.Empty;
                    if (1 + 7 < siseInfo.Length)
                    {
                        if (int.Parse(siseInfo[1]) < int.Parse(siseInfo[1 + 7]))
                        {
                            sign = "-";
                        }
                    }
                    sise.Add(columnInfo[2], sign + siseInfo[2]);
                    sise.Add(columnInfo[3], siseInfo[3]);
                    sise.Add(columnInfo[4], siseInfo[4]);
                    sise.Add(columnInfo[5], siseInfo[5]);
                    sise.Add(columnInfo[6], siseInfo[6]);

                    var diff = double.Parse(sign + siseInfo[2]);
                    var prevPrice = siseInfo.Length > 8 ? int.Parse(siseInfo[1 + 7]) : int.Parse(siseInfo[1]);
                    if (prevPrice > 0)
                    {
                        sise.Add(columnInfo[7], diff / prevPrice * 100);
                    }
                    else
                    {
                        sise.Add(columnInfo[7], 0);
                    }

                    result.rawdata.Add(sise);

                    if (result.rawdata.Count > 0)
                    {
                        Task.Factory.StartNew(() =>
                        {
                            StockAnalysis.Instance.AutoAnalysis("day", code, siseUnix, ref result);
                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                            if (state) callback.DynamicInvoke(code);
                        });
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Current Stock Collector Error");
                }
                EnvironmentHelper.ProgressBar(progress, stockJson.Count);
                progress++;
            }
            Console.WriteLine("{0} Collector End : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            return true;
        }

        private bool FinanceInformation(string collectionName)
        {
            Console.WriteLine("{0} Collector Start : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
            var stockText = File.ReadAllText(file);
            var stockJson = JsonValue.Parse(stockText);

            foreach (var stock in stockJson)
            {
                try
                {
                    var result = new SetDataSourceReq();
                    result.rawdata = new List<JsonDictionary>();
                    result.source = collectionName;
                    result.category = "종목코드";
                    result.collected_at = "날짜";

                    var code = stock.Value["code"].ReadAs<string>();
                    var name = stock.Value["name"].ReadAs<string>();
                    var type = stock.Value["type"].ReadAs<string>();
                    var cnt = stock.Value["cnt"].ReadAs<string>();
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


                    for (int i = 1; i < dateNodes.Count; i++)
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
                        finance.Add("상장주식수", cnt);
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
                    if (result.rawdata.Count > 0)
                    {
                        ThreadPool.QueueUserWorkItem((a) =>
                        {
                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                        });
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Finance Collector Error");
                }
            }
            Console.WriteLine("{0} Collector End : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
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
                var cnt = stock.Value["cnt"].ReadAs<string>();

                finance.Add("종목코드", code);
                finance.Add("종목유형", type);
                finance.Add("종목명", name);
                finance.Add("상장주식수", cnt);

                result.rawdata.Add(finance);

                ThreadPool.QueueUserWorkItem((a) =>
                {
                    var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                    MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                });
            }
            return true;
        }

        private bool KOSPI_KOSDAQ(string collectionName)
        {
            Console.WriteLine("{0} Collector Start : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            var codeArr = new List<string>() { "KOSPI", "KOSDAQ" };
            foreach (var code in codeArr)
            {
                try
                {
                    var googleUrl = "http://www.google.com/finance/getprices?q={code}&i=86400&p=40Y&f=d,c,v,k,o,h,l&df=cpct&auto=0".Replace("{code}", code);

                    var reqParam = new RequestParameter()
                    {
                        Url = googleUrl,
                        ContentType = "application/json",
                        EncodingOption = "UTF8",
                        Method = "GET"
                    };

                    var stockData = this.DecodeHex(HttpsRequest.Instance.GetResponseByHttps(reqParam));
                    var histroyCsv = Regex.Split(stockData, @"\n");
                    var columnInfo = new string[] { "날짜", "종가", "고가", "저가", "시가", "거래량", "전일비", "전일비율" };

                    var result = new SetDataSourceReq();
                    result.rawdata = new List<JsonDictionary>();
                    result.source = collectionName;
                    result.category = "종목코드";
                    result.collected_at = "날짜";

                    var standardTime = string.Empty;
                    for (int i = 7; i < histroyCsv.Length - 1; i++)
                    {
                        var sise = new JsonDictionary();
                        var row = histroyCsv[i].Split(',');

                        sise.Add("종목코드", code);
                        sise.Add("종목명", code);
                        sise.Add("종목유형", "SOSOK");
                        if (row[0].Trim().Contains("a"))
                        {
                            standardTime = row[0].Trim().Replace("a", "");
                            sise.Add(columnInfo[0], standardTime);
                        }
                        else
                        {
                            sise.Add(columnInfo[0], (int.Parse(standardTime) + (86400 * int.Parse(row[0]))).ToString());
                        }
                        sise.Add(columnInfo[1], row[1].Trim());
                        sise.Add(columnInfo[2], row[2].Trim());
                        sise.Add(columnInfo[3], row[3].Trim());
                        sise.Add(columnInfo[4], row[4].Trim());
                        sise.Add(columnInfo[5], row[5].Trim());
                        if (result.rawdata.Count > 0)
                        {
                            var prevPrice = double.Parse(result.rawdata[result.rawdata.Count - 1]["종가"].ToString());
                            if (prevPrice > 0)
                            {
                                var diff = double.Parse(row[1].Trim()) - prevPrice;
                                sise.Add(columnInfo[6], diff);
                                sise.Add(columnInfo[7], (double)diff / prevPrice * 100);
                            }
                        }

                        result.rawdata.Add(sise);
                    }
                    if (result.rawdata.Count > 0)
                    {
                        ThreadPool.QueueUserWorkItem((a) =>
                        {
                            var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
                            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
                        });
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("All Stock Collector Error");
                }
            }

            Console.WriteLine("{0} Collector End : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            return true;
        }

        //private bool AllStockInformation(string collectionName)
        //{
        //    Console.WriteLine("{0} Collector Start : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

        //    var file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json");
        //    var stockText = File.ReadAllText(file);
        //    var stockJson = JsonValue.Parse(stockText);
        //    var progress = 1;
        //    foreach (var stock in stockJson)
        //    {
        //        var code = stock.Value["code"].ReadAs<string>();
        //        var name = stock.Value["name"].ReadAs<string>();
        //        var type = stock.Value["type"].ReadAs<string>();
        //        var cnt = stock.Value["cnt"].ReadAs<string>();

        //        try
        //        {
        //            var googleUrl = "http://www.google.com/finance/getprices?q={code}&i=86400&p=40Y&f=d,c,v,k,o,h,l&df=cpct&auto=0".Replace("{code}", code);

        //            var reqParam = new RequestParameter()
        //            {
        //                Url = googleUrl,
        //                ContentType = "application/json",
        //                EncodingOption = "UTF8",
        //                Method = "GET"
        //            };

        //            var stockData = this.DecodeHex(HttpsRequest.Instance.GetResponseByHttps(reqParam));
        //            var histroyCsv = Regex.Split(stockData, @"\n");
        //            var columnInfo = new string[] { "날짜", "종가", "고가", "저가", "시가", "거래량", "전일비", "전일비율" };

        //            var result = new SetDataSourceReq();
        //            result.rawdata = new List<JsonDictionary>();
        //            result.source = collectionName;
        //            result.category = "종목코드";
        //            result.collected_at = "날짜";
        //            var start_point = false;
        //            var standardTime = string.Empty;
        //            for (int i = 0; i < histroyCsv.Length - 1; i++)
        //            {
        //                var sise = new JsonDictionary();
        //                var row = histroyCsv[i].Split(',');
        //                if (row[0].StartsWith("a")) start_point = true;
        //                if (start_point)
        //                {
        //                    sise.Add("종목코드", code);
        //                    sise.Add("종목명", name);
        //                    sise.Add("종목유형", type);
        //                    sise.Add("상장주식수", cnt);
        //                    if (row[0].Trim().Contains("a"))
        //                    {
        //                        standardTime = row[0].Trim().Replace("a", "");
        //                        sise.Add(columnInfo[0], standardTime);
        //                    }
        //                    else
        //                    {
        //                        sise.Add(columnInfo[0], (int.Parse(standardTime) + (86400 * int.Parse(row[0]))).ToString());
        //                    }
        //                    sise.Add(columnInfo[1], row[1].Trim());
        //                    sise.Add(columnInfo[2], row[2].Trim());
        //                    sise.Add(columnInfo[3], row[3].Trim());
        //                    sise.Add(columnInfo[4], row[4].Trim());
        //                    sise.Add(columnInfo[5], row[5].Trim());
        //                    if (result.rawdata.Count > 0)
        //                    {
        //                        var prevPrice = double.Parse(result.rawdata[result.rawdata.Count - 1]["종가"].ToString());
        //                        if (prevPrice > 0)
        //                        {
        //                            var diff = double.Parse(row[1].Trim()) - prevPrice;
        //                            sise.Add(columnInfo[6], diff);
        //                            sise.Add(columnInfo[7], (double)diff / prevPrice * 100);
        //                        }
        //                    }

        //                    result.rawdata.Add(sise);
        //                }
        //            }
        //            if (result.rawdata.Count > 0)
        //            {
        //                var setSourceQuery = MariaQueryBuilder.SetDataSource(result);
        //                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", setSourceQuery);
        //                Thread.Sleep(100);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine("All Stock Collector Error");
        //        }
        //        EnvironmentHelper.ProgressBar(progress, stockJson.Count);
        //        progress++;
        //    }
        //    Console.WriteLine("{0} Collector End : {1}", collectionName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        //    return true;
        //}

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
    }
}
