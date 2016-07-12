﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;

namespace DataIntegrationService
{
    [ServiceContract]
    interface IDataIntegrationService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DataSource/Set")]
        string SetSourceData(Stream stream);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DataSource/Get")]
        Stream GetSourceData(Stream stream);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DataField/Get")]
        Stream GetFields(Stream stream);

        [OperationContract]
        [WebGet(UriTemplate = "SetStockList", RequestFormat = WebMessageFormat.Json)]
        Stream SetStockList();

        [OperationContract]
        [WebGet(UriTemplate = "SetStockHistory", RequestFormat = WebMessageFormat.Json)]
        Stream SetStockHistory();

        [OperationContract]
        [WebGet(UriTemplate = "SetStockCurrent", RequestFormat = WebMessageFormat.Json)]
        Stream SetStockCurrent();

        [OperationContract]
        [WebGet(UriTemplate = "SetStockAnalysis", RequestFormat = WebMessageFormat.Json)]
        Stream SetStockAnalysis();

        [OperationContract]
        [WebGet(UriTemplate = "GetStockList", RequestFormat = WebMessageFormat.Json)]
        Stream GetStockList();

        [OperationContract]
        [WebGet(UriTemplate = "GetStockCurrent", RequestFormat = WebMessageFormat.Json)]
        Stream GetStockCurrent();

        [OperationContract]
        [WebGet(UriTemplate = "GetMovingAverage?source={source}&start={start}&end={end}", RequestFormat = WebMessageFormat.Json)]
        Stream GetMovingAverage(string source, string start, string end);

        [OperationContract]
        [WebGet(UriTemplate = "GetTrix?source={source}&type={type}&trix={trix}&signal={signal}&start={start}&end={end}", RequestFormat = WebMessageFormat.Json)]
        Stream GetTrix(string source, string type, string trix, string signal, string start, string end);
    }
}