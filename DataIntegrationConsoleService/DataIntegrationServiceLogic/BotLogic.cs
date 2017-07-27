﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using Common;
using System.Json;
using System.IO;
using Connector;

namespace DataIntegrationServiceLogic
{
    public class BotLogic
    {
        public event EventHandler<JsonObject> bot_event;

        private JsonValue stock_list = JsonValue.Parse(File.ReadAllText(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json")));

        private BotLogic()
        {
            // 질문에 대한 키워드 : 빅앤츠, 종료, 분석, 추천
            // 빅앤츠 : 세션을 시작할지에 대한 true / false
            // 종료 : 세션을 종료할지에 대한 true / false
            // 분석 : 분석할 종목명 string
            // 추천 : 추천방식 설정 (일, 주, 월)
            bot_event += BotLogic_bot_event;
        }

        void BotLogic_bot_event(object sender, JsonObject e)
        {
            Console.WriteLine(e.ToString());
            //throw new NotImplementedException();
        }

        public static BotLogic Instance
        {
            get
            {
                return Nested<BotLogic>.Instance;
            }
        }

        public void Receive(Dictionary<string, string> paylaod)
        {
            var text = paylaod["text"];
            var user_id = paylaod["user_id"];
            var user_name = paylaod["user_name"];

            var words = text.Split(" ").ToList<string>();

            var date_param = DateTime.Now;
            var parameters = new List<string>();
            var keyword = new List<string>();

            foreach (var word in words)
            {
                if (word.Contains("빅앤츠")) continue;

                if (word.Contains("분석"))
                {
                    keyword.Add("분석");
                }
                else if (word.Contains("추천"))
                {
                    keyword.Add("추천");
                }
                else if (word.Contains("등록"))
                {
                    keyword.Add("등록");
                }
                else if (word.Contains("감시"))
                {
                    keyword.Add("감시");
                }
                else
                {
                    try
                    {
                        var test = DateTime.Parse(word);
                        date_param = test;
                    }
                    catch
                    {
                        parameters.Add(word);
                    }
                }
            }
            var respond_cnt = 0;
            foreach (var key in keyword)
            {
                var message = new JsonObject();
                if (key == "추천")
                {
                    var recommaned_report = new StringBuilder();
                    var query = string.Empty;

                    message.Add("text", "*" + date_param.ToString("yyyy-MM-dd") + " 하락 중 추천 종목*");
                    query = "SELECT CONCAT(최근갯수, ' 단계 상승 종목') as `title`, GROUP_CONCAT(종목명) as `text` FROM (" +
                                "SELECT category, column_get(rawdata, '종목명' as char) as `종목명`, column_get(rawdata, '시가' as char) as `시가`," +
                                "column_get(rawdata, '전체상태' as char) as `전체상태`," +
                                "column_get(rawdata, '현재상태' as char) as `현재상태`," +
                                "column_get(rawdata, 'V패턴_비율' as double) as `V패턴`," +
                                "column_get(rawdata, 'A패턴_비율' as double) as `A패턴`," +
                                "column_get(rawdata, '최근갯수' as double) as `최근갯수`," +
                                "column_get(rawdata, '과거갯수' as double) as `과거갯수`" +
                                " FROM past_stock" +
                                " WHERE unixtime >= '" + date_param.ToString("yyyy-MM-dd") + "' AND unixtime <= '" + date_param.AddDays(1).ToString("yyyy-MM-dd") + "'" +
                                ") as result" +
                                " WHERE (전체상태 = '횡보' OR 전체상태 = '하락') AND 현재상태 = '상승' AND 최근갯수 > 2 AND 과거갯수 > 2" +
                                " GROUP BY 최근갯수 ASC";
                    var down_recommaned = MariaDBConnector.Instance.GetJsonArray("DynamicQueryExecuter", query);

                    message.Add("attachments", down_recommaned);
                    this.SendMessage(message.ToString());
                    respond_cnt++;
                }
                else if (key == "분석" || key == "등록")
                {
                    foreach (var param in parameters)
                    {
                        message = new JsonObject();
                        if (key == "분석")
                        {
                            var search_result = stock_list.FirstOrDefault(p => p.Value["name"].ReadAs<string>().Contains(param) || p.Value["code"].ReadAs<string>().Contains(param));
                            if (search_result.Key != null)
                            {
                                var period = "day";
                                if (parameters.Find(p => p.Contains("주간")) != null) period = "week";

                                var view_instance = new ViewLogic();
                                var resultArr = JsonObject.Parse(view_instance.AutoAnalysis(period, "avg",
                                                new List<string>() { search_result.Value["code"].ReadAs<string>() },
                                                null, date_param.AddDays(1).ToString("yyyy-MM-dd"), false));
                                if (resultArr.Count > 0)
                                {
                                    var result = resultArr[0];
                                    // 주가 분석 레포트
                                    var price = result["종가"].ReadAs<double>();
                                    var highest = result["최고가"].ReadAs<double>();
                                    var lowest = result["최저가"].ReadAs<double>();
                                    var life_price = result["생명선"].ReadAs<double>();
                                    var price_location = Math.Round(result["주가위치"].ReadAs<double>(), 2);
                                    var price_analysis_report = new StringBuilder();
                                    price_analysis_report.AppendFormat("```현재 가격은 {0}원이며, 생명 가격인 {1}원 {2}에 위치해 있습니다.\n",
                                                                        price.ToString(), life_price.ToString(), life_price <= price ? "위" : "아래");
                                    price_analysis_report.AppendFormat("최저가 {0}원, 최고가는 {1}원으로 {2}%로 {3} 위치에 도달해 있습니다.```",
                                    lowest.ToString(), highest.ToString(), price_location.ToString(), price_location < 30 ? "낮은" : (price_location < 70 ? "중간" : "높은"));

                                    // 거래량 분석 레포트
                                    var amount = result["상장주식수"].ReadAs<double>();
                                    var volume = result["거래량"].ReadAs<double>();
                                    var volume_oscillator = Math.Round(result["VOLUME_OSCILLATOR"].ReadAs<double>(), 2);
                                    var volume_analysis_report = new StringBuilder();
                                    volume_analysis_report.AppendFormat("```{0}천주 대비 현재 거래되는 주식수는 {1}천주로 {2}%의 거래가 이루어지고 있고,\n",
                                    Math.Round(amount / 1000, 2).ToString(), Math.Round(volume / 1000, 2).ToString(), Math.Round(volume / amount * 100, 2).ToString());
                                    volume_analysis_report.AppendFormat("5일 거래량 대비 20일 거래량 비교했을때, {0}%만큼 {1}하였습니다.```",
                                                                         volume_oscillator.ToString(), volume_oscillator > 0 ? "증가" : "감소");

                                    // 추세 분석 레포트
                                    var rsi = result["RSI"].ReadAs<double>();
                                    var rsi_state = Math.Round(rsi) <= 30 ? "과매도" : (Math.Round(rsi) >= 70 ? "과매수" : "저항/지지");
                                    var total_state = result["전체상태"].ReadAs<string>();
                                    var current_state = result["현재상태"].ReadAs<string>();
                                    var current_count = result["현재상태_유지횟수"].ReadAs<int>();
                                    var past_count = result["과거상태_유지횟수"].ReadAs<int>();
                                    var trend_analysis_report = new StringBuilder();
                                    trend_analysis_report.AppendFormat("```현재 {0} 중이며, 전체적으로는 {1}을 유지하고 있습니다.\n", current_state, total_state);
                                    trend_analysis_report.AppendFormat("{0} 단계만큼 {1}하였고, 과거에는 {2} 단계만큼 {3}하였습니다.\n",
                                        current_count.ToString(), current_state, past_count, current_state == "상승" ? "하락" : "상승");
                                    trend_analysis_report.AppendFormat("최근 14일 동안 RSI가 {0}인 것으로 보아, {1} 상태로 판단되어 집니다.```",
                                        Math.Round(rsi, 2).ToString(), rsi_state);

                                    // 저항과 지지
                                    var v_pattern = result["V패턴_비율"].ReadAs<double>();
                                    var a_pattern = result["A패턴_비율"].ReadAs<double>();
                                    var va_pretext = new StringBuilder();
                                    va_pretext.AppendFormat("`V패턴 : {0}%`      `A패턴 : {1}%`", Math.Round(v_pattern, 2), Math.Round(a_pattern, 2));
                                    var total_support = new List<int>();
                                    var total_resistance = new List<int>();
                                    if (result.ContainsKey("반전지지"))
                                    {
                                        foreach (var item in JsonArray.Parse(result["반전지지"].ReadAs<string>()))
                                        {
                                            var test = item.Value.ReadAs<int>();
                                            var length = item.Value.ReadAs<int>().ToString().Length - 3;
                                            if (length > 0)
                                            {
                                                var sampling = int.Parse(Math.Pow(10, length).ToString());
                                                test = test / sampling * sampling;
                                            }
                                            if (!total_support.Contains(test)) total_support.Add(test);
                                        }
                                    }
                                    if (result.ContainsKey("실제지지"))
                                    {
                                        foreach (var item in JsonArray.Parse(result["실제지지"].ReadAs<string>()))
                                        {
                                            var test = item.Value.ReadAs<int>();
                                            var length = item.Value.ReadAs<int>().ToString().Length - 3;
                                            if (length > 0)
                                            {
                                                var sampling = int.Parse(Math.Pow(10, length).ToString());
                                                test = test / sampling * sampling;
                                            }
                                            if (!total_support.Contains(test)) total_support.Add(test);
                                        }
                                    }
                                    if (result.ContainsKey("반전저항"))
                                    {
                                        foreach (var item in JsonArray.Parse(result["반전저항"].ReadAs<string>()))
                                        {
                                            var test = item.Value.ReadAs<int>();
                                            var length = item.Value.ReadAs<int>().ToString().Length - 3;
                                            if (length > 0)
                                            {
                                                var sampling = int.Parse(Math.Pow(10, length).ToString());
                                                test = test / sampling * sampling;
                                            }
                                            if (!total_resistance.Contains(test)) total_resistance.Add(test);
                                        }
                                    }
                                    if (result.ContainsKey("실제저항"))
                                    {
                                        foreach (var item in JsonArray.Parse(result["실제저항"].ReadAs<string>()))
                                        {
                                            var test = item.Value.ReadAs<int>();
                                            var length = item.Value.ReadAs<int>().ToString().Length - 3;
                                            if (length > 0)
                                            {
                                                var sampling = int.Parse(Math.Pow(10, length).ToString());
                                                test = test / sampling * sampling;
                                            }
                                            if (!total_resistance.Contains(test)) total_resistance.Add(test);
                                        }
                                    }
                                    var support_pretext = new StringBuilder("```지지 가격 :");
                                    foreach (var support in total_support.OrderByDescending(p => p))
                                    {
                                        support_pretext.Append(" ").Append(support.ToString()).Append("원");
                                    }
                                    support_pretext.Append("``` ");
                                    var resistance_pretext = new StringBuilder("```저항 가격 :");
                                    foreach (var support in total_resistance.OrderBy(p => p))
                                    {
                                        resistance_pretext.Append(" ").Append(support.ToString()).Append("원");
                                    }
                                    resistance_pretext.Append("``` ");

                                    var action_state = "매수";
                                    var total_analysis_report = new StringBuilder();
                                    if (total_state == "상승")
                                    {
                                        if (current_state == "상승")
                                        {
                                            total_analysis_report.Append("강한 상승 중입니다.");
                                            action_state = "매도";
                                        }
                                        else
                                        {
                                            total_analysis_report.Append("고점 확인 후 조정 구간입니다.");
                                            action_state = "매수";
                                        }
                                    }
                                    else if (total_state == "하락")
                                    {
                                        if (current_state == "상승")
                                        {
                                            total_analysis_report.Append("저점 확인 후 바닥 형성 구간입니다.");
                                            action_state = "매수";
                                        }
                                        else
                                        {
                                            total_analysis_report.Append("강한 하락 중입니다.");
                                            action_state = "관심";
                                        }
                                    }
                                    else if (total_state == "횡보")
                                    {
                                        if (current_state == "상승")
                                        {
                                            total_analysis_report.Append("상승 전환 구간입니다.");
                                            action_state = "매수";
                                        }
                                        else
                                        {
                                            total_analysis_report.Append("하락 전환 구간입니다.");
                                            action_state = "관심";
                                        }
                                    }
                                    total_analysis_report.AppendFormat("\n거래량 분석({0}%만큼 {1})에 따라 현재 상태에 대한 신뢰성이 결정되고,\n" +
                                                                "RSI({2})에 따라 매수타이밍을 포착하시기 바랍니다.\n" +
                                                                "추가적으로 추세분석에서 나온 상승/하락의 단계에 따라 저항/지지 가격을 결정하시면 됩니다.",
                                                                volume_oscillator.ToString(), volume_oscillator > 0 ? "증가" : "감소", rsi.ToString());

                                    message.Add("text", "*" + date_param.ToString("yyyy-MM-dd") + " " + param + " 분석결과*");
                                    message.Add("attachments", new JsonArray(
                                                                  new JsonObject(
                                        //new KeyValuePair<string, JsonValue>("color", "#00ff00"),
                                        //new KeyValuePair<string, JsonValue>("pretext", "pre_text"),
                                                                      new KeyValuePair<string, JsonValue>("title", "주가 분석"),
                                                                      new KeyValuePair<string, JsonValue>("text", price_analysis_report.ToString()),
                                        //new KeyValuePair<string, JsonValue>("fields", price_fields),
                                                                      new KeyValuePair<string, JsonValue>("mrkdwn_in", new JsonArray("text", "pretext", "fields"))
                                                                  ), new JsonObject(
                                        //new KeyValuePair<string, JsonValue>("color", "#ff0000"),
                                        //new KeyValuePair<string, JsonValue>("pretext", "pre_text"),
                                                                      new KeyValuePair<string, JsonValue>("title", "거래량 분석"),
                                                                      new KeyValuePair<string, JsonValue>("text", volume_analysis_report.ToString()),
                                                                      new KeyValuePair<string, JsonValue>("mrkdwn_in", new JsonArray("text", "pretext", "fields"))
                                                                  ), new JsonObject(
                                        //new KeyValuePair<string, JsonValue>("color", "#0000ff"),
                                                                      new KeyValuePair<string, JsonValue>("pretext", va_pretext.ToString()),
                                                                      new KeyValuePair<string, JsonValue>("title", "추세 분석"),
                                                                      new KeyValuePair<string, JsonValue>("text", trend_analysis_report.ToString()),
                                                                      new KeyValuePair<string, JsonValue>("mrkdwn_in", new JsonArray("text", "pretext", "fields"))
                                                                  ), new JsonObject(
                                        //new KeyValuePair<string, JsonValue>("color", "#ffffff"),
                                                                      new KeyValuePair<string, JsonValue>("pretext", support_pretext.ToString() + resistance_pretext.ToString()),
                                                                      new KeyValuePair<string, JsonValue>("title", "종합 소견"),
                                                                      new KeyValuePair<string, JsonValue>("text", "```" + total_analysis_report.ToString() + "```"),
                                                                      new KeyValuePair<string, JsonValue>("mrkdwn_in", new JsonArray("text", "pretext", "fields"))
                                                                  )));
                                }
                                this.SendMessage(message.ToString());
                                respond_cnt++;
                            }
                        }
                        else if (key.Contains("등록"))
                        {
                            var search_result = stock_list.FirstOrDefault(p => p.Value["name"].ReadAs<string>().Contains(param) || p.Value["code"].ReadAs<string>().Contains(param));

                            if (search_result.Key != null)
                            {
                                search_result.Value["state"] = true;
                                var resultPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory);
                                System.IO.File.WriteAllText(Path.Combine(resultPath, "stocklist.json"), stock_list.ToString());
                                message.Add("text", "*" + search_result.Value["name"].ReadAs<string>() + " 등록 완료*");
                                this.SendMessage(message.ToString());
                                respond_cnt++;
                            }
                        }
                    }
                }
            }
            if (respond_cnt == 0)
            {
                var message = new JsonObject();
                message.Add("text", "제가 이해할 수 있게 명령해주세요.");
                this.SendMessage(message.ToString());
                message["text"] = ">>>1. 빅앤츠 (주식명) 분석해\n2. 빅앤츠 (일봉,주봉) 추천해봐";
                this.SendMessage(message.ToString());
            }
        }

        private void SendMessage(string message)
        {
            var reqParam = new RequestParameter()
            {
                Url = ConfigurationManager.AppSettings["SlackUrl"],
                ContentType = "application/json",
                EncodingOption = "UTF8",
                Method = "POST",
                PostMessage = message
            };

            HttpsRequest.Instance.GetResponseByHttps(reqParam);
        }
    }
}
