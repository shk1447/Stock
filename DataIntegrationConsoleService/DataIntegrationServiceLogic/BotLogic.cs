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

namespace DataIntegrationServiceLogic
{
    public class BotLogic
    {
        private Dictionary<string, Queue<string>> sessions = new Dictionary<string, Queue<string>>();
        private Dictionary<string, List<string>> function_keywords = new Dictionary<string, List<string>>();

        private BotLogic()
        {
        }

        public static BotLogic Instance
        {
            get
            {
                return Nested<BotLogic>.Instance;
            }
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
