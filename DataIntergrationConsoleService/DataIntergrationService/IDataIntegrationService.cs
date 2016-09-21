using System;
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
        [WebInvoke(Method = "POST", UriTemplate = "SetDataAnalysis", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        SetDataAnalysisRes SetDataAnalysis(List<SetDataAnalysisReq> stream);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDataAnalysisList", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<GetDataAnalysisRes> GetDataAnalysisList();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "ExecuteDataAnalysis?name={name}&command={command}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        ExecuteDataAnalysisRes ExecuteDataAnalysis(string name, string command);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "GetDataSource", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        GetDataSourceRes GetDataSource(GetDataSourceReq param);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDataStructure", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        GetDataStructureRes GetDataStructure();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetModuleStructure", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        GetModuleStructureRes GetModuleStructure();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SetCollectionModule", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        SetCollectionModuleRes SetCollectionModule(List<SetCollectionModuleReq> param);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCollectionModuleList", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<GetCollectionModuleRes> GetCollectionModuleList();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "ExecuteCollectionModule?name={name}&command={command}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        ExecuteCollectionModuleRes ExecuteCollectionModule(string name, string command);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SetDataView", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        SetDataViewRes SetDataView(SetDataViewReq param);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDataViewList", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<GetDataViewRes> GetDataViewList();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDataView?name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<JsonDictionary> GetDataView(string name);
    }
}
