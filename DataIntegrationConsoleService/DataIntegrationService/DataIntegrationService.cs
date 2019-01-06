using System;
using System.Collections.Generic;
using System.Data;
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
using Newtonsoft.Json.Linq;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.Diagnostics;
using Model.Response;
using Model.Request;
using SourceModuleManager;
using Helper;
using Model.Common;
using System.ServiceModel.Channels;
using System.Json;
using System.Web;
using System.Configuration;
using DataIntegrationServiceLogic;


namespace DataIntegrationService
{
    [ServiceBehavior(ConcurrencyMode = ConcurrencyMode.Multiple, InstanceContextMode = InstanceContextMode.PerCall)]
    public partial class DataIntegrationService : IDataIntegrationService
    {
        public DataIntegrationService()
        {
        }

        #region IDataIntegrationService 멤버

        public SetDataSourceRes SetDataSource(Stream stream)
        {   
            if (WebOperationContext.Current.IncomingRequest.Headers == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            SetDataSourceReq param = null;
            using (var streamReader = new StreamReader(stream))
            {
                param = DataConverter.Deserializer<SetDataSourceReq>(streamReader.ReadToEnd());
            }

            var res = new SetDataSourceRes();

            if (param != null && param.rawdata != null && param.rawdata.Count > 0 && !string.IsNullOrWhiteSpace(param.source) && !string.IsNullOrWhiteSpace(param.category))
            {
                var query = MariaQueryBuilder.SetDataSource(param);
                MariaDBConnector.Instance.SetQuery("DynamicQueryExecuter", query);

                res.code = "200";
                res.message = "요청 접수 완료";
            }
            else
            {
                res.code = "400";
                res.message = "잘못된 요청";
            }

            return res;
        }

        public CommonResponse ViewExecute(ViewExecuteReq req)
        {
            if (WebOperationContext.Current.IncomingRequest.Headers == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var result = new CommonResponse();

            var jsonObj = new JsonObject(new KeyValuePair<string, JsonValue>("name", req.name), new KeyValuePair<string, JsonValue>("member_id", req.member_id));

            var viewLogic = new ViewLogic();
            result.code = "200"; result.message = viewLogic.Execute(jsonObj);

            return result;
        }

        #endregion

        #region IDataIntegrationService 멤버


        public CommonResponse AutoAnalysis(string period, string state, string name)
        {
            if (WebOperationContext.Current.IncomingRequest.Headers == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var viewLogic = new ViewLogic();
            var result = new CommonResponse();

            try
            {
                result.code = "200";
                var stock_list = name == null ? new List<string>() : name.Split(',').ToList();
                result.message = viewLogic.AutoAnalysis(period == null ? string.Empty : period.ToLower(), "avg", stock_list);
            }
            catch(Exception ex)
            {
                result.code = "400";
                Console.WriteLine(ex.ToString());
            }

            return result;
        }

        public CommonResponse AutoFilter()
        {
            if (WebOperationContext.Current.IncomingRequest.Headers == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }

            var viewLogic = new ViewLogic();
            var result = new CommonResponse();

            viewLogic.AutoFilter();

            return result;
        }

        #endregion

        #region IDataIntegrationService 멤버


        public void SlackMessage(Stream stream)
        {
            if (WebOperationContext.Current.IncomingRequest.Headers == null)
            {
                throw new Exception("Can not get current WebOpreationContext.");
            }
            
            var body = string.Empty;
            using (var streamReader = new StreamReader(stream, Encoding.Default))
            {
                body = HttpUtility.UrlDecode(streamReader.ReadToEnd());
            }
            var param = new Dictionary<string, string>();
            foreach (var item in body.Split('&'))
            {
                var kv = item.Split('=');
                param.Add(kv[0], kv[1]);
            }

            var message = param["text"];
            var user_id = param["user_id"];
            var user_name = param["user_name"];
            if (!user_id.Equals("USLACKBOT"))
            {
                BotLogic.Instance.Receive(param);
            }
        }

        #endregion
    }
}