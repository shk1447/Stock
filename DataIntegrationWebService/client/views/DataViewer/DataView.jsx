var React = require('react');
var io = require('socket.io-client');
var {Menu,Icon,Dropdown,Loader} = require('stardust');
var {List} = require('semantic-ui-react');
var DataTable = require('../Common/DataTable');
var Chart = require('../Common/Chart');
var ModalForm = require('../Common/ModalForm');

module.exports = React.createClass({
    isDragging: false,
    displayName: 'DataView',
    samplingSettingFields : [{ value:'title', text:"TITLE", type:'Select', required:true, group:0, options:[]},
    { value:'sampling', text:"SAMPLING", type:'Select', required:true, group:1, options:[
        {value:'max',text:'MAX'},{value:'min',text:'MIN'},{value:'avg',text:'AVG'},{value:'sum',text:'SUM'},{value:'count',text:'COUNT'}
    ]},
    {value:'sampling_period', text:"SAMPLING PERIOD", type:'Select', group:1, required:true, options:[
        {value:'all',text:'ALL'},{value:'day',text:'DAY'},{value:'week',text:'WEEK'},{value:'month',text:'MONTH'},{value:'year',text:'YEAR'}
    ]}],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        this.$ViewList = $(ReactDOM.findDOMNode(this.refs.ViewList));

        self.socket.on('view.getlist', function(data) {
            self.state.viewlist = data;
            self.setState({viewlist:data});
            _.each(self.state.gridInfo, function(value, id){
                if (value.view_type != 'video') {
                    var data = {"broadcast":false,"target":"view","method":"execute", "parameters":{"name":self.state.gridInfo[id].name},"cellId":id};
                    self.socket.emit('fromclient', data);
                    var contents = <Loader active>Loading...</Loader>;
                    ReactDOM.render(contents, self.refs[id]);
                } else {
                    var viewInfo = self.state.viewlist.find(function(d){
                        return d.name == self.state.gridInfo[id].name;
                    });
                    let view_source = viewInfo["view_options"]["view_source"];
                    let src = self.validateURL(view_source) ? view_source : "/video/" + view_source;
                    var contents = <video key={'video'} style={{height:'100%',width:'100%'}} src={src} controls/>
                    ReactDOM.render(contents, self.refs[id]);
                }
            });
        });
        self.socket.on('view.execute', function(response) {
            let cellId = response.cellId ? response.cellId : 'cell_' + self.gridId;
            let cellInfo = self.state.gridInfo[cellId];
            if(cellInfo["view_type"] == 'past') {
                var contents = <Chart title={cellInfo["name"]} data={response.data} fields={response.fields} cellId={cellId}
                                      action={self.callbackDataView} />;
            } else if(cellInfo["view_type"] =='current') {
                var contents = <DataTable title={'DataView'} data={response.data} filters={[]} repeatable={true}
                                          fields={response.fields} searchable callback={self.callbackDataView}/>;
            }
            ReactDOM.render(contents, self.refs[cellId]);
        });
        self.socket.on('view.execute_item', function(response) {
            let cellId = response.cellId ? response.cellId : 'cell_' + self.gridId;
            var contents = <Chart title={response.title} data={response.data} fields={response.fields} cellId={cellId}
                                      action={self.callbackDataView} />;
            ReactDOM.render(contents, self.refs[cellId]);
        });
        self.socket.on('view.download', function(response) {
            var arr = new Uint8Array(response);
            var dataView = new DataView(arr);
            var blob = new Blob([dataView]);
            self.saveFile(blob);
        });

        self.socket.on('connected', function() {
            var data = {"broadcast":false,"target":"view", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
            self.socket.emit('fromclient', data);
        });
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
        sessionStorage["last_view"] = JSON.stringify(this.state);
    },
    getInitialState: function() {
        this.socket = io.connect();
        let init_state = {activeItem : '',viewlist:[], data:[],fields:[],contextVisible:false,gridType:1,gridInfo:{}};
        if(sessionStorage["last_view"]) {
            init_state = _.extend(init_state, JSON.parse(sessionStorage.last_view));
        } else {
            sessionStorage["last_view"] = JSON.stringify(init_state);
        }
		return init_state;
	},
    render : function () {
        var self = this;
        const { activeItem, viewlist, gridType } = this.state;
        let viewArr = [];
        _.each(viewlist, function(row,i){
            if(row.view_type == activeItem) {
                let icon = row.view_type == "current" ? "table" : row.view_type == "past" ? "line chart" : "file video outline";
                var item = <List.Item key={i} onMouseDown={self.handleDragStart.bind(self,row)}>
                                <List.Icon name={icon} size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header as='a'>{row.name}</List.Header>
                                    <List.Description as='a'>{row.unixtime}</List.Description>
                                </List.Content>
                            </List.Item>;
                viewArr.push(item);
            }
        });
        const filters = [];
        var gridArr = [];
        var gridHeight = document.documentElement.offsetHeight - 77;
        var gridWidth = document.documentElement.offsetWidth - 70;
        switch(gridType) {
            case 1 : {
                gridArr.push(<div ref='cell_1' key={gridArr.length} className='GridCell' onMouseOver={self.handleDragOver.bind(self, 1)}
                                  style={{position:'absolute',height: gridHeight + 'px',width: gridWidth + 'px'}}></div>);
                break;
            }
            case 2 : {
                let indexKey = 1;
                for(var x = 0; x < 2; x++) {
                    for(var y = 0; y < 2; y++) {
                        var cellId = 'cell_' + indexKey;
                        gridArr.push(<div ref={cellId}  key={gridArr.length} className='GridCell' onMouseOver={self.handleDragOver.bind(self, indexKey)}
                                          style={{position:'absolute',top:y*gridHeight/2+'px',left:x*gridWidth/2+'px', height:gridHeight/2 + 'px',width:gridWidth/2 + 'px'}}></div>);
                        indexKey++;
                    }
                }
                break;
            }
            case 3 : {
                let indexKey = 1;
                for(var x = 0; x < 3; x++) {
                    for(var y = 0; y < 3; y++) {
                        var cellId = 'cell_' + indexKey;
                        gridArr.push(<div ref={cellId}  key={gridArr.length} className='GridCell' onMouseOver={self.handleDragOver.bind(self, indexKey)}
                                          style={{position:'absolute',top:y*gridHeight/3+'px',left:x*gridWidth/3+'px', height:gridHeight/3 + 'px',width:gridWidth/3 + 'px'}}></div>);
                        indexKey++;
                    }
                }
                break;
            }
            case 4 : {
                gridArr.push(<div ref='cell_1' key={0} className='GridCell' onMouseOver={self.handleDragOver.bind(self, 1)}
                                  style={{position:'absolute',top:'0px',left:'0px', height:gridHeight*2/3 + 'px',width:gridWidth + 'px'}}></div>);
                gridArr.push(<div ref='cell_2' key={1} className='GridCell' onMouseOver={self.handleDragOver.bind(self, 2)}
                                  style={{position:'absolute',top:gridHeight*2/3+'px',left:'0px', height:gridHeight/3 + 'px',width:gridWidth/2 + 'px'}}></div>);
                gridArr.push(<div ref='cell_3' key={2} className='GridCell' onMouseOver={self.handleDragOver.bind(self, 3)}
                                  style={{position:'absolute',top:gridHeight*2/3+'px',left:gridWidth/2+'px', height:gridHeight/3 + 'px',width:gridWidth/2 + 'px'}}></div>);
                break;
            }
        }

        if(this.state.contextVisible) {
            var contextMenu = <Menu vertical>
                                    <Dropdown as={Menu.Item} text='GRID LAYOUT'>
                                        <Dropdown.Menu onClick={this.handleGridLayout}>
                                            <Dropdown.Item icon='square' text='FIRST GRID' />
                                            <Dropdown.Item icon='block layout' text='SECOND GRID' />
                                            <Dropdown.Item icon='grid layout' text='THIRD GRID' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu>;
        }
        return (
            <div onMouseMove={self.handleDragMove} onMouseUp={self.handleDragEnd} onMouseLeave={self.handleDragLeave}>
                <div>
                    <Menu icon vertical floated>
                        <Menu.Item name='current' onClick={this.handleItemClick} active={activeItem === 'current'}>
                            <Icon name='table' />
                        </Menu.Item>

                        <Menu.Item name='past' onClick={this.handleItemClick} active={activeItem === 'past'}>
                            <Icon name='line chart' />
                        </Menu.Item>

                        <Menu.Item name='video' onClick={this.handleItemClick} active={activeItem === 'video'}>
                            <Icon name='video' />
                        </Menu.Item>
                    </Menu>
                    <div ref='ViewList' style={{position:'absolute',left:'60px',marginLeft:'-600px',boxShadow:'rgba(34, 36, 38, 0.2002) 1px 2px 2px 1px',
                                                zIndex:'1000',borderRadius:'10px',background:'white', minWidth:'200px', padding:'15px'}}>
                        <div style={{height:'30px'}}>{activeItem.toUpperCase()}</div>
                        <div style={{maxHeight:'700px', overflow:'auto'}}>
                            <List animated divided relaxed verticalAlign='middle'>
                                {viewArr}
                            </List>
                        </div>
                    </div>
                </div>
                <div style={{position:'absolute', left:'60px'}} onContextMenu={this.handleGridContextMenu} onClick={this.handleGridClick}>
                    {gridArr}
                </div>
                <div ref='contextMenu' style={{position:'absolute',zIndex:1000}}>
                    {contextMenu}
                </div>
                <ModalForm ref='ModalForm' action={''} size={'large'} title={'CHART SETTING'} active={false}
                    fields={self.samplingSettingFields} data={[]} callback={this.callbackSamplingChart}/>
            </div>
        )
    },
    callbackSamplingChart : function(result) {
        if(result.action != 'cancel') {
            var self = this;
            let cellId = result.action;
            let title = result.data.title;
            let sampling = result.data.sampling;
            let sampling_period = result.data.sampling_period;
            var data = {"broadcast":false,"target":"view", "method":"execute_item", "parameters":{"source":self.state.gridInfo[cellId]["view_options"]["view_source"],
                        "fields":self.state.gridInfo[cellId]["fields"],"sampling":sampling,"sampling_period":sampling_period},
                        "title": title == '' ? self.state.gridInfo[cellId]["category"] : title, "cellId":cellId};
            this.socket.emit('fromclient', data);
            var contents = <Loader active>Loading...</Loader>;
            ReactDOM.render(contents, self.refs[cellId]);
        }
    },
    handleDragLeave : function(e) {
        if(this.temp) {
            this.temp.style.display = 'none';
        }
    },
    handleDragOver : function(index,e) {
        this.gridId = index;
    },
    handleDragMove : function(e){
        if(this.isDragging && this.temp) {
            this.temp.style.display = "block";
            this.temp.style.top = e.pageY + 'px';
            this.temp.style.left = e.pageX + 'px';
        }
    },
    handleDragEnd : function(e) {
        var self = this;
        if(this.gridId && this.gridId != 0 && this.isDragging) {
            var cellId = "cell_"+this.gridId;
            if(this.state.gridInfo[cellId]) {
                if(this.state.gridInfo[cellId]["repeatInterval"]){
                    clearInterval(this.state.gridInfo[cellId]["repeatInterval"]);
                }
                if(this.refs[cellId] && this.refs[cellId].children.length > 0) {
                    this.refs[cellId].children[0].remove();
                }
            }
            this.state.gridInfo[cellId] = this.draggingData;
            if (this.state.activeItem != 'video') {
                var data = {"broadcast":false,"target":"view", "method":"execute", "parameters":{"name":this.state.gridInfo[cellId].name}, "cellId":cellId};
                this.socket.emit('fromclient', data);
                var contents = <Loader active>Loading...</Loader>;
                ReactDOM.render(contents, self.refs[cellId]);
            } else {
                var viewInfo = this.state.viewlist.find(function(d){
                    return d.name == self.state.gridInfo[cellId].name;
                });
                let view_source = viewInfo["view_options"]["view_source"];
                let src = this.validateURL(view_source) ? view_source : "/video/" + view_source;
                var contents = <video key={'video'} style={{height:'100%',width:'100%'}} src={src} controls/>
                ReactDOM.render(contents, self.refs[cellId]);
            }
        }
        this.setState(this.state);
        $(this.temp).detach();
        this.isDragging = false;
    },
    handleDragStart : function(data,e) {
        var contents = document.getElementById('contents');
        this.isDragging = true, this.draggingData = data;
        this.temp = document.createElement("ul");
        this.temp.innerText = data.name;
        this.temp.style.zIndex = 9999;
        this.temp.style.position = 'absolute';
        this.temp.style.top = e.pageX;
        this.temp.style.left = e.pageY;
        this.temp.style.display = "none";
        contents.appendChild(this.temp);
        e.preventDefault();
    },
    handleGridLayout : function(e) {
        for(var i = 1; i < 10; i++) {
            let cellId = 'cell_'+ i;
            if(this.refs[cellId] && this.refs[cellId].children.length > 0) {
                this.refs[cellId].children[0].remove();
                if(this.state.gridInfo[cellId] && this.state.gridInfo[cellId]["repeatInterval"]) clearInterval(this.state.gridInfo[cellId]["repeatInterval"]);
            }
        }
        if(e.target.innerText == 'FIRST GRID') {
            this.setState({gridType: 1});
        } else if(e.target.innerText == 'SECOND GRID') {
            this.setState({gridType: 2});
        } else if(e.target.innerText == 'THIRD GRID') {
            this.setState({gridType: 3});
        }
        if(this.state.contextVisible) this.setState({contextVisible: false});
    },
    handleGridClick : function(e) {
        if(this.state.contextVisible) this.setState({contextVisible: false});
    },
    handleGridContextMenu : function(e) {
        e.preventDefault();
        this.refs.contextMenu.style.left = e.pageX + "px";
        this.refs.contextMenu.style.top = e.pageY + "px";
        if(!this.state.contextVisible) this.setState({contextVisible: true});
    },
    handleItemClick : function (e, {name}) {
        var itemName = name;
        if(this.state.activeItem == name) {
            if(this.$ViewList.css("margin-left") == "-600px") {
                this.$ViewList.animate({"margin-left": '+=600'});
            } else {
                this.$ViewList.animate({"margin-left": '-=600'});
            }
        } else {
            if(this.$ViewList.css("margin-left") == "-600px") {
                this.$ViewList.animate({"margin-left": '+=600'});
            } else {
                this.$ViewList.animate({"margin-left": '-=600'});
                this.$ViewList.animate({"margin-left": '+=600'});
            }
            this.setState({activeItem:itemName});
        }
    },
    callbackDataView : function(result) {
        var self = this;
        var cellId = "cell_"+ this.gridId;
        if(result.action == 'repeat_on') {
            self.state.gridInfo[cellId]["repeatInterval"] = setInterval(function(){
                var data = {"protocol":"http", "broadcast":false,"target":"view", "method":"execute", "parameters":{"name":self.state.gridInfo[cellId]["name"],member_id:sessionStorage.member_id},"cellId":cellId};
                self.socket.emit('fromclient', data);
            },10000)
        } else if (result.action == 'repeat_off') {
            clearInterval(self.state.gridInfo[cellId]["repeatInterval"]);
        } else if (result.action == 'download') {
            var data = {"broadcast":false,"target":"view", "method":"download", "parameters":{name:self.state.gridInfo[cellId]["name"],member_id:sessionStorage.member_id}};
            self.socket.emit('fromclient', data);
        } else if (result.action == 'doubleclick') {
            let options = [];
            _.each(result.data, function(value,key){
                options.push({text:value,value:value});
            });
            this.refs.ModalForm.state.fields[0].options = options;
            this.refs.ModalForm.state.data["title"] = result.data.category;
            self.state.gridInfo[cellId]["category"] = result.data.category;
            self.state.gridInfo[cellId]["fields"] = result.data;
            this.refs.ModalForm.setState({active:true,action:cellId});
        } else if (result.action == 'return_item') {
            var data = {"broadcast":false,"target":"view", "method":"execute", "parameters":{"name":this.state.gridInfo[cellId].name}, "cellId":cellId};
            this.socket.emit('fromclient', data);
            var contents = <Loader active>Loading...</Loader>;
            ReactDOM.render(contents, self.refs[cellId]);
        }
    },
    saveFile : function (blob) {
        var cellId = "cell_"+ this.gridId;
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.state.gridInfo[cellId]["name"] + ".csv";
        link.click();
    },
    validateURL : function (textval) {
        var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        return urlregex.test(textval);
    }
});
