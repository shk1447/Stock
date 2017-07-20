using System;
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
        private JsonValue stock_list = JsonValue.Parse(File.ReadAllText(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json")));

        private BotLogic()
        {
            // 질문에 대한 키워드 : 빅앤츠, 종료, 분석, 추천
            // 빅앤츠 : 세션을 시작할지에 대한 true / false
            // 종료 : 세션을 종료할지에 대한 true / false
            // 분석 : 분석할 종목명 string
            // 추천 : 추천방식 설정 (일, 주, 월)
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

            var parameters = new List<string>();
            var keyword = new List<string>();

            foreach (var word in words)
            {
                if (word.Contains("분석"))
                {
                    keyword.Add("분석");
                }
                else if (word.Contains("추천"))
                {
                    keyword.Add("추천");
                }
                else if (word.Contains("관심"))
                {
                    keyword.Add("관심");
                }
                else if (word.Contains("감시"))
                {
                    keyword.Add("감시");
                }
                else
                {
                    parameters.Add(word);
                }
            }
            var respond_cnt = 0;
            foreach (var key in keyword)
            {
                foreach (var param in parameters)
                {
                    var message = new JsonObject();
                    if (key == "분석")
                    {
                        var search_result = stock_list.FirstOrDefault(p => p.Value["name"].ReadAs<string>().Contains(param));
                        if (search_result.Key != null)
                        {
                            var view_instance = new ViewLogic();
                            var result = JsonObject.Parse(view_instance.AutoAnalysis("day", new List<string>() { search_result.Value["code"].ReadAs<string>() }, null, null, false));
                            Console.WriteLine(result.ToString());
                            message.Add("text", "*" + param + " 분석결과*");
                            message.Add("attachments", new JsonArray(new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("color", "#ff0000"),
                                                              new KeyValuePair<string, JsonValue>("title", "거래량 분석"),
                                                              new KeyValuePair<string, JsonValue>("text", "`블라블라블라`")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("color", "#00ff00"),
                                                              new KeyValuePair<string, JsonValue>("title", "주가 분석"),
                                                              new KeyValuePair<string, JsonValue>("text", "`블라블라블라`")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("color", "#0000ff"),
                                                              new KeyValuePair<string, JsonValue>("title", "추세 분석"),
                                                              new KeyValuePair<string, JsonValue>("text", "`블라블라블라`")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("color", "#ffffff"),
                                                              new KeyValuePair<string, JsonValue>("title", "저항과 지지 분석"),
                                                              new KeyValuePair<string, JsonValue>("text", "`블라블라블라`")
                                                          ), new JsonObject(
                                                              new KeyValuePair<string, JsonValue>("color", "#ffffff"),
                                                              new KeyValuePair<string, JsonValue>("title", "추세 분석"),
                                                              new KeyValuePair<string, JsonValue>("text", "`블라블라블라`")
                                                          )));
                            this.SendMessage(message.ToString());
                            respond_cnt++;
                        }
                    }
                    else if (key == "추천")
                    {

                    }
                    else if (key == "관심")
                    {

                    }
                    else if (key == "감시")
                    {

                    }
                }
            }
            if (respond_cnt == 0)
            {
                this.SendMessage("제가 이해할 수 있게 명령해주세요.");
                this.SendMessage(">>>1. 빅앤츠 (주식명) 분석해\n2. 빅앤츠 (일봉,주봉) 추천해봐");
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
