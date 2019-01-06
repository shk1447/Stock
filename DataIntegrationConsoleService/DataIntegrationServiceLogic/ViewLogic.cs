using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connector;
using System.Diagnostics;
using Common;
using Model.Request;
using Model.Common;
using System.Threading;

namespace DataIntegrationServiceLogic
{
    public class ViewLogic
    {
        public enum TrendType
        {
            Upward,
            Downward
        }

        private const string TableName = "data_view";
        private AutoResetEvent autoResetEvent;
        private System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue;

        public ViewLogic()
        {

        }

        public ViewLogic(ref AutoResetEvent autoResetEvent, ref System.Collections.Concurrent.ConcurrentQueue<JsonObject> concurrentQueue)
        {
            // TODO: Complete member initialization
            this.autoResetEvent = autoResetEvent;
            this.concurrentQueue = concurrentQueue;
        }

        public string Schema(string privilege)
        {
            var fields = new JsonArray();

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW NAME"),
                                      new KeyValuePair<string, JsonValue>("value", "name"),
                                      new KeyValuePair<string, JsonValue>("type", "Text"),
                                      new KeyValuePair<string, JsonValue>("group", 0),
                                      new KeyValuePair<string, JsonValue>("required", true)));

            var sourceArray_current = new JsonArray();
            var sourceArray_past = new JsonArray();
            var sourceQuery = MariaQueryDefine.GetSourceInformation;
            var sources = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", sourceQuery);
            if (sources != null)
            {
                foreach (var source in sources)
                {
                    var sourceName = source["TABLE_NAME"].ReadAs<string>().Replace("current_", "");
                    var schemaQuery = MariaQueryDefine.GetSchema.Replace("{source}", sourceName);
                    var schema = MariaDBConnector.Instance.GetJsonObject("DynamicQueryExecuter", schemaQuery);
                    var schemaArray = new JsonArray();
                    var columnList = new List<string>();
                    if (schema != null)
                    {
                        var columnArray = schema["column_list"].ReadAs<string>().Split(',');
                        foreach (var column in columnArray)
                        {
                            if (!columnList.Contains(column))
                            {
                                columnList.Add(column);
                                schemaArray.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", column),
                                                                new KeyValuePair<string, JsonValue>("value", column)));
                            }
                        }
                    }

