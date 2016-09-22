
WebSocketProxy = function () {
  this.opCode = {
    WufCertification : 0x0001,
    MapCreated : 0x0101,
    RequestHealth : 0x0201,
    RequestMetric : 0x0202,
    HealthData : 0x0301,
    MetricData : 0x0302,
    ReleaseHealth : 0x0401,
    ReleaseMetric : 0x0402,
    ReleaseClient : 0x0403,
    ErrorMessage : 0x0501
  };

  this.fileReader = new FileReader();
  this.fileReader.onload = this.onFileReaderLoad;
  this.dataBlobArray = [];
  this.webSocket = null;
  this.info = {port: '', token: ''};
  this.ready = false;
  this.isConnected = false;
  this.readyDatas = [];
  this.reConnectInterval = 5000;
  this.reConnectIntervalId = null;
};

WebSocketProxy.prototype = {

  /**
   * connect
   */
  connect: function(){
    if(webSocketProxy.webSocket){
      webSocketProxy.disConnect();
    }

    Meteor.call('webSocket:getWebSocketProxyPort', Cookie.get('meteor_login_token'), function(err, res){
      if(err){
        console.log(err);
        return;
      }

      webSocketProxy.info = res;

      var ip = res.ip || location.host;
      var port = res.port || false;
      var protocol = (window.location.protocol !== "https:")?"ws://":"wss://";
      var address = protocol + ip + (port?":"+port:"") + '/WufService';

      //webSocketProxy.webSocket = new WebSocket(protocol + ip + ":" + port + '/WufService');
      webSocketProxy.webSocket = new WebSocket(address);
      //if(webSocketProxy.webSocket.readyState === 1){
        webSocketProxy.webSocket.onmessage = webSocketProxy.onMessage;
        webSocketProxy.webSocket.onopen = webSocketProxy.onOpen;
        webSocketProxy.webSocket.onclose = webSocketProxy.onClose;
      //}
    });
  },

  /**
   * trying to reconnect
   */
  reConnect: function(){
    if(!webSocketProxy.reConnectIntervalId){
      webSocketProxy.reConnectIntervalId = setInterval(function(){
        webSocketProxy.connect();
      }, webSocketProxy.reConnectInterval);
    }
  },

  /**
   * dis connect
   */
  disConnect: function(){
    if(webSocketProxy.webSocket){
      webSocketProxy.webSocket.close();
      webSocketProxy.webSocket = null;
    }
  },

  /**
   * on message event handler
   * @param e
   */
  onMessage: function(e){
    webSocketProxy.readBinaryMessage(e.data);
  },

  /**
   * on socket open event handler
   * @param e
   */
  onOpen: function(e){
    webSocketProxy.isConnected = true;
    webSocketProxy.send(0x0001, webSocketProxy.opCode.WufCertification, webSocketProxy.info.token);
  },

  /**
   * on socket close event handler
   * @param e
   */
  onClose: function(e){
    webSocketProxy.isConnected = false;
    webSocketProxy.ready = false;
    PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_PROXY_DIS_CONNECTED, 'on proxy dis connected.'));

    if(webSocketProxy.webSocket !== null){
      webSocketProxy.reConnect();
    }
  },

  /**
   * read binary message from data
   * @param data
   */
  readBinaryMessage: function(data){
    if(webSocketProxy.fileReader.readyState == 1){
      webSocketProxy.dataBlobArray.push(data);
    } else {
      webSocketProxy.fileReader.readAsArrayBuffer(data);
    }
  },

  /**
   * on file reader load event handler
   * @param processEvent
   */
  onFileReaderLoad: function(processEvent){
    var bytes = new Uint8Array(webSocketProxy.fileReader.result);
    var sequenceValue = bytes[0] << 8 | bytes[1];
    var messageTypeValue = bytes[2] << 8 | bytes[3];
    var dataValue = webSocketProxy.bin2String(bytes, 4, bytes.length);
    var response = new ResponseData(sequenceValue, messageTypeValue, dataValue);
    webSocketProxy.receiveMessage(response);
  },

  /**
   * binary to string
   * @param array
   */
  bin2String: function(array, startIndex, endIndex) {
    var result = "";
    for (var i = startIndex; i < endIndex; i++) {
      result += String.fromCharCode(array[i]);
    }
    return decodeURIComponent(result.replace(/\+/g,  " "));
  },

  /**
   * message handler
   * @param response
   */
  receiveMessage: function(response){
    switch(response.opCode){
      case webSocketProxy.opCode.WufCertification:
        //Auth complete
        if(response.data === "True"){
          webSocketProxy.ready = true;
          webSocketProxy.callReady();
        }
        break;
      case webSocketProxy.opCode.MapCreated:
        //Map생성 완료
        PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_MAP_CREATED, 'on map created', response));
        break;
      case webSocketProxy.opCode.HealthData:
        //Health Data 받음
        PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_HEALTH_DATA, 'on health data', response));
        break;
      case webSocketProxy.opCode.MetricData:
        //Metric Data 받음
        PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_METRIC_DATA, 'on metric data', response));
        break;
    }

    //async data Array length > 0
    if(webSocketProxy.dataBlobArray.length > 0){
      webSocketProxy.readBinaryMessage(webSocketProxy.dataBlobArray.shift());
    }
  },

  /**
   * ready
   */
  callReady: function(){
    if(!webSocketProxy.ready){
      return;
    }

    _.each(webSocketProxy.readyDatas, function(data){
      webSocketProxy.send(data.seq, data.type, data.data);
    });

    webSocketProxy.readyDatas = [];

    if(webSocketProxy.reConnectIntervalId !== null){
      clearInterval(webSocketProxy.reConnectIntervalId);
      webSocketProxy.reConnectIntervalId = null;
      PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_PROXY_RECONNECTED, 'on proxy reconnected.'));
    }else{
      PUFEventSystem.dispatchEvent(new PUFEvent(WebSocketProxyEventType.ON_PROXY_CONNECTED, 'on proxy connected.'));
    }
  },

  /**
   * check ready
   */
  checkReady: function(){
    if(webSocketProxy.ready){
      webSocketProxy.callReady();
    }
  },

  /**
   * make send data binary
   * @param sequence
   * @param type
   * @param data
   * @returns {Uint8Array}
   */
  makeProtocolMessage: function(sequence, type, data){
    var array = new Uint8Array(4 + data.length);
    array[0] = sequence>>8;
    array[1] = sequence&255;
    array[2] = type>>8;
    array[3] = type&255;
    for (var i = 0; i < data.length; ++i) {
      array[4+i] = data.charCodeAt(i);
    }
    return array;
  },

  /**
   * send data to web socket
   * @param sequence
   * @param type
   * @param data
   */
  send: function(sequence, type, data){
    if(!webSocketProxy.isConnected){
      webSocketProxy.readyDatas.push({
        seq: sequence,
        type: type,
        data: data
      });

      console.log('socket is closed. trying to reconnect.');
      webSocketProxy.connect();

      return;
    }
    var bytes = webSocketProxy.makeProtocolMessage(sequence, type, data);
    webSocketProxy.webSocket.send(bytes);
  },

  /**
   * request health
   * @param divId
   * @param guid
   * @param time
   */

  //div, mapguid, latesttime
  requestHealth: function(divId, guid, time){
    var mapData = JSON.stringify({
      DivId: divId,
      MapGuid: guid,
      //ObjectID : guid,
      //EarliestTime: startTime,
      LatestTime : time
    });

    if(webSocketProxy.ready){
      webSocketProxy.send(0x01, webSocketProxy.opCode.RequestHealth, mapData);
    }else{
      webSocketProxy.readyDatas.push({
        seq: 0x01,
        type: webSocketProxy.opCode.RequestHealth,
        data: mapData
      });
    }
  },

  /**
   * release health
   * @param divId
   * @param guid
   * @param time
   */
  //div, mapguid
  releaseHealth: function(divId, guid, time){
    var mapData = JSON.stringify({
      DivId: divId,
      MapGuid: guid
      //EarliestTime: time
    });

    if(webSocketProxy.ready){
      webSocketProxy.send(0x01, webSocketProxy.opCode.ReleaseHealth, mapData);
    }else{
      webSocketProxy.readyDatas.push({
        seq: 0x01,
        type: webSocketProxy.opCode.ReleaseHealth,
        data: mapData
      });
    }
  },

  /**
   * request metric
   * @param divId
   * @param guid
   * @param objectId
   * @param time
   */
  requestMetric: function(divId, guid, objectId, time){
    var mapData = JSON.stringify({
      DivId: divId,
      MapGuid: guid,
      ObjectID: objectId,
      //EarliestTime: time
      LatestTime : time
    });

    if(webSocketProxy.ready){
      webSocketProxy.send(0x01, webSocketProxy.opCode.RequestMetric, mapData);
    }else{
      webSocketProxy.readyDatas.push({
        seq: 0x01,
        type: webSocketProxy.opCode.RequestMetric,
        data: mapData
      });
    }
  },

  /**
   * release metric
   * @param divId
   * @param guid
   * @param objectId
   * @param time
   */
  releaseMetric: function(divId, guid, objectId, time){
    var mapData = JSON.stringify({
      DivId: divId,
      MapGuid: guid,
      ObjectID: objectId,
      //EarliestTime: time
      LatestTime : time
    });

    if(webSocketProxy.ready){
      webSocketProxy.send(0x01, webSocketProxy.opCode.ReleaseMetric, mapData);
    }else{
      webSocketProxy.readyDatas.push({
        seq: 0x01,
        type: webSocketProxy.opCode.ReleaseMetric,
        data: mapData
      });
    }
  }
};

/**
 * make response data
 * @param sequenceValue
 * @param opCode
 * @param dataValue
 * @constructor
 */
function ResponseData(sequenceValue, opCode, dataValue)	{
  this.sequence = sequenceValue;
  this.opCode = opCode;
  this.data = dataValue;
}

// global instance for web socket proxy
webSocketProxy = new WebSocketProxy();