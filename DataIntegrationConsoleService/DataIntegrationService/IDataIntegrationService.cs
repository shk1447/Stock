﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;
using Model.Request;
using Model.Response;
using Model.Common;

namespace DataIntegrationService
{
    [ServiceContract]
    interface IDataIntegrationService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SetDataSource", ResponseFormat = WebMessageFormat.Json)]
        SetDataSourceRes SetDataSource(Stream stream);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "View/Execute", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        CommonResponse ViewExecute(ViewExecuteReq req);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "AutoAnalysis?state={state}&name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        CommonResponse AutoAnalysis(string state, string name);
    }
}
