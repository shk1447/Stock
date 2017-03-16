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
                    var schemas = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", schemaQuery);
                    var schemaArray = new JsonArray();
                    var categoryArray = new JsonArray();
                    var columnList = new List<string>();
                    foreach (var schema in schemas)
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
                        var categories = schema["categories"].ReadAs<string>().Split(',');
                        foreach (var category in categories)
                        {
                            categoryArray.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", category),
                                                                new KeyValuePair<string, JsonValue>("value", category)));
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

                    var categoryFields = new JsonObject(new KeyValuePair<string, JsonValue>("text", "CATEGORY"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_category"),
                                                        new KeyValuePair<string, JsonValue>("type", "Search"),
                                                        new KeyValuePair<string, JsonValue>("group", 2),
                                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                        new KeyValuePair<string, JsonValue>("results", categoryArray));

                    sourceArray_current.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", sourceName),
                                                    new KeyValuePair<string, JsonValue>("value", sourceName),
                                                    new KeyValuePair<string, JsonValue>("fields", new JsonArray(schemaFields))));
                    sourceArray_past.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", sourceName),
                                                    new KeyValuePair<string, JsonValue>("value", sourceName),
                                                    new KeyValuePair<string, JsonValue>("fields", new JsonArray(schemaFields, categoryFields))));
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
            var past_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                        new KeyValuePair<string, JsonValue>("type", "Select"),
                                                        new KeyValuePair<string, JsonValue>("group", 1),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                        new KeyValuePair<string, JsonValue>("options", sourceArray_past)));

            var video_sourceFields = new JsonArray(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SOURCE"),
                                                        new KeyValuePair<string, JsonValue>("value", "view_source"),
                                                        new KeyValuePair<string, JsonValue>("type", "Text"),
                                                        new KeyValuePair<string, JsonValue>("group", 1),
                                                        new KeyValuePair<string, JsonValue>("required", true),
                                                        new KeyValuePair<string, JsonValue>("dynamic", true),
                                                        new KeyValuePair<string, JsonValue>("temp", true),
                                                        new KeyValuePair<string, JsonValue>("datakey", "view_options")));

            past_sourceFields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SAMPLING"),
                                                    new KeyValuePair<string, JsonValue>("value", "view_sampling"),
                                                    new KeyValuePair<string, JsonValue>("type", "Select"),
                                                    new KeyValuePair<string, JsonValue>("group", 4),
                                                    new KeyValuePair<string, JsonValue>("required", true),
                                                    new KeyValuePair<string, JsonValue>("dynamic", true),
                                                    new KeyValuePair<string, JsonValue>("temp", true),
                                                    new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                    new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                                            new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "MAX"),
                                                                new KeyValuePair<string, JsonValue>("value", "max")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "MIN"),
                                                                new KeyValuePair<string, JsonValue>("value", "min")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "AVG"),
                                                                new KeyValuePair<string, JsonValue>("value", "avg")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "SUM"),
                                                                new KeyValuePair<string, JsonValue>("value", "sum")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "COUNT"),
                                                                new KeyValuePair<string, JsonValue>("value", "count")
                                                            )))));

            past_sourceFields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", "SAMPLING PERIOD"),
                                                    new KeyValuePair<string, JsonValue>("value", "view_sampling_period"),
                                                    new KeyValuePair<string, JsonValue>("type", "Select"),
                                                    new KeyValuePair<string, JsonValue>("group", 4),
                                                    new KeyValuePair<string, JsonValue>("required", true),
                                                    new KeyValuePair<string, JsonValue>("dynamic", true),
                                                    new KeyValuePair<string, JsonValue>("temp", true),
                                                    new KeyValuePair<string, JsonValue>("datakey", "view_options"),
                                                    new KeyValuePair<string, JsonValue>("options", new JsonArray(
                                                            new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "ALL"),
                                                                new KeyValuePair<string, JsonValue>("value", "all")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "DAY"),
                                                                new KeyValuePair<string, JsonValue>("value", "day")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "WEEK"),
                                                                new KeyValuePair<string, JsonValue>("value", "week")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "MONTH"),
                                                                new KeyValuePair<string, JsonValue>("value", "month")
                                                            ), new JsonObject(
                                                                new KeyValuePair<string, JsonValue>("text", "YEAR"),
                                                                new KeyValuePair<string, JsonValue>("value", "year")
                                                            )))));

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
                                                new KeyValuePair<string, JsonValue>("text", "과거"),
                                                new KeyValuePair<string, JsonValue>("value", "past"),
                                                new KeyValuePair<string, JsonValue>("fields", past_sourceFields)
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

        public string GetList(JsonValue jsonObj)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "column_json(view_options) as view_options", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonObj);
            var res = MariaDBConnector.Instance.GetJsonArray(query);

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

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

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

            var res = MariaDBConnector.Instance.SetQuery(upsertQuery);

            return res.ToString();
        }

        public string Delete(JsonValue jsonObj)
        {
            var deleteQuery = MariaQueryBuilder.DeleteQuery(TableName, jsonObj);

            var res = MariaDBConnector.Instance.SetQuery(deleteQuery);

            return res.ToString();
        }

        public string Execute(JsonValue jsonValue)
        {
            var selectedItems = new List<string>() { "name", "view_type", "view_query", "DATE_FORMAT(unixtime, '%Y-%m-%d %H:%i:%s') as `unixtime`" };
            var query = MariaQueryBuilder.SelectQuery(TableName, selectedItems, jsonValue);
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(viewInfo["view_query"].ReadAs<string>());
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
                ret = this.VAPatternAnalysis(source, category, sampling, sampling_period);
            }
            else
            {
                var fieldQuery = new StringBuilder("SELECT column_json(rawdata) as `types` FROM fields_").Append(source).Append(" WHERE category = '").Append(category).Append("'");
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
                var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(query);
                ret = res.ToString();
            }
            sw.Stop();
            Console.WriteLine("response speed : {0} ms", sw.ElapsedMilliseconds);
            return ret;
        }

        public string VAPatternAnalysis(string source, string category, string sampling, string sampling_period)
        {
            var resultArr = new JsonArray();
            var field = "종가";
            var current = DateTime.Now;
            var prev = sampling_period == "day" ? current.AddYears(-1) : sampling_period == "week" ? current.AddMonths(-18) :
                       sampling_period == "month" ? current.AddYears(-2) : current.AddYears(-5);
            List<int> duplChk = new List<int>();

            var volume_query_builder = new StringBuilder(MariaQueryDefine.GetVolumeOscillator);

            if (sampling_period == "all") volume_query_builder.Replace("{short_day}", "5").Replace("{long_day}", "20");
            else if (sampling_period == "day") volume_query_builder.Replace("{short_day}", "5").Replace("{long_day}", "20");
            else if (sampling_period == "week") volume_query_builder.Replace("{short_day}", "25").Replace("{long_day}", "100");
            else if (sampling_period == "month") volume_query_builder.Replace("{short_day}", "100").Replace("{long_day}", "400");
            else if (sampling_period == "year") volume_query_builder.Replace("{short_day}", "1000").Replace("{long_day}", "4000");

            var volume_query = volume_query_builder.ToString().Replace("{category}", category);
            var volume_signal_arr = MariaDBConnector.Instance.GetJsonArray(volume_query);

            for (var day = prev.Date; day.Date <= current.Date; day = day.AddDays(1))
            {
                var unixtime = day.ToString("yyyy-MM-dd 23:59:59");
                var queryBuilder = new StringBuilder();
                var sampling_items = new StringBuilder();
                queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(DATE(unixtime)) as unixtime FROM (SELECT ");

                var item_key = field;
                queryBuilder.Append("COLUMN_GET(`rawdata`,'").Append(item_key).Append("' as double) as `").Append(item_key).Append("`,");
                sampling_items.Append(sampling).Append("(`").Append(item_key).Append("`) as `").Append(item_key).Append("`,");
                queryBuilder.Append("unixtime ").Append("FROM ").Append("past_" + source).Append(" WHERE category = '")
                    .Append(category).Append("' AND column_get(rawdata,'").Append(item_key).Append("' as char) IS NOT NULL AND unixtime <= '").Append(unixtime).Append("') as result");

                if (sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
                else if (sampling_period == "day" || day == current.Date) queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
                else if (sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
                else if (sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
                else if (sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

                var query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
                var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(query);

                var data = res["data"].ReadAs<JsonArray>();
                var refFields = res["fields"].ReadAs<JsonArray>();
                var fieldCnt = refFields.ReadAs<JsonArray>().Count;

                for (int i = 0; i < fieldCnt; i++)
                {
                    var key = refFields[i]["value"].ReadAs<string>();
                    if (key == "unixtime") continue;
                    try
                    {
                        var max = data.Aggregate<JsonValue>((arg1, arg2) =>
                        {
                            return arg1[key].ReadAs<double>() > arg2[key].ReadAs<double>() ? arg1 : arg2;
                        });
                        var min = data.Aggregate<JsonValue>((arg1, arg2) =>
                        {
                            return arg1[key].ReadAs<double>() < arg2[key].ReadAs<double>() ? arg1 : arg2;
                        });
                        Segmentation(ref refFields, ref data, data, key, max[key].ReadAs<double>(), min[key].ReadAs<double>());
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }

                var prevCount = 0;
                var currentCount = 0;
                var lastState = string.Empty;
                var result = new JsonObject();
                var supportArr = new JsonArray();
                var resistanceArr = new JsonArray();
                foreach (var item in data[data.Count - 1])
                {
                    if (item.Key == "unixtime") { result.Add("unixtime", item.Value.ReadAs<int>()); continue; }
                    if (item.Key == field) { result.Add(field, item.Value.ReadAs<int>()); continue; }
                    if (item.Key.Contains("support"))
                    {
                        if (lastState == "하락")
                        {
                            prevCount = currentCount;
                            currentCount = 0;
                        }
                        lastState = "상승";
                        supportArr.Add(item.Value.ReadAs<int>());
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
                        resistanceArr.Add(item.Value.ReadAs<int>());
                        currentCount++;
                    }
                }
                var time = result["unixtime"].ReadAs<int>();
                var real_support = supportArr.Where<JsonValue>(p => p.ReadAs<int>() <= result[field].ReadAs<int>());
                var reverse_support = supportArr.Where<JsonValue>(p => p.ReadAs<int>() >= result[field].ReadAs<int>());
                var real_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<int>() >= result[field].ReadAs<int>());
                var reverse_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<int>() <= result[field].ReadAs<int>());
                result.Add("현재상태", lastState);
                result.Add("현재상태_유지횟수", currentCount);
                result.Add("과거상태_유지횟수", prevCount);
                result.Add("실제지지_갯수", real_support.Count());
                result.Add("실제저항_갯수", real_resistance.Count());
                result.Add("반전지지_갯수", reverse_resistance.Count());
                result.Add("반전저항_갯수", reverse_support.Count());
                if (reverse_resistance.Count() > 0) result.Add("반전지지", reverse_resistance.OrderByDescending(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (real_support.Count() > 0) result.Add("실제지지", real_support.OrderByDescending(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (reverse_support.Count() > 0) result.Add("반전저항", reverse_support.OrderBy(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (real_resistance.Count() > 0) result.Add("실제저항", real_resistance.OrderBy(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (result["반전지지_갯수"].ReadAs<int>() + result["실제저항_갯수"].ReadAs<int>() > 0)
                {
                    result.Add("V패턴_비율", (result["반전지지_갯수"].ReadAs<double>() / (result["반전지지_갯수"].ReadAs<double>() + result["실제저항_갯수"].ReadAs<double>())) * 100);
                }
                else
                {
                    result.Add("V패턴_비율", 150);
                }
                if (result["반전저항_갯수"].ReadAs<int>() + result["실제지지_갯수"].ReadAs<int>() > 0)
                {
                    result.Add("A패턴_비율", (result["반전저항_갯수"].ReadAs<double>() / (result["반전저항_갯수"].ReadAs<double>() + result["실제지지_갯수"].ReadAs<double>())) * 100);
                }
                else
                {
                    result.Add("A패턴_비율", 150);
                }
                var pattern = new JsonObject();
                if (duplChk.Contains(time))
                {
                    if (result.ContainsKey("V패턴_비율")) resultArr.First<JsonValue>(p => p["unixtime"].ReadAs<int>() == time)["V패턴_비율"] = result["V패턴_비율"].ReadAs<int>();
                    if (result.ContainsKey("A패턴_비율")) resultArr.First<JsonValue>(p => p["unixtime"].ReadAs<int>() == time)["A패턴_비율"] = result["A패턴_비율"].ReadAs<int>();
                    var va_signal = result["V패턴_비율"].ReadAs<int>() - result["A패턴_비율"].ReadAs<int>();
                    resultArr.First<JsonValue>(p => p["unixtime"].ReadAs<int>() == time)["VA_SIGNAL"] = va_signal;
                }
                else
                {
                    if (result.ContainsKey("V패턴_비율")) pattern.Add("V패턴_비율", result["V패턴_비율"].ReadAs<int>());
                    if (result.ContainsKey("A패턴_비율")) pattern.Add("A패턴_비율", result["A패턴_비율"].ReadAs<int>());
                    var va_signal = result["V패턴_비율"].ReadAs<int>() - result["A패턴_비율"].ReadAs<int>();

                    var volume_signal = volume_signal_arr.FirstOrDefault<JsonValue>(p => p["unixtime"].ReadAs<int>() == time);
                    //pattern.Add("VA_SIGNAL", va_signal);
                    pattern.Add("VOLUME_SIGNAL", volume_signal == null ? 0 : volume_signal["VOLUME_SIGNAL"].ReadAs<double>());
                    pattern.Add("unixtime", time);

                    resultArr.Add(pattern);
                    duplChk.Add(time);
                }
            }
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
                                            //new JsonObject(new KeyValuePair<string, JsonValue>("text", "VA_SIGNAL"),
                                            //               new KeyValuePair<string, JsonValue>("value", "VA_SIGNAL"),
                                            //               new KeyValuePair<string, JsonValue>("type", "Number"),
                                            //               new KeyValuePair<string, JsonValue>("group", 0),
                                            //               new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "VOLUME_SIGNAL"),
                                                           new KeyValuePair<string, JsonValue>("value", "VOLUME_SIGNAL"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false)),
                                            new JsonObject(new KeyValuePair<string, JsonValue>("text", "unixtime"),
                                                           new KeyValuePair<string, JsonValue>("value", "unixtime"),
                                                           new KeyValuePair<string, JsonValue>("type", "Number"),
                                                           new KeyValuePair<string, JsonValue>("group", 0),
                                                           new KeyValuePair<string, JsonValue>("required", false))));

            return ret.ToString();
        }

        public string AutoAnalysis(string period, string state, List<string> stock)
        {
            var resultArr = new JsonArray();
            var source = "stock";
            var field = "종가";
            var sampling = "min";
            var sampling_period = period == "day" || period == "week" || period == "month" || period == "year" ? period : "week";

            var progress = 1;
            var categories_query = "SELECT category, column_get(rawdata, '종목명' as char) as `종목명` FROM current_" + source;
            if (stock.Count > 0)
            {
                var last = 1;
                categories_query = categories_query + " WHERE ";
                foreach (var stock_name in stock)
                {
                    var separator = stock.Count > last ? " OR " : ";";
                    categories_query = categories_query + " column_get(rawdata, '종목명' as char) like '%" + stock_name.Trim() + "%'" + separator;
                    last++;
                }
            }
            var categories = MariaDBConnector.Instance.GetJsonArray(categories_query);
            var total = categories.Count;
            foreach (var row in categories)
            {
                var name = row["종목명"].ReadAs<string>();
                var category = row["category"].ReadAs<string>();
                var queryBuilder = new StringBuilder();
                var sampling_items = new StringBuilder();
                queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(DATE(unixtime)) as unixtime FROM (SELECT ");

                var volume_query_builder = new StringBuilder(MariaQueryDefine.GetVolumeOscillator);//.Append(" WHERE 날짜 <= '2016-04-23'");

                if (sampling_period == "all") volume_query_builder.Append(" GROUP BY 날짜 DESC LIMIT 2").Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "day") volume_query_builder.Append(" GROUP BY DATE(날짜) DESC LIMIT 2").Replace("{short_day}", "5").Replace("{long_day}", "20");
                else if (sampling_period == "week") volume_query_builder.Append(" GROUP BY TO_DAYS(날짜) - WEEKDAY(날짜) DESC LIMIT 2")
                                                                        .Replace("{short_day}", "25").Replace("{long_day}", "100");
                else if (sampling_period == "month") volume_query_builder.Append(" GROUP BY DATE_FORMAT(날짜, '%Y-%m') DESC LIMIT 2")
                                                                         .Replace("{short_day}", "100").Replace("{long_day}", "400");
                else if (sampling_period == "year") volume_query_builder.Append(" GROUP BY DATE_FORMAT(날짜, '%Y') DESC LIMIT 2")
                                                                        .Replace("{short_day}", "1000").Replace("{long_day}", "4000");

                var volume_query = volume_query_builder.ToString().Replace("{category}", category);
                var volume_signal = MariaDBConnector.Instance.GetJsonArray(volume_query);
                var item_key = field;
                queryBuilder.Append("COLUMN_GET(`rawdata`,'").Append(item_key).Append("' as double) as `").Append(item_key).Append("`,");
                sampling_items.Append(sampling).Append("(`").Append(item_key).Append("`) as `").Append(item_key).Append("`,");
                queryBuilder.Append("unixtime ").Append("FROM ").Append("past_" + source).Append(" WHERE category = '")
                    .Append(category).Append("' AND column_get(rawdata,'").Append(item_key).Append("' as char) IS NOT NULL")
                    //.Append(" AND unixtime <= '2016-10-21'")
                    .Append(") as result");

                if (sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
                else if (sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
                else if (sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
                else if (sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
                else if (sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

                var query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
                var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(query);

                var data = res["data"].ReadAs<JsonArray>();
                if (data.Count == 0) continue;
                var refFields = res["fields"].ReadAs<JsonArray>();
                var fieldCnt = refFields.ReadAs<JsonArray>().Count;

                for (int i = 0; i < fieldCnt; i++)
                {
                    var key = refFields[i]["value"].ReadAs<string>();
                    if (key == "unixtime") continue;
                    try
                    {
                        var max = data.Aggregate<JsonValue>((arg1, arg2) =>
                        {
                            return arg1[key].ReadAs<double>() > arg2[key].ReadAs<double>() ? arg1 : arg2;
                        });
                        var min = data.Aggregate<JsonValue>((arg1, arg2) =>
                        {
                            return arg1[key].ReadAs<double>() < arg2[key].ReadAs<double>() ? arg1 : arg2;
                        });
                        Segmentation(ref refFields, ref data, data, key, max[key].ReadAs<double>(), min[key].ReadAs<double>());
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }

                var prevCount = 0;
                var currentCount = 0;
                var lastState = string.Empty;
                var result = new JsonObject();
                var supportArr = new JsonArray();
                var resistanceArr = new JsonArray();
                foreach (var item in data[data.Count - 1])
                {
                    if (item.Key == "unixtime") continue;
                    if (item.Key == field) { result.Add(field, item.Value.ReadAs<int>()); continue; }
                    if (item.Key.Contains("support"))
                    {
                        if (lastState == "하락")
                        {
                            prevCount = currentCount;
                            currentCount = 0;
                        }
                        lastState = "상승";
                        supportArr.Add(item.Value.ReadAs<int>());
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
                        resistanceArr.Add(item.Value.ReadAs<int>());
                        currentCount++;
                    }
                }
                var total_support = new JsonArray();
                var total_resistance = new JsonArray();
                var real_support = supportArr.Where<JsonValue>(p => p.ReadAs<int>() <= result[field].ReadAs<int>());
                var reverse_support = supportArr.Where<JsonValue>(p => p.ReadAs<int>() >= result[field].ReadAs<int>());
                var real_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<int>() >= result[field].ReadAs<int>());
                var reverse_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<int>() <= result[field].ReadAs<int>());
                total_support.AddRange(real_support);
                total_support.AddRange(reverse_resistance);
                total_resistance.AddRange(real_resistance);
                total_resistance.AddRange(reverse_support);
                result.Add("종목명", name);
                result.Add("현재상태", lastState);
                result.Add("현재상태_유지횟수", currentCount);
                result.Add("과거상태_유지횟수", prevCount);
                result.Add("실제지지_갯수", real_support.Count());
                result.Add("실제저항_갯수", real_resistance.Count());
                result.Add("반전지지_갯수", reverse_resistance.Count());
                result.Add("반전저항_갯수", reverse_support.Count());

                if (reverse_resistance.Count() > 0) result.Add("반전지지", reverse_resistance.OrderByDescending(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (real_support.Count() > 0) result.Add("실제지지", real_support.OrderByDescending(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (reverse_support.Count() > 0) result.Add("반전저항", reverse_support.OrderBy(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (real_resistance.Count() > 0) result.Add("실제저항", real_resistance.OrderBy(p => p.ReadAs<int>()).ToJsonArray().ToString());
                if (result["반전지지_갯수"].ReadAs<int>() + result["실제저항_갯수"].ReadAs<int>() > 0)
                {
                    result.Add("V패턴_비율", (result["반전지지_갯수"].ReadAs<double>() / (result["반전지지_갯수"].ReadAs<double>() + result["실제저항_갯수"].ReadAs<double>())) * 100);
                }
                else
                {
                    result.Add("V패턴_비율", 150);
                }
                if (result["반전저항_갯수"].ReadAs<int>() + result["실제지지_갯수"].ReadAs<int>() > 0)
                {
                    result.Add("A패턴_비율", (result["반전저항_갯수"].ReadAs<double>() / (result["반전저항_갯수"].ReadAs<double>() + result["실제지지_갯수"].ReadAs<double>())) * 100);
                }
                else
                {
                    result.Add("A패턴_비율", 150);
                }

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
                if (volume_signal != null && volume_signal.Count > 1)
                {
                    try
                    {
                        result.Add("VOLUME_OSCILLATOR", volume_signal[0]["VOLUME_SIGNAL"].ReadAs<double>());
                        result.Add("VOLUME_SIGNAL", volume_signal[0]["VOLUME_SIGNAL"].ReadAs<double>() - volume_signal[1]["VOLUME_SIGNAL"].ReadAs<double>());
                    }
                    catch (Exception ex)
                    {

                    }
                }
                result.Add("전일비율", volume_signal[0].ContainsKey("전일비율") && volume_signal[0]["전일비율"] != null ? volume_signal[0]["전일비율"].ReadAs<double>() : 0);
                resultArr.Add(result);
                EnvironmentHelper.ProgressBar(progress, total);
                progress++;
            }
            if (state == "모두")
            {
                return resultArr.ToString();
            }
            else
            {
                return stock.Count > 0 ? resultArr.ToString() : resultArr.Where<JsonValue>(arg => state == "하락" ?
                             arg["전체상태"].ReadAs<string>() == "하락" && arg["현재상태"].ReadAs<string>() == "하락" &&
                             arg.ContainsKey("VOLUME_OSCILLATOR") && arg["VOLUME_OSCILLATOR"].ReadAs<double>() < 0 &&
                             arg.ContainsKey("VOLUME_SIGNAL") && arg["VOLUME_SIGNAL"].ReadAs<double>() < 0 : state == "반등" ?
                             arg["전체상태"].ReadAs<string>() == "하락" && arg["현재상태"].ReadAs<string>() == "상승" &&
                             arg.ContainsKey("VOLUME_OSCILLATOR") && arg["VOLUME_OSCILLATOR"].ReadAs<double>() > 0 &&
                             arg.ContainsKey("VOLUME_SIGNAL") && arg["VOLUME_SIGNAL"].ReadAs<double>() > 0 : state == "조정" ?
                             arg["전체상태"].ReadAs<string>() == "상승" && arg["현재상태"].ReadAs<string>() == "하락" &&
                             arg.ContainsKey("VOLUME_OSCILLATOR") && arg["VOLUME_OSCILLATOR"].ReadAs<double>() < 0 &&
                             arg.ContainsKey("VOLUME_SIGNAL") && arg["VOLUME_SIGNAL"].ReadAs<double>() < 0 : state == "상승" ?
                             arg["전체상태"].ReadAs<string>() == "상승" && arg["현재상태"].ReadAs<string>() == "상승" &&
                             arg.ContainsKey("VOLUME_OSCILLATOR") && arg["VOLUME_OSCILLATOR"].ReadAs<double>() > 0 &&
                             arg.ContainsKey("VOLUME_SIGNAL") && arg["VOLUME_SIGNAL"].ReadAs<double>() > 0 :
                             arg["전체상태"].ReadAs<string>() == "횡보" && arg.ContainsKey("강도"))
                             .OrderBy(p => p["강도"].ReadAs<double>()).ToJsonArray().ToString();
            }
        }

        public string SaveFilter(string type, JsonArray jsonValue)
        {
            var set_query = string.Empty;
            var setSource = new SetDataSourceReq()
            {
                rawdata = new List<JsonDictionary>(),
                category = "종목명",
                source = "selected_stock_"+type,
                collected_at = ""
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
            var viewInfo = MariaDBConnector.Instance.GetJsonObject(query);
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
                                if (unixtime <= dynamicUnixtime)
                                {
                                    var diff = inc["diff"].ReadAs<double>();
                                    var nextValue = inc[key].ReadAs<double>() + (diff * next);
                                    if (!(nextValue <= maximum))
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                        complete = true;
                                    }
                                    else if (unixtime == result[i]["unixtime"].ReadAs<int>())
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    }
                                    else if (i == lastIndex - 1)
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                        complete = true;
                                    }
                                    next++;
                                }
                                if (i == result.IndexOf(min))
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, min[key].ReadAs<double>());
                                }
                            }
                            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", id),
                                                    new KeyValuePair<string, JsonValue>("value", id),
                                                    new KeyValuePair<string, JsonValue>("type", "Number")));
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
                                if (unixtime <= dynamicUnixtime)
                                {
                                    var diff = dec["diff"].ReadAs<double>();
                                    var nextValue = dec[key].ReadAs<double>() + (diff * next);
                                    if (!(nextValue >= minimum))
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                        complete = true;
                                    }
                                    else if (unixtime == result[i]["unixtime"].ReadAs<int>())
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                    }
                                    else if (i == lastIndex - 1)
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
                                        complete = true;
                                    }
                                    next++;
                                }
                                if (i == result.IndexOf(max))
                                {
                                    result[i].ReadAs<JsonObject>().Add(id, max[key].ReadAs<double>());
                                }
                            }
                            fields.Add(new JsonObject(new KeyValuePair<string, JsonValue>("text", id),
                                                    new KeyValuePair<string, JsonValue>("value", id),
                                                    new KeyValuePair<string, JsonValue>("type", "Number")));
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
    }
}