                    var schemaFields = new JsonObject(new KeyValuePair<string, JsonValue>("text", "FIELDS"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_fields"),
                                                        new KeyValuePair<string, JsonValue>("type", "MultiSelect"),
                                                        new KeyValuePair<string, JsonValue>("group", 3),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                        new KeyValuePair<string, JsonValue>("options", schemaArray));

                    sourceArray_current.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", sourceName),
                                                    new KeyValuePair<string, JsonValue>("value", sourceName),
                                                    new KeyValuePair<string, JsonValue>("fields", new JsonArray(schemaFields))));
                }
            }

            var current_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                        new KeyValuePair<string, JsonValue>("type", "Select"),
                                                        new KeyValuePair<string, JsonValue>("group", 1),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                        new KeyValuePair<string, JsonValue>("options", sourceArray_current)));

            var video_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                        new KeyValuePair<string, JsonValue>("type", "Text"),
                                                        new KeyValuePair<string, JsonValue>("group", 1),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options")));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "VIEW TYPE"),
                                        new KeyValuePair<string, JsonValue>("value", "view_type"),
                                        new KeyValuePair<string, JsonValue>("type", "Select"),
                                        new KeyValuePair<string, JsonValue>("group", 0),
                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                        new KeyValuePair<string, JsonValue>("required", true),
                                        new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                            new JsonObject(
                                                new KeyValuePair<string, JsonValue>("text", "실시간"),
                                                new KeyValuePair<string, JsonValue>("value", "current"),
                                                new KeyValuePair<string, JsonValue>("fields", current_sourceFields)
                                            ), new JsonObject(
                                                new KeyValuePair<string, JsonValue>("text", "영상"),
                                                new KeyValuePair<string, JsonValue>("value", "video"),
                                                new KeyValuePair<string, JsonValue>("fields", video_sourceFields)
                                            )))));

            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "UPDATED TIME"),
                                        new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                        new KeyValuePair<string, JsonValue>("type", "Data")));

            return fields.ToString();
        }

        private void Notify()
        {

        }

        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "column_json(view_options) as view_options", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonObj);
            var res = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", query);

            return res.ToString();
        }

        public string Create(JsonValue jsonObj)
        {
            var view_type = jsonObj["view_type"].ReadAs<string>();
            if (jsonObj.ContainsKey("view_options") && view_type != "video")
            {
                var options = jsonObj["view_options"];
                var view_fields = options["view_fields"];
                var view_source = view_type + "_" + options["view_source"].ReadAs<string>();

                var query = string.Empty;
                var queryBuilder = new StringBuilder();
                if (view_type == "current")
                {
                    queryBuilder.Append("SELECT * FROM (SELECT category,");
                    foreach (var field in view_fields)
                    {
                        var value = field.Value.ReadAs<string>();
                        queryBuilder.Append("column_get(`rawdata`, '").Append(value).Append("' as char) as `").Append(value).Append("`,");
                    }
                    queryBuilder.Append("unixtime ");
                    queryBuilder.Append("FROM ").Append(view_source).Append(") as result");

                    query = queryBuilder.ToString();
                }
                else
                {
                    var view_category = options["view_category"].ReadAs<string>();
                    var view_sampling = options["view_sampling"].ReadAs<string>();
                    var view_sampling_period = options["view_sampling_period"].ReadAs<string>();

                    var sampling_items = new StringBuilder();
                    queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(unixtime) as unixtime FROM (SELECT ");
                    foreach (var field in view_fields)
                    {
                        var value = field.Value.ReadAs<string>();
                        queryBuilder.Append("column_get(`rawdata`, '").Append(value).Append("' as double) as `").Append(value).Append("`,");
                        sampling_items.Append(view_sampling).Append("(`").Append(value).Append("`) as `").Append(value).Append("`,");
                    }

                    queryBuilder.Append("unixtime ").Append("FROM ").Append(view_source).Append(" WHERE category = '").Append(view_category).Append("') as result");

                    if (view_sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
                    else if (view_sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
                    else if (view_sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
                    else if (view_sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
                    else if (view_sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

                    query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
                }

                jsonObj["view_query"] = query;
            }
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, false);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            return res.ToString();
        }

        public string Modify(JsonValue jsonObj)
        {
            var view_type = jsonObj["view_type"].ReadAs<string>();
            if (jsonObj.ContainsKey("view_options") && view_type != "video")
            {
                var options = jsonObj["view_options"];
                var view_fields = options["view_fields"];
                var view_source = view_type + "_" + options["view_source"].ReadAs<string>();

                var query = string.Empty;
                var queryBuilder = new StringBuilder();
                if (view_type == "current")
                {
                    queryBuilder.Append("SELECT * FROM (SELECT category,");
                    foreach (var field in view_fields)
                    {
                        var value = field.Value.ReadAs<string>();
                        queryBuilder.Append("column_get(`rawdata`, '").Append(value).Append("' as char) as `").Append(value).Append("`,");
                    }
                    queryBuilder.Append("unixtime ");
                    queryBuilder.Append("FROM ").Append(view_source).Append(") as result");

                    query = queryBuilder.ToString();
                }
                else
                {
                    var view_category = options["view_category"].ReadAs<string>();
                    var view_sampling = options["view_sampling"].ReadAs<string>();
                    var view_sampling_period = options["view_sampling_period"].ReadAs<string>();

                    var sampling_items = new StringBuilder();
                    queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(unixtime) as unixtime FROM (SELECT ");
                    foreach (var field in view_fields)
                    {
                        var value = field.Value.ReadAs<string>();
                        queryBuilder.Append("column_get(`rawdata`, '").Append(value).Append("' as double) as `").Append(value).Append("`,");
                        sampling_items.Append(view_sampling).Append("(`").Append(value).Append("`) as `").Append(value).Append("`,");
                    }
                    queryBuilder.Append("unixtime ").Append("FROM ").Append(view_source).Append(" WHERE category = '").Append(view_category).Append("') as result");

                    if (view_sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
                    else if (view_sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
                    else if (view_sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
                    else if (view_sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
                    else if (view_sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

                    query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
                }

                jsonObj["view_query"] = query;
            }
            var upsertQuery = MariaQueryBuilder.UpsertQuery(TableName, jsonObj, true);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", upsertQuery);

            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", deleteQuery);

            return res.ToString();
        }

        public string Execute(JsonValue jsonValue)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", viewInfo["view_query"].ReadAs<string>());
            return res.ToString();
        }

        public string ExecuteItem(JsonValue jsonObj)
        {
            var ret = string.Empty;
            var source = jsonObj["source"].ReadAs<string>();
            var fields = jsonObj["fields"];
            var category = jsonObj["category"].ReadAs<string>();
            var sampling = jsonObj["sampling"].ReadAs<string>();
            var sampling_period = jsonObj["sampling_period"].ReadAs<string>();
            var trend_analysis = jsonObj["trend_analysis"].ReadAs<bool>();
            var from = jsonObj["from"].ReadAs<string>();
            var to = jsonObj["to"].ReadAs<string>();

            Stopwatch sw = new Stopwatch();
            sw.Start();
            if (trend_analysis)
            {
                ret = this.VAPatternAnalysis(source, category, sampling, sampling_period, from, to);
            }
            else
            {
                var fieldQuery = new StringBuilder("SELECT column_json(rawdata) as `types` FROM fields_").Append(source);
                var fieldInfo = MariaDBConnector.Instance.GetJsonObject(fieldQuery.ToString());

                var queryBuilder = new StringBuilder();
                var sampling_items = new StringBuilder();
                queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(unixtime) as unixtime FROM (SELECT ");
                foreach (var field in fields)
                {
                    var item_key = field.Value.ReadAs<string>();
                    if (item_key != "category" && item_key != "unixtime")
                    {
                        var type = fieldInfo["types"][item_key].ReadAs<string>();
                        if (type == "number")
                        {
                            queryBuilder.Append("COLUMN_GET(`rawdata`,'").Append(item_key).Append("' as double) as `").Append(item_key).Append("`,");
                            sampling_items.Append(sampling).Append("(`").Append(item_key).Append("`) as `").Append(item_key).Append("`,");
                        }
                    }
                }
                queryBuilder.Append("unixtime ").Append("FROM ").Append("past_" + source).Append(" WHERE category = '").Append(category).Append("' AND ")
                    .Append("unixtime >= '").Append(from).Append("' AND unixtime <= '").Append(to).Append("') as result");

                if (sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
                else if (sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
                else if (sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
                else if (sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
                else if (sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

                var query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
                var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", query);
                ret = res.ToString();
            }
            sw.Stop();
            Console.WriteLine("response speed : {0} ms", sw.ElapsedMilliseconds);
            return ret;
        }

        public string VAPatternAnalysis(string source, string category, string sampling, string sampling_period, string from = null, string to = null)
        {
            var result = this.AutoAnalysis(sampling_period, sampling, new List<string>() { category }, from, to);
            var resultArr = JsonArray.Parse(result);
            var ret = new JsonObject();
            ret.Add("data", resultArr);
            ret.Add("fields", new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "V패턴_비율"),
                                                           new KeyValuePair<string, JsonValue>("value", "V패턴_비율"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "A패턴_비율"),
                                                           new KeyValuePair<string, JsonValue>("value", "A패턴_비율"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "RSI"),
                                                           new KeyValuePair<string, JsonValue>("value", "RSI"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "주가위치"),
                                                           new KeyValuePair<string, JsonValue>("value", "주가위치"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false)),
                                            //new JsonObject(new KeyValuePair<string, JsonValue>("text", "VOLUME_OSCILLATOR"),
                                            //               new KeyValuePair<string, JsonValue>("value", "VOLUME_OSCILLATOR"),
                                            //               new KeyValuePair<string, JsonValue>("type", "Number"),
                                            //               new KeyValuePair<string, JsonValue>("group", 0),
                                            //               new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "unixtime"),
                                                           new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false))));

            return ret.ToString();
        }

        public string AutoAnalysis(string period, string method, List<string> stock, string from = null, string to = null, bool history = true)
        {
            var resultArr = new JsonArray();
            var source = "stock";
            var field = "종가";
            var sampling = method;
            var sampling_period = period == "day" || period == "week" || period == "month" || period == "year" ? period : "week";

            var progress = 1;
            var categories_query = "SELECT category, column_get(rawdata, '종목명' as char) as `종목명`," + 
                                   "column_get(rawdata, '상장주식수' as char) as `상장주식수` FROM current_" + source;
            if (stock.Count > 0)
            {
                var last = 1;
                categories_query = categories_query + " WHERE ";
                foreach (var stock_name in stock)
                {
                    var separator = stock.Count > last ? " OR " : ";";
                    categories_query = categories_query + " category like '%" + stock_name.Trim() + "%'" + separator;
                    last++;
                }
            }
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var categories = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", categories_query);
            var total = categories.Count;
            Console.WriteLine("category query time : {0} ms", sw.ElapsedMilliseconds);
            sw.Restart();
            foreach (var row in categories)
            {
                var name = row["종목명"].ReadAs<string>();
                var amount = row["상장주식수"].ReadAs<string>();
                var category = row["category"].ReadAs<string>();
                var queryBuilder = new StringBuilder(MariaQueryDefine.GetAnalysis);

                var time_range = string.Empty;

                if (to != null)
                {
                    time_range += " AND unixtime <= '" + to + "'";
                }
                if (from != null && !string.IsNullOrWhiteSpace(time_range))
                {
                    time_range += " AND unixtime >= '" + from + "'";
                }

                if (sampling_period == "all")
                    queryBuilder.Replace("{sampling_query}", "GROUP BY result01.unixtime ASC")
                                .Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "day")
                    queryBuilder.Replace("{sampling_query}", "GROUP BY DATE(result01.unixtime) ASC")
                                .Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "week")
                    queryBuilder.Replace("{sampling_query}", "GROUP BY TO_DAYS(result01.unixtime) - WEEKDAY(result01.unixtime) ASC")
                                .Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "month")
                    queryBuilder.Replace("{sampling_query}", "GROUP BY DATE_FORMAT(result01.unixtime, '%Y-%m') ASC")
                                .Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "year")
                    queryBuilder.Replace("{sampling_query}", "GROUP BY DATE_FORMAT(result01.unixtime, '%Y') ASC")
                                .Replace("{short_day}", "5").Replace("{long_day}", "20");
                queryBuilder.Replace("{sampling}", sampling);
                queryBuilder.Replace("{time_range}", time_range);
                queryBuilder.Replace("{category}", category);
                var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", queryBuilder.ToString());

                Console.WriteLine("data query time : {0} ms", sw.ElapsedMilliseconds);
                sw.Restart();
                var data = res["data"].ReadAs<JsonArray>();
                if (data.Count == 0) continue;
                var refFields = res["fields"].ReadAs<JsonArray>();
                var fieldCnt = refFields.ReadAs<JsonArray>().Count;

                double 최고가 = 0;
                double 최저가 = 0;

                try
                {
                    var max = data.Aggregate<JsonValue>((arg1, arg2) =>
                    {
                        return arg1[field].ReadAs<double>() > arg2[field].ReadAs<double>() ? arg1 : arg2;
                    });
                    var min = data.Aggregate<JsonValue>((arg1, arg2) =>
                    {
                        return arg1[field].ReadAs<double>() < arg2[field].ReadAs<double>() ? arg1 : arg2;
                    });
                    최고가 = max[field].ReadAs<double>();
                    최저가 = min[field].ReadAs<double>();
                    Segmentation(ref refFields, ref data, data, field, max[field].ReadAs<double>(), min[field].ReadAs<double>());
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

                Console.WriteLine("analysis time : {0} ms", sw.ElapsedMilliseconds);
                sw.Restart();
                var index = 0;
                if (!history)
                {
                    var datum = data[data.Count - 1];
                    var result = NewMethod(field, name, amount, 최고가, 최저가, datum);

                    var curr_start = datum["시가"].ReadAs<double>();
                    var curr_end = datum["종가"].ReadAs<double>();
                    var curr_high = datum["고가"].ReadAs<double>();
                    var curr_low = datum["저가"].ReadAs<double>();

                    result.Add("curr_start", curr_start); result.Add("curr_end", curr_end); result.Add("curr_high", curr_high); result.Add("curr_low", curr_low);

                    if (data.Count > 2)
                    {
                        var prev_datum = data[data.Count - 2];
                        var prev_start = prev_datum["시가"].ReadAs<double>();
                        var prev_end = prev_datum["종가"].ReadAs<double>();
                        var prev_high = prev_datum["고가"].ReadAs<double>();
                        var prev_low = prev_datum["저가"].ReadAs<double>();

                        result.Add("prev_start", prev_start); result.Add("prev_end", prev_end); result.Add("prev_high", prev_high); result.Add("prev_low", prev_low);
                    }
                    resultArr.Add(result);
                }
                else
                {
                    foreach (var datum in data)
                    {
                        var result = NewMethod(field, name, amount, 최고가, 최저가, datum);
                        resultArr.Add(result);
                    }
                }
                Console.WriteLine("reponse data time : {0} ms", sw.ElapsedMilliseconds);
                EnvironmentHelper.ProgressBar(progress, total);
                progress++;
            }

            return resultArr.ToString();
        }

        private static JsonObject NewMethod(string field, string name, string amount, double 최고가, double 최저가, JsonValue datum)
        {
            var prevCount = 0;
            var currentCount = 0;
            var lastState = string.Empty;
            var result = new JsonObject();
            var supportArr = new JsonArray();
            var resistanceArr = new JsonArray();

            foreach (var item in datum)
            {
                if (item.Key == field) { result.Add(field, item.Value.ReadAs<double>()); continue; }
                if (item.Key == "RSI") { result.Add("RSI", item.Value == null ? 0 : item.Value.ReadAs<double>()); continue; }
                if (item.Key == "거래량") { result.Add("거래량", item.Value == null ? 0 : item.Value.ReadAs<double>()); continue; }
                if (item.Key == "생명선") { result.Add("생명선", item.Value == null ? 0 : item.Value.ReadAs<double>()); continue; }
                if (item.Key == "VOLUME_OSCILLATOR") { result.Add("VOLUME_OSCILLATOR", item.Value == null ? 0 : item.Value.ReadAs<double>()); continue; }
                if (item.Key == "천장") { result.Add("천장", item.Value); continue; }
                if (item.Key == "바닥") { result.Add("바닥", item.Value); continue; }
                if (item.Key == "unixtime") { result.Add("unixtime", item.Value.ReadAs<double>()); continue; }

                if (item.Key.Contains("support"))
                {
                    if (lastState == "하락")
                    {
                        prevCount = currentCount;
                        currentCount = 0;
                    }
                    lastState = "상승";
                    supportArr.Add(item.Value.ReadAs<double>());
                    currentCount++;
                }
                else if (item.Key.Contains("resistance"))
                {
                    if (lastState == "상승")
                    {
                        prevCount = currentCount;
                        currentCount = 0;
                    }
                    lastState = "하락";
                    resistanceArr.Add(item.Value.ReadAs<double>());
                    currentCount++;
                }
            }

            var time = result["unixtime"].ReadAs<double>();
            var total_support = new JsonArray();
            var total_resistance = new JsonArray();
            var real_support = supportArr.Where<JsonValue>(p => p.ReadAs<double>() < result[field].ReadAs<double>());
            var reverse_support = supportArr.Where<JsonValue>(p => p.ReadAs<double>() > result[field].ReadAs<double>());
            var real_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<double>() > result[field].ReadAs<double>());
            var reverse_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<double>() < result[field].ReadAs<double>());
            total_support.AddRange(real_support);
            total_support.AddRange(reverse_resistance);
            total_resistance.AddRange(real_resistance);
            total_resistance.AddRange(reverse_support);
            result.Add("종목명", name);
            result.Add("상장주식수", amount);
            result.Add("현재상태", lastState);
            result.Add("현재상태_유지횟수", currentCount);
            result.Add("과거상태_유지횟수", prevCount);
            result.Add("실제지지_갯수", real_support.Count());
            result.Add("실제저항_갯수", real_resistance.Count());
            result.Add("반전지지_갯수", reverse_resistance.Count());
            result.Add("반전저항_갯수", reverse_support.Count());
            result.Add("저항수", total_resistance.Count);
            result.Add("지지수", total_support.Count);
            result.Add("최고가", 최고가);
            result.Add("최저가", 최저가);
            result.Add("주가위치", (result[field].ReadAs<double>() - 최저가) / (최고가 - 최저가) * 100);

            if (reverse_resistance.Count() > 0) result.Add("반전지지", reverse_resistance.OrderByDescending(p => p.ReadAs<double>()).ToJsonArray().ToString());
            if (real_support.Count() > 0) result.Add("실제지지", real_support.OrderByDescending(p => p.ReadAs<double>()).ToJsonArray().ToString());
            if (reverse_support.Count() > 0) result.Add("반전저항", reverse_support.OrderBy(p => p.ReadAs<double>()).ToJsonArray().ToString());
            if (real_resistance.Count() > 0) result.Add("실제저항", real_resistance.OrderBy(p => p.ReadAs<double>()).ToJsonArray().ToString());


            var v_pattern_real = result["실제지지_갯수"].ReadAs<double>() / (result["반전저항_갯수"].ReadAs<double>() + result["실제지지_갯수"].ReadAs<double>()) * 100;
            var v_pattern_reverse = result["반전지지_갯수"].ReadAs<double>() / (result["실제저항_갯수"].ReadAs<double>() + result["반전지지_갯수"].ReadAs<double>()) * 100;
            var v_pattern = ((double.IsNaN(v_pattern_real) || double.IsInfinity(v_pattern_real) ? 0 : v_pattern_real) +
                            (double.IsNaN(v_pattern_reverse) || double.IsInfinity(v_pattern_reverse) ? 0 : v_pattern_reverse));

            var a_pattern_real = result["실제저항_갯수"].ReadAs<double>() / (result["반전지지_갯수"].ReadAs<double>() + result["실제저항_갯수"].ReadAs<double>()) * 100;
            var a_pattern_reverse = result["반전저항_갯수"].ReadAs<double>() / (result["실제지지_갯수"].ReadAs<double>() + result["반전저항_갯수"].ReadAs<double>()) * 100;
            var a_pattern = ((double.IsNaN(a_pattern_real) || double.IsInfinity(a_pattern_real) ? 0 : a_pattern_real) +
                            (double.IsNaN(a_pattern_reverse) || double.IsInfinity(a_pattern_reverse) ? 0 : a_pattern_reverse));

            result.Add("V패턴_비율", v_pattern);
            result.Add("A패턴_비율", a_pattern);

            if (result.ContainsKey("V패턴_비율") && result.ContainsKey("A패턴_비율"))
            {
                if (result["V패턴_비율"].ReadAs<double>() > result["A패턴_비율"].ReadAs<double>())
                {
                    // 상승을 하였으며, A패턴 비율에 따라 조정강도 파악 가능 (A패턴_비율로 오름차순정렬)
                    result.Add("전체상태", "상승");
                }
                else if (result["V패턴_비율"].ReadAs<double>() < result["A패턴_비율"].ReadAs<double>())
                {
                    // 하락을 하였으며, V패턴 비율에 따라 반등강도 파악 가능 (V패턴_비율로 오름차순정렬)
                    result.Add("전체상태", "하락");
                }
                else
                {
                    if (total_support.Count > total_resistance.Count)
                    {
                        result.Add("전체상태", "상승");
                    }
                    else if (total_support.Count < total_resistance.Count)
                    {
                        result.Add("전체상태", "하락");
                    }
                    else
                    {
                        result.Add("전체상태", "횡보");
                    }
                }
                result.Add("강도", result["V패턴_비율"].ReadAs<double>() - result["A패턴_비율"].ReadAs<double>());
            }

            result.Add("강도(갯수)", total_support.Count - total_resistance.Count);
            return result;
        }

        public string SaveFilter(string type, JsonArray jsonValue)
        {
            var set_query = string.Empty;
            var setSource = new SetDataSourceReq()
            {
                rawdata = new List<JsonDictionary>(),
                category = "종목명",
                source = "selected_stock_" + type,
                collected_at = "unixtime"
            };
            foreach (var item in jsonValue)
            {
                var jsonDict = new JsonDictionary();
                foreach (var kv in item)
                {
                    jsonDict.Add(kv.Key, kv.Value.ReadAs<string>());
                }
                setSource.rawdata.Add(jsonDict);
            }
            set_query = MariaQueryBuilder.SetDataSource(setSource);
            MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", set_query);
            return string.Empty;
        }

        public string Download(JsonValue jsonValue)
        {
            var repository = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory + ConfigurationManager.AppSettings["FileRepository"]).Replace(@"\", "/");
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject("DynamicQueryExecuter", query);
            var filePath = repository + "/" + "temp.csv";
            var outFileQuery = viewInfo["view_query"].ReadAs<string>() + " INTO OUTFILE '" + filePath + "' CHARACTER SET utf8 FIELDS TERMINATED BY ','";
            MariaDBConnector.Instance.SetQuery(outFileQuery);
            var result = File.ReadAllBytes(filePath);
            File.Delete(filePath);
            return Encoding.UTF8.GetString(result);
        }

        private void Segmentation(ref JsonArray fields, ref JsonArray result, JsonArray data, string key, double maximum, double minimum, double? startUnixTime = null)
        {
            if (startUnixTime != null)
            {
                data = data.Where<JsonValue>(p => p["unixtime"].ReadAs<double>() >= startUnixTime).ToJsonArray();
                if (data.Count == 1)
                {
                    return;
                }
            }

            var max = data.Aggregate<JsonValue>((arg1, arg2) =>
            {
                return arg1[key].ReadAs<double>() > arg2[key].ReadAs<double>() ? arg1 : arg2;
            });
            var min = data.Aggregate<JsonValue>((arg1, arg2) =>
            {
                return arg1[key].ReadAs<double>() < arg2[key].ReadAs<double>() ? arg1 : arg2;
            });

            var trendType = max["unixtime"].ReadAs<int>() > min["unixtime"].ReadAs<int>() ? TrendType.Upward : TrendType.Downward;
            var result2 = new JsonArray();
            var lastIndex = result.Count;
            switch (trendType)
            {
                case TrendType.Upward:
                    {
                        var internalData = data.Where<JsonValue>((p) =>
                        {
                            return p["unixtime"].ReadAs<int>() > min["unixtime"].ReadAs<int>() && p["unixtime"].ReadAs<int>() < max["unixtime"].ReadAs<int>();
                        });
                        this.TrendAnalysis(key, min, max, internalData, ref result2, 0, min[key].ReadAs<double>());

                        foreach (var inc in result2)
                        {
                            var unixtime = inc["unixtime"].ReadAs<int>();

                            var id = key + "_support_" + EnvironmentHelper.GetDateTimeString(unixtime);
                            var next = 0;
                            var complete = false;
                            for (int i = result.IndexOf(min); i < lastIndex; i++)
                            {
                                if (complete) break;
                                var dynamicUnixtime = result[i]["unixtime"].ReadAs<int>();
                                var diff = inc["diff"].ReadAs<double>();
                                var nextValue = min[key].ReadAs<double>() + (diff * next);
                                if (!(nextValue <= maximum))
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    complete = true;
                                }
                                else if (i == lastIndex - 1)
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    complete = true;
                                }
                                else
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                }
                                next++;
                            }
                            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", id),
                                                    new KeyValuePair<string, JsonValue>("value", id),
                                                    new KeyValuePair<string, JsonValue>("type", "Number")));
                        }
                        if (result2.Count > 0)
                        {
                            var lastObj = result[lastIndex - 1].ReadAs<JsonObject>();
                            var minVal = min["종가"].ReadAs<string>();
                            var minTime = EnvironmentHelper.GetDateTimeString(min["unixtime"].ReadAs<int>() + 1);
                            if (lastObj.ContainsKey("바닥"))
                            {
                                lastObj["바닥"].ReadAs<JsonArray>().Add(minTime + " : " + minVal + "원");
                            }
                            else
                            {
                                lastObj.Add("바닥", new JsonArray(minTime + " : " + minVal + "원"));
                            }
                        }
                        this.Segmentation(ref fields, ref result, data, key, maximum, minimum, max["unixtime"].ReadAs<double>());
                        break;
                    }
                case TrendType.Downward:
                    {
                        var internalData = data.Where<JsonValue>((p) =>
                        {
                            return p["unixtime"].ReadAs<int>() < min["unixtime"].ReadAs<int>() && p["unixtime"].ReadAs<int>() > max["unixtime"].ReadAs<int>();
                        });
                        this.TrendAnalysis(key, max, min, internalData, ref result2, 0, max[key].ReadAs<double>());

                        foreach (var dec in result2)
                        {
                            var unixtime = dec["unixtime"].ReadAs<int>();
                            var next = 0;
                            var id = key + "_resistance_" + EnvironmentHelper.GetDateTimeString(unixtime);
                            var complete = false;
                            for (int i = result.IndexOf(max); i < lastIndex; i++)
                            {
                                if (complete) break;
                                var dynamicUnixtime = result[i]["unixtime"].ReadAs<int>();

                                var diff = dec["diff"].ReadAs<double>();
                                var nextValue = max[key].ReadAs<double>() + (diff * next);
                                if (!(nextValue >= minimum))
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    complete = true;
                                }
                                else if (i == lastIndex - 1)
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    complete = true;
                                }
                                else
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                }
                                next++;
                            }
                            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", id),
                                                    new KeyValuePair<string, JsonValue>("value", id),
                                                    new KeyValuePair<string, JsonValue>("type", "Number")));
                        }
                        if (result2.Count > 0)
                        {
                            var lastObj = result[lastIndex - 1].ReadAs<JsonObject>();
                            var maxVal = max["종가"].ReadAs<string>();
                            var maxTime = EnvironmentHelper.GetDateTimeString(max["unixtime"].ReadAs<int>() + 1);
                            if (lastObj.ContainsKey("천장"))
                            {
                                lastObj["천장"].ReadAs<JsonArray>().Add(maxTime + " : " + maxVal + "원");
                            }
                            else
                            {
                                lastObj.Add("천장", new JsonArray(maxTime + " : " + maxVal + "원"));
                            }
                        }
                        this.Segmentation(ref fields, ref result, data, key, maximum, minimum, min["unixtime"].ReadAs<double>());
                        break;
                    }
            }
        }

        private void TrendAnalysis(string key, JsonValue start, JsonValue end, IEnumerable<JsonValue> data, ref JsonArray result, int prevIndex, double firstValue)
        {
            if (data.Count() == 0) return;

            var startX = start["unixtime"].ReadAs<double>();
            var startY = start[key].ReadAs<double>();
            var endX = end["unixtime"].ReadAs<double>();
            var endY = end[key].ReadAs<double>();
            var standardDegree = Math.Atan2(Math.Abs(endY - startY), (Math.Abs(endX - startX))) * 180d / Math.PI;

            var index = prevIndex;
            JsonObject minimum = null;
            double? prevDegree = null;
            foreach (var item in data)
            {
                var dynamicX = item["unixtime"].ReadAs<double>();
                var dynamicY = item[key].ReadAs<double>();
                var dynamicDegree = Math.Atan2(Math.Abs(dynamicY - startY), (Math.Abs(dynamicX - startX))) * 180d / Math.PI;
                if (prevDegree != null)
                {
                    index++;
                    if (prevDegree > dynamicDegree && standardDegree > dynamicDegree)
                    {
                        minimum[key] = dynamicY;
                        minimum["unixtime"] = dynamicX;
                        minimum["degree"] = dynamicDegree;
                        minimum["index"] = index;
                        minimum["diff"] = (dynamicY - firstValue) / index;

                        prevDegree = dynamicDegree;
                    }
                }
                if (index == prevIndex)
                {
                    index++;
                    prevDegree = dynamicDegree;
                    minimum = new JsonObject(new KeyValuePair<string, JsonValue>(key, dynamicY),
                                                     new KeyValuePair<string, JsonValue>("unixtime", dynamicX),
                                                     new KeyValuePair<string, JsonValue>("degree", dynamicDegree),
                                                     new KeyValuePair<string, JsonValue>("index", index),
                                                     new KeyValuePair<string, JsonValue>("diff", (dynamicY - firstValue) / index));
                }
            }

            if (minimum == null) return;

            result.Add(minimum);
            index = minimum["index"].ReadAs<int>();
            this.TrendAnalysis(key, minimum, end, data.Where(p => p["unixtime"].ReadAs<int>() > minimum["unixtime"].ReadAs<int>()), ref result, index, firstValue);
        }

        public void AutoFilter()
        {
            var thread = new Thread(AutoFiltering);
            thread.Start();
        }

        private void AutoFiltering(object obj)
        {
            var dayFilter = this.AutoAnalysis("day", "avg", new List<string>(), null, null, false);
            var dayJson = JsonArray.Parse(dayFilter);
            this.SaveFilter("day", (JsonArray)dayJson);
        }
    }
}
