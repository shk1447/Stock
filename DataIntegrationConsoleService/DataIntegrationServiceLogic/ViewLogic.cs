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

namespace DataIntegrationServiceLogic
{
    public class ViewLogic
    {
        private const string TableName = "data_view";

        public enum TrendType
        {
            Upward,
            Downward
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
            var source = jsonObj["source"].ReadAs<string>();
            var fields = jsonObj["fields"];
            var category = jsonObj["category"].ReadAs<string>();
            var sampling = jsonObj["sampling"].ReadAs<string>();
            var sampling_period = jsonObj["sampling_period"].ReadAs<string>();
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
            queryBuilder.Append("unixtime ").Append("FROM ").Append("past_" + source).Append(" WHERE category = '").Append(category).Append("') as result");

            if (sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
            else if (sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
            else if (sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
            else if (sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
            else if (sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

            var query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());

            Stopwatch sw = new Stopwatch();
            sw.Start();
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema(query);
            var data = res["data"].ReadAs<JsonArray>();
            var refFields = res["fields"].ReadAs<JsonArray>();
            var fieldCnt = refFields.ReadAs<JsonArray>().Count;
            for (int i = 0; i < fieldCnt; i++)
            {
                var key = refFields[i]["value"].ReadAs<string>();
                if (key == "unixtime") continue;
                Segmentation(ref refFields, ref data, data, key);
            }
            sw.Stop();
            Console.WriteLine("{0} data speed : {1} ms", res.Count, sw.ElapsedMilliseconds);
            return res.ToString();
        }

        private void Segmentation(ref JsonArray fields, ref JsonArray result, JsonArray data, string key, double? startUnixTime = null)
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
                return arg1[key].ReadAs<int>() > arg2[key].ReadAs<int>() ? arg1 : arg2;
            });
            var min = data.Aggregate<JsonValue>((arg1, arg2) =>
            {
                return arg1[key].ReadAs<int>() < arg2[key].ReadAs<int>() ? arg1 : arg2;
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
                            var id = key + "_support_" + unixtime;
                            var next = 0;
                            for (int i = result.IndexOf(min); i < lastIndex; i++)
                            {
                                if (unixtime <= result[i]["unixtime"].ReadAs<int>())
                                {
                                    var nextValue = inc[key].ReadAs<double>() + (inc["diff"].ReadAs<double>() * next);
                                    if (nextValue < max[key].ReadAs<double>())
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
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


                        this.Segmentation(ref fields, ref result, data, key, max["unixtime"].ReadAs<double>());
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
                            var id = key + "_resistance_" + unixtime;
                            for (int i = result.IndexOf(max); i < lastIndex; i++)
                            {
                                if (unixtime <= result[i]["unixtime"].ReadAs<int>())
                                {
                                    var nextValue = dec[key].ReadAs<double>() + (dec["diff"].ReadAs<double>() * next);
                                    if (nextValue > min[key].ReadAs<double>())
                                    {
                                        result[i].ReadAs<JsonObject>().Add(id, nextValue);
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

                        this.Segmentation(ref fields, ref result, data, key, min["unixtime"].ReadAs<double>());
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
            var standardDegree = Math.Atan2(Math.Abs(endY - startY), (Math.Abs(endX - startX)) / 3600) * 180d / Math.PI;

            var index = prevIndex;
            JsonObject minimum = null;
            double? prevDegree = null;
            foreach (var item in data)
            {
                var dynamicX = item["unixtime"].ReadAs<double>();
                var dynamicY = item[key].ReadAs<double>();
                var dynamicDegree = Math.Atan2(Math.Abs(dynamicY - startY), (Math.Abs(dynamicX - startX)) / 3600) * 180d / Math.PI;
                if (prevDegree != null)
                {
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
                    prevDegree = dynamicDegree;
                    minimum = new JsonObject(new KeyValuePair<string, JsonValue>(key, dynamicY),
                                                     new KeyValuePair<string, JsonValue>("unixtime", dynamicX),
                                                     new KeyValuePair<string, JsonValue>("degree", dynamicDegree),
                                                     new KeyValuePair<string, JsonValue>("index", index),
                                                     new KeyValuePair<string, JsonValue>("diff", (dynamicY - firstValue) / (index + 1)));
                }
                index++;
            }

            if (minimum == null) return;

            result.Add(minimum);
            index = minimum["index"].ReadAs<int>();
            this.TrendAnalysis(key, minimum, end, data.Where(p => p["unixtime"].ReadAs<int>() > minimum["unixtime"].ReadAs<int>()), ref result, index, firstValue);
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
    }
}
