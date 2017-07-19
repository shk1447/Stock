using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using kr.ac.kaist.swrc.jhannanum.comm;
using kr.ac.kaist.swrc.jhannanum.hannanum;
using System.Configuration;
using Common;
using System.Json;
using System.IO;
using Connector;

namespace DataIntegrationServiceLogic
{
    public class BotLogic
    {
        private Dictionary<string, Queue<string>> sessions = new Dictionary<string, Queue<string>>();
        private JsonValue stock_list = JsonValue.Parse(File.ReadAllText(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "stocklist.json")));
        private Workflow workflow = WorkflowFactory.getPredefinedWorkflow(WorkflowFactory.WORKFLOW_POS_SIMPLE_22);

        private BotLogic()
        {
            // 질문에 대한 키워드 : 빅앤츠, 종료, 분석, 추천
            // 빅앤츠 : 세션을 시작할지에 대한 true / false
            // 종료 : 세션을 종료할지에 대한 true / false
            // 분석 : 분석할 종목명 string
            // 추천 : 추천방식 설정 (일, 주, 월)
            this.workflow.activateWorkflow(false);
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
            if (!sessions.ContainsKey(user_id))
            {
                if (text.Contains("빅앤츠"))
                {
                    SendMessage("안녕하세요. 주식 투자 도우미 빅앤츠입니다. " + user_name + "님 저를 부르셨나요?");
                    var queue = new Queue<string>();
                    queue.Enqueue("빅앤츠");
                    this.sessions.Add(user_id, queue);
                }
            }
            else
            {
                var extracted_words = this.KeywordExtract(text);
                var talk_queue = this.sessions[user_id];
                if (talk_queue.Count > 0)
                {
                    // 질문 큐가 있으면, 응답 및 동작을 한다.
                    var response_setence = string.Empty;
                    var last_question = talk_queue.Dequeue();
                    switch (last_question)
                    {
                        case "빅앤츠":
                            {
                                // false : 세션 삭제
                                if (extracted_words.ContainsKey("응답"))
                                {
                                    if (extracted_words["응답"].Contains("false"))
                                    {
                                        response_setence = "다음에 또 이용해주세요.";
                                        this.sessions.Remove(user_id);
                                    }
                                    else
                                    {
                                        response_setence = "빅앤츠 서비스를 시작하겠습니다. 저는 주식종목 분석 및 추천에 대한 기능을 가지고 있습니다.";
                                    }
                                }
                                else
                                {
                                    response_setence = "예(응) / 아니오(아니)로 대답해주세요.";
                                    talk_queue.Enqueue(last_question);
                                }
                                break;
                            }
                        case "종료":
                            {
                                // true : 세션 삭제
                                if (extracted_words["응답"].Contains("true"))
                                {
                                    response_setence = "다음에 또 이용해주세요.";
                                    this.sessions.Remove(user_id);
                                }
                                else
                                {
                                    response_setence = "질문 부탁드립니다.";
                                }
                                break;
                            }
                        case "분석":
                            {
                                var param_keywords = extracted_words["키워드"].Where(p => !p.Contains("종료") && !p.Contains("분석") && !p.Contains("추천"));
                                foreach (var param in param_keywords)
                                {
                                    var search_result = stock_list.FirstOrDefault(p => p.Value["name"].ReadAs<string>() == param);
                                    if (search_result.Key != null)
                                    {
                                        var whereKV = new JsonObject(); whereKV.Add("category", search_result.Value["code"].ReadAs<string>());
                                        var selectedItems = new List<string>() { "category", "column_json(rawdata) as `data`" };
                                        var query = MariaQueryBuilder.SelectQuery("current_stock", selectedItems, whereKV);
                                        var res = MariaDBConnector.Instance.GetJsonObject(query);
                                        response_setence = res.ToString();
                                        break;
                                    }
                                    else
                                    {
                                        response_setence = "해당 정보가 없습니다.";
                                    }
                                }
                                break;
                            }
                        case "추천":
                            {
                                response_setence = "추천";
                                break;
                            }
                        default:
                            {
                                response_setence = "몰라요...기억하겠습니다.";
                                break;
                            }
                    }
                    this.SendMessage(response_setence);
                }
                else
                {
                    var requestion = string.Empty;
                    // 질문 큐가 없으면, 질문으로 인식하며 재질문을 한다.
                    if (extracted_words.ContainsKey("키워드"))
                    {
                        var function_keywords = extracted_words["키워드"].Where(p => p.Contains("종료") || p.Contains("분석") || p.Contains("추천"));
                        var param_keywords = extracted_words["키워드"].Where(p => !p.Contains("종료") && !p.Contains("분석") && !p.Contains("추천"));
                        if (function_keywords.Count() > 1)
                        {
                            requestion = user_name + "님, 무엇을 도와드릴까요? (" + string.Join(" / ", function_keywords) + ")";
                        }
                        else if (function_keywords.Count() == 1)
                        {
                            var function_key = function_keywords.First();
                            if (function_key.Contains("종료"))
                            {
                                requestion = "정말로 종료하시겠습니까?";
                                function_key = "종료";
                            }
                            else if (function_key.Contains("분석"))
                            {
                                foreach (var param in param_keywords)
                                {
                                    var search_result = stock_list.FirstOrDefault(p => p.Value["name"].ReadAs<string>() == param);
                                    if (search_result.Key != null)
                                    {
                                        var whereKV = new JsonObject(); whereKV.Add("category", search_result.Value["code"].ReadAs<string>());
                                        var selectedItems = new List<string>() { "category", "column_json(rawdata) as `data`"  };
                                        var query = MariaQueryBuilder.SelectQuery("current_stock", selectedItems, whereKV);
                                        var res = MariaDBConnector.Instance.GetJsonObject(query);
                                        requestion = res.ToString();
                                        function_key = string.Empty;
                                        break;
                                    }
                                    else
                                    {
                                        requestion = "분석 종목을 입력해주세요.";
                                        function_key = "분석";
                                    }
                                }
                            }
                            else if (function_key.Contains("추천"))
                            {
                                function_key = "추천";
                            }
                            else
                            {
                                requestion = "재질문";
                                function_key = string.Empty;
                            }

                            if(!string.IsNullOrWhiteSpace(function_key)) talk_queue.Enqueue(function_key);
                        }
                        else
                        {
                            requestion = "해당 기능이 없습니다.(분석, 추천, 종료)";
                        }
                    }
                    else
                    {
                        requestion = "다시 말씀해주세요.";
                    }
                    this.SendMessage(requestion);
                }
            }
        }

