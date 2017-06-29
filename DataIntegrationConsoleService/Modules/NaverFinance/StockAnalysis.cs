using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using Connector;
using Model.Common;
using Model.Request;

namespace Finance
{
    public class StockAnalysis
    {
        private StockAnalysis()
        {
        }

        public static StockAnalysis Instance
        {
            get
            {
                return Nested<StockAnalysis>.Instance;
            }
        }

        public enum TrendType
        {
            Upward,
            Downward
        }

        public void AutoAnalysis(string collectionName, string code, long siseUnix, ref SetDataSourceReq data_source)
        {
            var source = "stock";
            var field = "종가";
            var sampling = "min";
            var sampling_period = "day";

            var category = code;
            var queryBuilder = new StringBuilder();
            var sampling_items = new StringBuilder();
            queryBuilder.Append("SELECT {sampling_items} UNIX_TIMESTAMP(DATE(unixtime)) as unixtime FROM (SELECT ");

            var item_key = field;
            queryBuilder.Append("COLUMN_GET(`rawdata`,'").Append(item_key).Append("' as double) as `").Append(item_key).Append("`,");
            sampling_items.Append(sampling).Append("(`").Append(item_key).Append("`) as `").Append(item_key).Append("`,");
            queryBuilder.Append("unixtime ").Append("FROM ").Append("past_" + source).Append(" WHERE category = '")
                .Append(category).Append("' AND column_get(rawdata,'").Append(item_key).Append("' as char) IS NOT NULL");
            queryBuilder.Append(" AND unixtime <= FROM_UNIXTIME(").Append(siseUnix).Append(")) as result");
            

            if (sampling_period == "all") queryBuilder.Append(" GROUP BY unixtime ASC");
            else if (sampling_period == "day") queryBuilder.Append(" GROUP BY DATE(unixtime) ASC");
            else if (sampling_period == "week") queryBuilder.Append(" GROUP BY TO_DAYS(unixtime) - WEEKDAY(unixtime) ASC");
            else if (sampling_period == "month") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y-%m') ASC");
            else if (sampling_period == "year") queryBuilder.Append(" GROUP BY DATE_FORMAT(unixtime, '%Y') ASC");

            var query = queryBuilder.ToString().Replace("{sampling_items}", sampling_items.ToString());
            var res = MariaDBConnector.Instance.GetJsonArrayWithSchema("DynamicQueryExecuter", query);

            var rsi_query = MariaQueryDefine.GetRSI.Replace("{category}", category) + " WHERE unixtime <= FROM_UNIXTIME(" + siseUnix.ToString() +  ") ORDER BY unixtime DESC LIMIT 1";
            var rsi_signal = MariaDBConnector.Instance.GetJsonObject("DynamicQueryExecuter", rsi_query);

            var data = res["data"].ReadAs<JsonArray>();
            var refFields = res["fields"].ReadAs<JsonArray>();
            var fieldCnt = refFields.ReadAs<JsonArray>().Count;

            double 최고가 = 0;
            double 최저가 = 0;

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
                    최고가 = max[key].ReadAs<double>();
                    최저가 = min[key].ReadAs<double>();
                    Segmentation(ref refFields, ref data, data, key, max[key].ReadAs<double>(), min[key].ReadAs<double>());
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            if(data.Count > 0)
            {
                var datum = data[data.Count - 1];

                var prevCount = 0;
                var currentCount = 0;
                var lastState = "횡보";
                var supportArr = new JsonArray();
                var resistanceArr = new JsonArray();
                double price = 0.0;
                foreach (var item in datum)
                {
                    if (item.Key == "unixtime") {  continue; }
                    if (item.Key == field) { price = item.Value.ReadAs<double>(); continue; }

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

                var real_support = supportArr.Where<JsonValue>(p => p.ReadAs<double>() < price);
                var reverse_support = supportArr.Where<JsonValue>(p => p.ReadAs<double>() > price);
                var real_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<double>() > price);
                var reverse_resistance = resistanceArr.Where<JsonValue>(p => p.ReadAs<double>() < price);

                var total_support = new JsonArray();
                var total_resistance = new JsonArray();
                total_support.AddRange(real_support);
                total_support.AddRange(reverse_resistance);
                total_resistance.AddRange(real_resistance);
                total_resistance.AddRange(reverse_support);
                var v_pattern_real = double.Parse(real_support.Count().ToString()) /
                                    (double.Parse(reverse_support.Count().ToString()) + double.Parse(real_support.Count().ToString())) * 100;
                var v_pattern_reverse = double.Parse(reverse_resistance.Count().ToString()) /
                                        (double.Parse(real_resistance.Count().ToString()) + double.Parse(reverse_resistance.Count().ToString())) * 100;
                var v_pattern = ((double.IsNaN(v_pattern_real) || double.IsInfinity(v_pattern_real) ? 0 : v_pattern_real) +
                                (double.IsNaN(v_pattern_reverse) || double.IsInfinity(v_pattern_reverse) ? 0 : v_pattern_reverse));

                var a_pattern_real = double.Parse(real_resistance.Count().ToString()) /
                                    (double.Parse(reverse_support.Count().ToString()) + double.Parse(real_resistance.Count().ToString())) * 100;
                var a_pattern_reverse = double.Parse(reverse_support.Count().ToString()) /
                                        (double.Parse(real_support.Count().ToString()) + double.Parse(reverse_support.Count().ToString())) * 100;
                var a_pattern = ((double.IsNaN(a_pattern_real) || double.IsInfinity(a_pattern_real) ? 0 : a_pattern_real) +
                                (double.IsNaN(a_pattern_reverse) || double.IsInfinity(a_pattern_reverse) ? 0 : a_pattern_reverse));

                var totalState = string.Empty;
                if (v_pattern > a_pattern)
                {
                    // 상승을 하였으며, A패턴 비율에 따라 조정강도 파악 가능 (A패턴_비율로 오름차순정렬)
                    totalState = "상승";
                }
                else if (v_pattern < a_pattern)
                {
                    // 하락을 하였으며, V패턴 비율에 따라 반등강도 파악 가능 (V패턴_비율로 오름차순정렬)
                    totalState = "하락";
                }
                else
                {
                    if (total_support.Count > total_resistance.Count)
                    {
                        totalState = "상승";
                    }
                    else if (total_support.Count < total_resistance.Count)
                    {
                        totalState = "하락";
                    }
                    else
                    {
                        totalState = "횡보";
                    }
                }

                data_source.rawdata[0].Add("현재상태", lastState);
                data_source.rawdata[0].Add("전체상태", totalState);
                data_source.rawdata[0].Add("저항갯수", lastState == "하락" ? currentCount : prevCount);
                data_source.rawdata[0].Add("지지갯수", lastState == "상승" ? currentCount : prevCount);
                data_source.rawdata[0].Add("V패턴_비율", v_pattern);
                data_source.rawdata[0].Add("A패턴_비율", a_pattern);
                data_source.rawdata[0].Add("강도", v_pattern - a_pattern);
                data_source.rawdata[0].Add("RSI", rsi_signal == null || rsi_signal["RSI"] == null || !rsi_signal.ContainsKey("RSI") ? 0 : rsi_signal["RSI"].ReadAs<double>());
            }
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

        internal void AutoAnalysis(string p, ref List<JsonDictionary> list)
        {
            throw new NotImplementedException();
        }

        public void AutoAnalysis(string p, ref SetDataSourceReq result)
        {
            throw new NotImplementedException();
        }
    }
}
