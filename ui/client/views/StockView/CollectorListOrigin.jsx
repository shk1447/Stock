var n = require('nuxjs');

var list = React.createClass({
  componentDidMount : function() {
  },
  getInitialState: function(){
    return { scheduleList : {}, urlValues : {url:'', urlList:['http://172.16.10.65:1346','http://172.16.10.71:1356']}, selectedValues : {Databases:[]}, tabs : [], scheduleTabs : [], sourceModules : {}, queryModules: {}, running: false, runButtonText : 'Run' };
  },
  scheduleInitialize: function(){
    this.setState({
      scheduleList : {},
      sourceModules : {},
      queryModules : {},
      tabs : []
    });
    this.clearSchedule();

      this.getSchedule(this.state.urlValues.url);
      this.getQueryModules(this.state.urlValues.url);
      this.getSourceModules(this.state.urlValues.url);

    self.dataItem.QueryModules = self.state.queryModules[current.dataItem.url];
    current.dataItem.SourceModules = self.state.sourceModules[current.dataItem.url];
    self.setState({
      selectedValues : current.dataItem
    });
  },
  getQueryModules: function(url){
    var self = this;
    var callUrl = url + "/DataCollector/QueryModuel";
    var data = {};
    this.httpMethod(callUrl,"GET", data, function(result){
      self.state.queryModules[url] = result.Result;
      self.state.selectedValues.QueryModules = result.Result;
      self.state.selectedValues.url = url;
      self.setState({
        queryModuels : self.state.queryModules,
        selectedValues : self.state.selectedValues
      });
    })
  },
  getSourceModules: function(url){
    var self = this;
    var callUrl = url + "/DataCollector/SourceModuel";
    var data = {};
    this.httpMethod(callUrl,"GET", data, function(result){
      self.state.sourceModules[url] = result.Result;
      self.state.selectedValues.SourceModules = result.Result;
      self.state.selectedValues.url = url;
      self.setState({
        sourceModules : self.state.sourceModules,
        selectedValues : self.state.selectedValues
      });
    })
  },
  createGuid: function ()
  {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  getSchedule: function (url) {
    var self = this;
      var callUrl = url + "/DataCollector/Schedule";
      var data = {};
      this.httpMethod(callUrl,"GET", data, function(result){
        console.log('!!!!!!!!!!!!!!!!!',result.Result);
        var index = 0;
        for(var i in result.Result.ScheduleList){
          result.Result.ScheduleList[i].url = url;
          result.Result.ScheduleList[i].index = ++index;
          result.Result.ScheduleList[i].DatabasesStr = result.Result.ScheduleList[i].Databases.join();
        }
        console.log('!!!!!!!!!!!!!!!!!',result.Result);
        self.state.scheduleList[url] = result.Result.ScheduleList;
        self.state.tabs.push({id:url,text:url,isRunning: result.Result.IsRunning});
        var runButtonText =result.Result.IsRunning ? 'Stop' : 'Run';
        self.setState({
          scheduleList : self.state.scheduleList,
          tabs : self.state.tabs,
          running : result.Result.IsRunning,
          runButtonText : runButtonText
        });
      })
  },
  upsertSchedule: function(){
    var callUrl = this.state.selectedValues.url + '/DataCollector/Schedule';
    var data = this.state.selectedValues;
    if(data.ScheduleKey == null){
      data.ScheduleKey = this.createGuid();
    }
    var self = this;
    this.httpMethod(callUrl,"POST", data, function(result){
      console.log(result);

      //self.sleep(500);
      self.scheduleInitialize();
    });
  },
  newSchedule: function(){
    var callUrl = this.state.selectedValues.url + '/DataCollector/Schedule';
    var data = this.state.selectedValues;
    data.ScheduleKey = this.createGuid();
    var self = this;
    this.httpMethod(callUrl,"POST", data, function(result){
      console.log(result);
      //self.sleep(500);
      self.scheduleInitialize();
    });
  },
  sleep: function sleep(ms)
  {
    var e = new Date().getTime() + (ms);
    while (new Date().getTime() <= e) {}
  },
  httpMethod: function(url, method, data, successFunction){
    $.ajax({
      type: method,
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: successFunction,
      error: function(e){
        console.log('Error', e);
      }
    });
  },
  startSchedule: function (url) {
    var callUrl = url + '/DataCollector/Schedule/Start';
    var data = {};
    var self = this;
    this.httpMethod(callUrl,"GET", data, function(result){
      console.log(result);

      self.scheduleInitialize();
    })
  },
  stopSchedule: function (url) {
    var callUrl = url + '/DataCollector/Schedule/Stop';
    var data = {};
    var self = this;
    this.httpMethod(callUrl,"GET", data, function(result){
      console.log(result);

      self.scheduleInitialize();
    })
  },
  runSchedule: function(url){
    if(this.state.running){
      this.stopSchedule(url);
    }else{
      this.startSchedule(url);
    }
    //var runButtonText = this.state.running ? 'Run' : 'Stop';
    //console.log('GOGOGOGO', runButtonText);
    //this.setState({
//      running : !this.state.running,
//      runButtonText : runButtonText
//    });
  },
  changeGuid: function(){
    this.state.selectedValues.ScheduleKey = this.createGuid();
    this.setState({
      selectedValues : this.state.selectedValues
    });
  },
  deleteSchedule: function(){
    //Delete ¾ÈµÇ³×..
    var url =  this.state.selectedValues.url + '/DataCollector/Schedule/Delete';
    var data = this.state.selectedValues;
    var self = this;
    this.httpMethod(url, "Post", data, function(result){
      console.log(result);

      //self.sleep(500);
      self.scheduleInitialize();
    });
  },
  clearSchedule: function(){
    this.state.selectedValues.ScheduleKey = '';
    this.state.selectedValues.QueryModule = '';
    this.state.selectedValues.Type = '';
    this.state.selectedValues.QueryString = '';
    this.state.selectedValues.ObjectID = '';
    this.state.selectedValues.Interval = '';
    this.state.selectedValues.DatabaseKey = '';
    this.state.selectedValues.Databases = [];
    this.setState({
      selectedValues : this.state.selectedValues
    });
  },
  render : function() {
    console.log('WWWWW', this.state.tabs);
    var self = this;
    var tabDom = this.state.tabs.map(function (item, index) {
      console.log('akbkc', self.state.runButtonText);
      var buttonText = self.state.runButtonText;
      return <n.Panel title={item.id}>
        <n.Panel>
          <n.Button text={buttonText} height='30' onClick={function(){
            self.runSchedule(item.id);
           }}/>
        </n.Panel>
        <n.Panel>
          <n.Grid
              selectable={true}
              ref="grid"
              flex={2}
              data={self.state.scheduleList[item.id]}
              height={500}
              columns={[
            {field :"index",title:"Index"},
            {field :"QueryModule",title:"QueryModule"},
            {field :"QueryString",title:"QueryString"},
            {field :"Type",title:"Type"},
            {field :"ObjectID",title:"ObjectID"},
            {field :"Interval",title:"Interval"},
            {field :"DatabaseKey",title:"DatabaseKey"},
            {field :"DatabasesStr",title:"Databases"}
          ]}
              onCellClick={function( grid, event, current, rowIndex, columnIndex, dataItem ){
                  current.dataItem.QueryModules = self.state.queryModules[current.dataItem.url];
                  current.dataItem.SourceModules = self.state.sourceModules[current.dataItem.url];
                  self.setState({
                    selectedValues : current.dataItem
                  });
            }}/>
        </n.Panel>
      </n.Panel>;
    });
    console.log(this.state.selectedValues.Databases);

    if (this.state.selectedValues.Databases != null) {
    var databasesDom = this.state.selectedValues.Databases.map(function (item, index) {
      return {header: item};
    });
  }

    return (
    <n.BorderLayout ref="borderLayout">
      <n.Area name="center">
        <n.Form>
        <n.Select label="Url Select" width='300' height='35' options={this.state.urlValues.urlList} value={self.state.urlValues.url} onChange={function(_comp, _newVal){
                console.log('changed :', _newVal);
                self.state.urlValues.url = _newVal;
                 self.setState({
                  urlValues : self.state.urlValues
                });
                self.scheduleInitialize();
           }}/>
          </n.Form>
          {tabDom}
      </n.Area>
      <n.Area name="left" size={500} >
        <n.Form values={this.state.selectedValues} >
		  <h2 style={{color:'black'}}>Schedule Setting</h2>
          <n.Select label="QueryModule" width='300' height='35' options={this.state.selectedValues.QueryModules} name='QueryModule' />
          <n.Select label="Type" width='300' height='35' options={this.state.selectedValues.SourceModules} name='Type' />
          <n.TextField label="ObjectID" width='300' name="ObjectID" height='35'/>
          <n.TextField label="Interval" width='300' name="Interval" height='35'/>
          <n.TextField label="DatabaseKey" width='300' name="DatabaseKey" height='35'/>
          <n.Select label="Database" width='300' height='35' options={['Cassandra','Influx']} onChange={function(_comp, _newVal){
                console.log('changed :', self.state.selectedValues.Databases.indexOf(_newVal));
                if(self.state.selectedValues.Databases.indexOf(_newVal) == -1){
                   self.state.selectedValues.Databases.push(_newVal);
                   self.setState({
                    selectedValues : self.state.selectedValues
                   });
                }
           }}/>
          <div style={{color:'black'}}>
            <div>
            Selected Database :
            </div>
            <n.Form>
              <n.CardView hidden={true} width={200} cardHeight={100} data={databasesDom} onCardSelect={function(_comp, _cardInfo){
                console.log(_cardInfo.header);
                var index = self.state.selectedValues.Databases.indexOf(_cardInfo.header);
                console.log(index,index);
                 self.state.selectedValues.Databases.splice(index,1);
                   self.setState({
                    selectedValues : self.state.selectedValues
                   });
              }}/>
            </n.Form>
          </div>
		  <div style={{color:'black'}}>QueryString</div>
		  <n.TextArea rows="10"  name="QueryString" style={{borderSize:'1px'}}/>
          <n.Checkbox label="Is Current Data"/>
          <n.Button text="New Schedule" height='30' onClick={this.newSchedule} />
          <n.Button text="Upsert Schedule" height='30' onClick={this.upsertSchedule} />
          <n.Button text="Delete Schedule" onClick={this.deleteSchedule} />
          <n.Button text="Clear Schedule" height='30' onClick={this.clearSchedule} />
          <div style={{height:500}}/>
        </n.Form>
      </n.Area>
    </n.BorderLayout>
    )}
});

module.exports = list;