        private Dictionary<string, List<string>> KeywordExtract(string text)
        {
            var result = new Dictionary<string, List<string>>();

            /* Analysis using the work flow */
            workflow.analyze(text);

            LinkedList<Sentence> resultList = workflow.getResultOfDocument(new Sentence(0, 0, false));
            foreach (Sentence s in resultList)
            {
                Eojeol[] eojeolArray = s.Eojeols;
                for (int i = 0; i < eojeolArray.Length; i++)
                {
                    if (eojeolArray[i].length > 0)
                    {
                        for (int j = 0; j < eojeolArray[i].length; j++)
                        {
                            var key = "UNKNOWN";
                            var tag = eojeolArray[i].Tags[j];
                            var content = eojeolArray[i].Morphemes[j].ToString();
                            if (tag == "NC")
                            {
                                key = "키워드";
                            }
                            else if (tag == "II")
                            {
                                key = "응답";
                                if (content == "예" || content == "응" || content == "네")
                                {
                                    content = "true";
                                }
                                else if (content == "아니오" || content == "아니")
                                {
                                    content = "false";
                                }
                            }
                            else if (tag == "NN")
                            {
                                key = "수치";
                            }
                            var keywords = result.ContainsKey(key) ? result[key] : new List<string>();
                            keywords.Add(content);
                            if (!result.ContainsKey(key)) result.Add(key, keywords);
                        }
                    }
                }
            }
            return result;
        }

        public void Question(JsonObject payload)
        {

        }

        public void Answer(JsonObject payload)
        {

        }

        private void SendMessage(string message)
        {
            var json = new JsonObject();
            json.Add("text", message);
            var reqParam = new RequestParameter()
            {
                Url = ConfigurationManager.AppSettings["SlackUrl"],
                ContentType = "application/json",
                EncodingOption = "UTF8",
                Method = "POST",
                PostMessage = json.ToString()
            };

            HttpsRequest.Instance.GetResponseByHttps(reqParam);
        }

        public void start(string user_id, string user_name)
        {
            var json = new JsonObject();
            json.Add("text", "안녕하세요. 주식 투자 도우미 빅앤츠입니다. "+user_name+"님 저를 부르셨나요?");
            var reqParam = new RequestParameter()
            {
                Url = ConfigurationManager.AppSettings["SlackUrl"],
                ContentType = "application/json",
                EncodingOption = "UTF8",
                Method = "POST",
                PostMessage = json.ToString()
            };

            HttpsRequest.Instance.GetResponseByHttps(reqParam);
            //sessions.Add(user_id, 
        }

        public bool CheckUser(string user_id)
        {
            return sessions.ContainsKey(user_id);
        }

        //public BotLogic(string user, string text)
        //{
        //    Workflow workflow = WorkflowFactory.getPredefinedWorkflow(WorkflowFactory.WORKFLOW_POS_SIMPLE_22);
        //    workflow.activateWorkflow(true);

        //    /* Analysis using the work flow */
        //    workflow.analyze(text);

        //    LinkedList<Sentence> resultList = workflow.getResultOfDocument(new Sentence(0, 0, false));
        //    foreach (Sentence s in resultList)
        //    {
        //        Eojeol[] eojeolArray = s.Eojeols;
        //        for (int i = 0; i < eojeolArray.Length; i++)
        //        {
        //            if (eojeolArray[i].length > 0)
        //            {
        //                for (int j = 0; j < eojeolArray[i].length; j++)
        //                {
        //                    var tag = eojeolArray[i].Tags[j];
        //                    var content = eojeolArray[i].Morphemes[j].ToString();
        //                    if (tag == "NC")
        //                    {
        //                        // 키워드
        //                    }
        //                    else if (tag == "II")
        //                    {
        //                        // 예 or 아니오
        //                    }
        //                    else if (tag == "NN")
        //                    {
        //                        // 수치 데이터
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    var json = new JsonObject();
        //    json.Add("text", "몰라 말걸지마");
        //    var reqParam = new RequestParameter()
        //    {
        //        Url = ConfigurationManager.AppSettings["SlackUrl"],
        //        ContentType = "application/json",
        //        EncodingOption = "UTF8",
        //        Method = "POST",
        //        PostMessage = json.ToString()
        //    };

        //    HttpsRequest.Instance.GetResponseByHttps(reqParam);
        //}
    }
}
