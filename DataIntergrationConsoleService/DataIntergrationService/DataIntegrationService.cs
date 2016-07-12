using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Common;
using Connector;
using ExternalModuleManger;
using Log;
using log4net.Config;
using Newtonsoft.Json.Linq;
using RequestModel;
using Utils;

namespace DataIntegrationService
{
    [ServiceBehavior(ConcurrencyMode = ConcurrencyMode.Multiple, InstanceContextMode = InstanceContextMode.PerCall)]
    public partial class DataIntegrationService : IDataIntegrationService
    {
        public DataIntegrationService()
        {
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/json";
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Origin", "*");
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Methods", "POST, GET");
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
            var currentPath = new FileInfo(Process.GetCurrentProcess().MainModule.FileName + ".config").ToString();
            var xmlConfigPath = this.XmlConfigPath(currentPath);
            XmlConfigurator.Configure(new FileInfo(xmlConfigPath));
        }

        private string XmlConfigPath(string currentPath)
        {
            var fileInfo = new FileInfo(currentPath);
            var DirectoryPath = fileInfo.DirectoryName;

            var xmlConfigPath = DirectoryPath + "\\" + "Web.config";
            return xmlConfigPath;
        }

        public string SetSourceData(Stream stream)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var param = SetSource(stream);

            return param;
        }

        private string SetSource(Stream stream)
        {
            var param = string.Empty;
            using (var streamReader = new StreamReader(stream))
            {
                param = streamReader.ReadToEnd().Replace(" ", "").Replace("\r", "").Replace("\n", "").Replace("\t", "");
            }
            var requestData = DataConverter.JsonToDictionary<SourceClass>(param);
            var collectedDate = "CURTIME(3)";
            var fieldQuery = "INSERT INTO fieldinfo (Source, Field, end, start) VALUES ";
            var sourceQuery = "INSERT INTO sourcedata (Source, SourceData, UnixTimeStamp) VALUES ";
            var valuesQuery = string.Empty;
            var fieldList = new List<string>();
            if (requestData.Data.Count == 0) return System.Net.HttpStatusCode.BadRequest.ToString();
            foreach (var item in requestData.Data)
            {
                if (item.Count == 0) continue;
                var relationKV = string.Empty;
                if (item.ContainsKey(requestData.TimeField)) collectedDate = "FROM_UNIXTIME(" + item[requestData.TimeField].ToString() + ")";
                foreach (var kv in item)
                {
                    relationKV = relationKV + "'" + kv.Key + "','" + kv.Value + "',";
                    if (!fieldList.Contains(kv.Key))
                    {
                        fieldList.Add(kv.Key.ToString());
                        fieldQuery = fieldQuery + "('" + requestData.Source + "','" + kv.Key.ToString() + "',{end}," + collectedDate + "),";
                    }
                }
                relationKV = relationKV.Substring(0, relationKV.Length - 1);
                var createQuery = "COLUMN_CREATE(" + relationKV + ")";
                sourceQuery = sourceQuery + "('" + requestData.Source + "'," + createQuery + ", " + collectedDate + "),";
            }
            fieldQuery = fieldQuery.Substring(0, fieldQuery.Length - 1) + " ON DUPLICATE KEY UPDATE end = " + collectedDate + ";";
            sourceQuery = sourceQuery.Substring(0, sourceQuery.Length - 1) + ";" + fieldQuery.Replace("{end}", collectedDate);

            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", sourceQuery);
            return param;
        }

        public Stream GetSourceData(Stream stream)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var param = string.Empty;
            using (var streamReader = new StreamReader(stream))
            {
                param = streamReader.ReadToEnd().Replace("\r", "").Replace("\n", "").Replace("\t", "");
            }

            var requestData = DataConverter.JsonToDictionary<QueryClass>(param);

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", requestData.Query);

            var retString = DataConverter.JsonToDataTable(retTable);

            var bytes = Encoding.UTF8.GetBytes(retString);

