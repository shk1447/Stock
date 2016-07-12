/**
 * Created by Administrator on 2016-06-09.
 */
window.HttpRequest = {
    _url : "",
    httpMethod : function(path, method, data, successFunction){
        var url = this._url + path;
        this.request(url,successFunction);
    },
    createXMLHttpRequest : function () {
        var xmlHttp;
        if(window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if(window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        return xmlHttp;
    },
    request : function (url, callback) {
        var xmlHttp = this.createXMLHttpRequest();
        var url = url;
        xmlHttp.onreadystatechange = callback;
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
};