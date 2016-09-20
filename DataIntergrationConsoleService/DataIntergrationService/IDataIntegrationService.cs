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
        [WebInvoke(Method = "GET", UriTemplate = "GetDataAnalysis", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<GetDataAnalysisRes> GetDataAnalysis();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "ExecuteDataAnalysis?name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        ExecuteDataAnalysisRes ExecuteDataAnalysis(string name);

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
        [WebInvoke(Method = "GET", UriTemplate = "GetCollectionModule", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<GetCollectionModuleRes> GetCollectionModule();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "ExecuteCollectionModule?name={name}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        ExecuteCollectionModuleRes ExecuteCollectionModule(string name);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SetDataView", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        SetDataViewRes SetDataView(SetDataViewReq param);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "GetDataView", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        GetDataViewRes GetDataView(GetDataViewReq param);
    }
}