            return new MemoryStream(bytes);
        }


        public Stream GetFields(Stream stream)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            return stream;
        }

        public Stream SetStockList()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var stockListUrl = "http://www.google.com/finance?output=json&start=0&num=9999&noIL=1&q=[currency%20%3D%3D%20%22KRW%22%20%26%20%28%28exchange%20%3D%3D%20%22KOSDAQ%22%29%20%7C%20%28exchange%20%3D%3D%20%22KRX%22%29%29%20%26%20%28last_price%20%3E%3D%200%29%20%26%20%28last_price%20%3E%3D%200%29]&restype=company&ei=2toFV6GBCsGN0gTmhKHIAw";

            Task.Factory.StartNew(() =>
            {
                var exSource = new ExternalSourceClass()
                {
                    SourceKey = "stocklist",
                    ModuleName = "RestReceiver",
                    Config = stockListUrl,
                    DataType = "json",
                    Query = "searchresults"
                };

                var container = new Dictionary<string, List<Dictionary<object, object>>>();

                var result = ModuleManager.Instance.ModuleDistributor(exSource);

                if (result is JArray)
                {
                    JArray aa = result as JArray;
                    var insert = (from p in aa select p.ToObject<Dictionary<object, object>>()).ToList();
                    container.Add(exSource.SourceKey, insert);
                }
                else
                {
                    JObject bb = result as JObject;

                    var insert = (from p in bb["searchresults"] select p.ToObject<Dictionary<object, object>>()).ToList();
                    container.Add(exSource.SourceKey, insert);
                }

                foreach (var item in container)
                {
                    var ddd = new SourceClass()
                    {
                        Data = item.Value,
                        Source = item.Key,
                        TimeField = string.Empty
                    };
                    var test = DataConverter.DynamicToString<SourceClass>(ddd);

                    var mem = new MemoryStream(Encoding.UTF8.GetBytes(test));
                    Task.Factory.StartNew(() =>
                    {
                        SetSource(mem);
                    });
                }
            });

            return new MemoryStream(Encoding.UTF8.GetBytes("OK"));
        }

        public Stream SetStockHistory()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var listQuery = "SELECT * FROM (SELECT COLUMN_GET(`sourcedata`, 'ticker' as char) as id, COLUMN_GET(`sourcedata`, 'title' as char) as title, COLUMN_GET(`sourcedata`, 'exchange' as char) as exchange FROM sourcedata where source = 'stocklist') as stocklist GROUP BY stocklist.id;";

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", listQuery);

            var historyUrl = "http://www.google.com/finance/getprices?q={ticker}&i=86400&p=40Y&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg";

            Task.Factory.StartNew(() =>
            {
                var rand = new Random();

                foreach (DataRow items in retTable.Rows)
                {
                    var code = items.ItemArray[0].ToString();
                    var url = historyUrl.Replace("{ticker}", code);
                    try
                    {
                        var exSource = new ExternalSourceClass()
                        {
                            SourceKey = items.ItemArray[0].ToString(),
                            ModuleName = "RestReceiver",
                            Config = url,
                            DataType = "csv",
                            Query = "DATE,CLOSE,HIGH,LOW,OPEN,VOLUME,CDAYS",
                            Interval = 86400
                        };

                        var result = ModuleManager.Instance.ModuleDistributor(exSource);

                        if (result is JArray)
                        {
                            JArray aa = result as JArray;
                            var insert = (from p in aa select p.ToObject<Dictionary<object, object>>()).ToList();
                            var ddd = new SourceClass()
                            {
                                Data = insert,
                                Source = items.ItemArray[0].ToString(),
                                TimeField = "DATE"
                            };
                            var test = DataConverter.DynamicToString<SourceClass>(ddd);
                            var mem = new MemoryStream(Encoding.UTF8.GetBytes(test));
                            Task.Factory.StartNew(() =>
                            {
                                SetSource(mem);
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.LogWriter.Error("Error Url : " + url);
                        Log.LogWriter.Error(ex.ToString());
                    }

                    Thread.Sleep(rand.Next(500));
                }
            });

            return new MemoryStream(Encoding.UTF8.GetBytes("OK"));
        }

        public Stream SetStockCurrent()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var listQuery = "SELECT * FROM (SELECT COLUMN_GET(`sourcedata`, 'ticker' as char) as id, COLUMN_GET(`sourcedata`, 'title' as char) as title, COLUMN_GET(`sourcedata`, 'exchange' as char) as exchange FROM sourcedata where source = 'stocklist') as stocklist GROUP BY stocklist.id;";

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", listQuery);

            var historyUrl = "http://www.google.com/finance/info?infotype=infoquoteall&q={exchange}:{ticker}";

            Task.Factory.StartNew(() =>
            {
                var rand = new Random();

                foreach (DataRow items in retTable.Rows)
                {
                    var code = items.ItemArray[0].ToString();
                    var exchange = items.ItemArray[2].ToString().ToUpper();
                    var url = historyUrl.Replace("{ticker}", code).Replace("{exchange}", exchange);
                    try
                    {
                        var exSource = new ExternalSourceClass()
                        {
                            SourceKey = items.ItemArray[0].ToString(),
                            ModuleName = "RestReceiver",
                            Config = url,
                            DataType = "current",
                            Query = "DATE,CLOSE,HIGH,LOW,OPEN,VOLUME,CDAYS",
                            Interval = 60
                        };
                        var result = ModuleManager.Instance.ModuleDistributor(exSource);
                        var date = Regex.Replace(result[0]["lt_dts"], "T", " ");
                        date = Regex.Replace(date, "Z", "");
                        try
                        {
                            date = DateTime.Parse(date);
                            if (date.ToString("yyyy-MM-dd") != DateTime.Now.ToString("yyyy-MM-dd"))
                            {
                                continue;
                            }
                        }
                        catch
                        {
                            continue;
                        }
                        var close = Regex.Replace(result[0]["l"], ",", ""); var high = Regex.Replace(result[0]["hi"], ",", "");
                        var low = Regex.Replace(result[0]["lo"], ",", ""); var open = Regex.Replace(result[0]["op"], ",", "");
                        var volume = Regex.Replace(result[0]["vo"], ",", ""); var dict = new Dictionary<object, object>();
                        if (volume.Contains("M"))
                        {
                            volume = Regex.Replace(volume, "M", "");
                            volume = float.Parse(volume) * 1000000;
                        }
                        dict.Add("DATE", EnvironmentHelper.GetUnixTime(date) / 1000); dict.Add("VOLUME", volume);
                        dict.Add("CLOSE", close); dict.Add("HIGH", high); dict.Add("LOW", low); dict.Add("OPEN", open); dict.Add("CDAYS", "1");
                        var insert = new List<Dictionary<object, object>>();
                        insert.Add(dict);
                        var ddd = new SourceClass()
                        {
                            Data = insert,
                            Source = code,
                            TimeField = "DATE"
                        };
                        var test = DataConverter.DynamicToString<SourceClass>(ddd);
                        var mem = new MemoryStream(Encoding.UTF8.GetBytes(test));

                        Task.Factory.StartNew(() =>
                        {
                            SetSource(mem);
                        });
                    }
                    catch (Exception ex)
                    {
                        Log.LogWriter.Error("Error Url : " + url);
                        Log.LogWriter.Error(ex.ToString());
                    }

                    Thread.Sleep(rand.Next(500));
                }
            });

            return new MemoryStream(Encoding.UTF8.GetBytes("OK"));
        }

        public Stream SetStockAnalysis()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var listQuery = "SELECT * FROM (SELECT COLUMN_GET(`sourcedata`, 'ticker' as char) as id, COLUMN_GET(`sourcedata`, 'title' as char) as title, COLUMN_GET(`sourcedata`, 'exchange' as char) as exchange FROM sourcedata where source = 'stocklist') as stocklist GROUP BY stocklist.id;";

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", listQuery);

            Task.Factory.StartNew(() =>
            {
                foreach (DataRow items in retTable.Rows)
                {
                    var code = items.ItemArray[0].ToString();
                    try
                    {
                        var mv = GetMvSource(code, "0", EnvironmentHelper.GetUnixNow().ToString(), true);
                        var shortterm = GetTrixSource(code, "day", "12", "9", "0", EnvironmentHelper.GetUnixNow().ToString(), true);
                        var longterm = GetTrixSource(code, "day", "60", "45", "0", EnvironmentHelper.GetUnixNow().ToString(), true);
                        if (mv.Count == 0 || shortterm.Count == 0 || longterm.Count == 0) continue;
                        mv[0].Add("ticker", code); mv[0].Add("trix12", shortterm[0]["trix"]); mv[0].Add("trix_signal9", shortterm[0]["trix_signal"]);
                        mv[0].Add("catch12", shortterm[0]["catch"]); mv[0].Add("catch_signal9", shortterm[0]["catch_signal"]); mv[0].Add("trix60", longterm[0]["trix"]);
                        mv[0].Add("trix_signal45", longterm[0]["trix_signal"]); mv[0].Add("catch60", longterm[0]["catch"]); mv[0].Add("catch_signal45", longterm[0]["catch_signal"]);
                        var complete = new SourceClass()
                        {
                            Data = mv,
                            Source = "currentstock",
                            TimeField = "createdtime"
                        };
                        var hoho = DataConverter.DynamicToString<SourceClass>(complete);
                        var what = new MemoryStream(Encoding.UTF8.GetBytes(hoho));
                        SetSource(what);
                    }
                    catch(Exception ex)
                    {
                        Log.LogWriter.Error("Error key : " + code);
                        Log.LogWriter.Error(ex.ToString());
                    }
                }
            });

            return new MemoryStream(Encoding.UTF8.GetBytes("OK"));
        }


        public Stream GetTrix(string source, string type, string trix, string signal, string start, string end)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var retDict = GetTrixSource(source, type, trix, signal, start, end);

            var resultDict = new Dictionary<string, List<Dictionary<object, object>>>();
            var fields = new List<Dictionary<object, object>>();
            resultDict.Add("Fields", fields);
            resultDict.Add("Data", retDict);
            var retString = DataConverter.DynamicToString<Dictionary<string, List<Dictionary<object, object>>>>(resultDict);
            var bytes = Encoding.UTF8.GetBytes(retString);

            return new MemoryStream(bytes);
        }

        private static List<Dictionary<object, object>> GetTrixSource(string source, string type, string trix, string signal, string start, string end, bool onlyCurrent = false)
        {
            var query = string.Empty;

            if (type == "day")
                query = QueryDefine.trixbyday.Replace("{ticker}", source).Replace("{trix}", trix).Replace("{signal}", signal).Replace("{start}", start).Replace("{end}", end);
            else
                query = QueryDefine.trixbyweek.Replace("{ticker}", source).Replace("{trix}", trix).Replace("{signal}", signal).Replace("{start}", start).Replace("{end}", end);

            if (onlyCurrent)
                query = query + " ORDER BY cur.quotedate DESC LIMIT 1;";

            var trixTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);
            var retDict = DataConverter.ListToDataTable(trixTable);
            return retDict;
        }


        public Stream GetStockList()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var query = QueryDefine.stocklist;

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);

            var retString = DataConverter.JsonToDataTable(retTable);

            var bytes = Encoding.UTF8.GetBytes(retString);

            return new MemoryStream(bytes);
        }

        public Stream GetMovingAverage(string source, string start, string end)
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var retDict = GetMvSource(source, start, end);

            var resultDict = new Dictionary<string, List<Dictionary<object, object>>>();
            var fields = new List<Dictionary<object, object>>();
            resultDict.Add("Fields", fields);
            resultDict.Add("Data", retDict);
            var retString = DataConverter.DynamicToString<Dictionary<string, List<Dictionary<object, object>>>>(resultDict);
            var bytes = Encoding.UTF8.GetBytes(retString);

            return new MemoryStream(bytes);
        }

        private static List<Dictionary<object, object>> GetMvSource(string source, string start, string end, bool onlyCurrent = false)
        {
            var query = QueryDefine.movingavg;

            query = query.Replace("{source}", source).Replace("{start}", start).Replace("{end}", end);

            if (onlyCurrent)
                query = query + " ORDER BY quotedate DESC LIMIT 1;";

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);

            var retDict = DataConverter.ListToDataTable(retTable);
            return retDict;
        }

        public Stream GetStockCurrent()
        {
            if (WebOperationContext.Current == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var query = QueryDefine.currentStockInfo;

            var retTable = MariaDBConnector.Instance.GetQuery("DynamicQueryExecuter", query);

            var retDict = DataConverter.ListToDataTable(retTable);

            var retString = DataConverter.JsonToDataTable(retTable);

            var bytes = Encoding.UTF8.GetBytes(retString);

            return new MemoryStream(bytes);
        }
    }
}