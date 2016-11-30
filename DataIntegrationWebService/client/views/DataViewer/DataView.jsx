var React = require('react');
var io = require('socket.io-client');
var {Menu,Icon,Dropdown} = require('stardust');
var {List} = require('semantic-ui-react');
var DataTable = require('../Common/DataTable');
var Chart = require('../Common/Chart');

module.exports = React.createClass({
    isDragging: false,
    displayName: 'DataView',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        this.$ViewList = $(ReactDOM.findDOMNode(this.refs.ViewList));
        
        self.socket = io.connect();
        self.socket.on('view.getlist', function(data) {
            self.setState({viewlist:data});
        });
        self.socket.on('view.execute', function(response) {
            var contentId = 'contents' + self.gridId;
            self.refs[contentId].setState({title:self.state.currentView.name, data:response.data,fields: response.fields});
        });
        self.socket.on('view.execute_item', function(response) {
            var contentId = 'contents' + self.gridId;
            self.setState({activeItem:'past'});
            self.refs[contentId].setState({title:self.state.currentView.name, data:response.data,fields: response.fields});
        });
        self.socket.on('view.download', function(response) {
            var dataView = new DataView(response);
            var blob = new Blob([dataView]);
            self.saveFile(blob);
        });
        var data = {"broadcast":false,"target":"view.getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
        self.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {activeItem : '',viewlist:[], data:[],fields:[],currentView:{},contextVisible:false,gridType:1,contents:{}};
	},
    render : function () {
        console.log('render data view');
        var self = this;
        const { activeItem, viewlist, gridType, contents } = this.state;
        let viewArr = [];
        _.each(viewlist, function(row,i){
            if(row.view_type == activeItem) {
                let icon = row.view_type == "current" ? "table" : row.view_type == "past" ? "line chart" : "file video outline";
                var item = <List.Item key={i} onClick={self.executeItem.bind(self,row)} onMouseDown={self.handleDragStart.bind(self,row)}>
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
        var gridHeight = document.documentElement.offsetHeight - 150;
        var gridWidth = document.documentElement.offsetWidth - 70;
        switch(gridType) {
            case 1 : {
                gridArr.push(<div ref='cell_1' key={gridArr.length} className='GridCell' onMouseEnter={self.handleDragEnter.bind(self, 1)}
                                  style={{position:'absolute',height: gridHeight + 'px',width: gridWidth + 'px'}}>
                    {contents[1]}
                </div>);
                break;
            }
            case 2 : {
                let indexKey = 1;
                for(var x = 0; x < 2; x++) {
                    for(var y = 0; y < 2; y++) {
                        var cellId = 'cell_' + indexKey;
                        gridArr.push(<div ref={cellId}  key={gridArr.length} className='GridCell' onMouseEnter={self.handleDragEnter.bind(self, indexKey)}
                                          style={{position:'absolute',top:y*gridHeight/2+'px',left:x*gridWidth/2+'px', height:gridHeight/2 + 'px',width:gridWidth/2 + 'px'}}>
                            {contents[indexKey]}
                        </div>);
                        indexKey++;
                    }
                }
                break;
            }
            case 3 : {
                gridArr.push(<div ref='cell_1' key={0} className='GridCell' onMouseEnter={self.handleDragEnter.bind(self, 1)}
                                  style={{position:'absolute',top:'0px',left:'0px', height:gridHeight*2/3 + 'px',width:gridWidth + 'px'}}>
                                {contents[1]}
                            </div>);
                gridArr.push(<div ref='cell_2' key={1} className='GridCell' onMouseEnter={self.handleDragEnter.bind(self, 2)}
                                  style={{position:'absolute',top:gridHeight*2/3+'px',left:'0px', height:gridHeight/3 + 'px',width:gridWidth/2 + 'px'}}>
                                {contents[2]}
                            </div>);
                gridArr.push(<div ref='cell_3' key={2} className='GridCell' onMouseEnter={self.handleDragEnter.bind(self, 3)}
                                  style={{position:'absolute',top:gridHeight*2/3+'px',left:gridWidth/2+'px', height:gridHeight/3 + 'px',width:gridWidth/2 + 'px'}}>
                                {contents[3]}
                            </div>);
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
            </div>
        )
    },
    handleDragLeave : function(e) {
        if(this.temp) {
            this.gridId = 0;
            this.temp.style.display = 'none';
        }
    },
    handleDragEnter : function(index,e) {
        this.gridId = index;
        console.log(index);
        console.log("drag cell enter")
    },
    handleDragMove : function(e){
        if(this.isDragging && this.temp) {
            this.temp.style.display = "block";
            this.temp.style.top = e.pageY + 'px';
            this.temp.style.left = e.pageX + 'px';
        }
    },
    handleDragEnd : function(e) {
        $(this.temp).detach();
        this.isDragging = false;
        if(this.gridId && this.gridId != 0) {
            this.state.currentView = this.draggingData;
            let contentId = 'contents' + this.gridId; 
            if(this.state.activeItem == 'past') {
                var contents = <Chart ref={contentId} key={'dataview_past'} title={this.state.currentView["name"]} data={this.state.data} fields={this.state.fields} action={this.callbackDataView} />;
            } else if(this.state.activeItem =='current') {
                var contents = <DataTable ref={contentId} key={'dataview_current'} title={'DataView'} data={this.state.data}
                                            fields={this.state.fields} searchable callback={this.callbackDataView}/>;
            } else if(this.state.activeItem == 'video') {
                var contents = <video ref={contentId} style={{height:'100%',width:'100%'}} controls/>
            }
            this.state.contents[this.gridId] = contents;
            if (this.state.activeItem != 'video') {
                var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":this.draggingData.name}};
                this.socket.emit('fromclient', data);
            } else {
                var viewInfo = this.state.viewlist.find(function(d){
                    return d.name == this.draggingData.name;
                });
                var video = ReactDOM.findDOMNode(this.refs.contents);
                video.src = this.validateURL(viewInfo.view_query) ? viewInfo.view_query : "/video/" + viewInfo.view_query;
            }
        }
    },
    handleDragStart : function(data,e) {
        var contents = document.getElementById('contents');
        this.isDragging = true;
        this.draggingData = data;
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
        if(result.action == 'repeat_on') {
            if(self.state.currentView != '') {
                self.repeatInterval = setInterval(function(){
                    var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":self.state.currentView.name,member_id:sessionStorage.member_id}};
                    self.socket.emit('fromclient', data);
                },1000)
            }
        } else if (result.action == 'repeat_off') {
            clearInterval(self.repeatInterval);
        } else if (result.action == 'download') {
            var data = {"broadcast":false,"target":"view.download", "parameters":{name:self.state.currentView.name,member_id:sessionStorage.member_id}};
            self.socket.emit('fromclient', data);
        } else if (result.action == 'doubleclick') {
            var data = {"broadcast":false,"target":"view.execute_item", "parameters":{"source":self.state.currentView["view_options"]["view_source"], "fields":result.data}};
            this.socket.emit('fromclient', data);
        }
    },
    executeItem : function(value) {
        if(activeItem == 'past') {
            var contents = <Chart ref='contents' key={'dataview_past'} title={this.state.currentView["name"]} data={this.state.data} fields={this.state.fields} action={this.callbackDataView} />;
        } else if(activeItem =='current') {
            var contents = <DataTable ref='contents' key={'dataview_current'} title={'DataView'} data={this.state.data}
                                        fields={this.state.fields} filters={filters} searchable callback={this.callbackDataView}/>;
        } else if(activeItem == 'video') {
            var contents = <video ref='contents' style={{height:'100%',width:'100%'}} controls/>
        }
    },
    saveFile : function (blob) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.state.currentView.name + ".csv";
        link.click();
    },
    validateURL : function (textval) {
        var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        return urlregex.test(textval);
    }
});