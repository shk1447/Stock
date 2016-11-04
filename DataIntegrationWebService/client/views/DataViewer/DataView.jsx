var React = require('react');
var io = require('socket.io-client');
var {Menu,Icon} = require('stardust');
var {List} = require('semantic-ui-react');
var DataTable = require('../Common/DataTable');
var Chart = require('../Common/Chart');

module.exports = React.createClass({
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
            self.refs.contents.setState({title:self.state.currentView, data:response.data,fields: response.fields})
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
		return {activeItem : '',viewlist:[], data:[],fields:[],currentView:''};
	},
    render : function () {
        console.log('render data view');
        var self = this;
        const { activeItem, viewlist } = this.state;
        let viewArr = [];
        _.each(viewlist, function(row,i){
            if(row.view_type == activeItem) {
                let icon = row.view_type == "current" ? "table" : row.view_type == "past" ? "line chart" : "file video outline";
                var item = <List.Item key={i} onClick={self.executeItem.bind(self,row.name)}>
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
        if(activeItem == 'past') {
            var contents = <Chart ref='contents' key={'dataview_past'} title={this.state.currentView} data={this.state.data} fields={this.state.fields} action={this.callbackDataView} />;
        } else if(activeItem =='current') {
            var contents = <DataTable ref='contents' key={'dataview_current'} title={'DataView'} data={this.state.data}
                                        fields={this.state.fields} filters={filters} searchable callback={this.callbackDataView}/>;
        } else if(activeItem == 'video') {
            var contents = <video ref='contents' style={{height:'100%',width:'100%'}} controls/>
        }
        return (
            <div>
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
                <div style={{position:'absolute', left:'60px'}}>
                    <div style={{height:document.documentElement.offsetHeight - 200 + 'px',float:'left',width:document.documentElement.offsetWidth - 70 + 'px'}}>
                        {contents}
                    </div>
                </div>
            </div>
        )
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
                    var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":self.state.currentView,member_id:sessionStorage.member_id}};
                    self.socket.emit('fromclient', data);
                },1000)
            }
        } else if (result.action == 'repeat_off') {
            clearInterval(self.repeatInterval);
        } else if (result.action == 'download') {
            var data = {"broadcast":false,"target":"view.download", "parameters":{name:self.state.currentView,member_id:sessionStorage.member_id}};
            self.socket.emit('fromclient', data);
        }
    },
    executeItem : function(value) {
        this.state.currentView = value;
        if(this.state.activeItem != 'video') {
            var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":value}};
            this.socket.emit('fromclient', data);
        } else {
            var viewInfo = this.state.viewlist.find(function(d){
                return d.name == value;
            });
            var video = ReactDOM.findDOMNode(this.refs.contents);
            video.src = this.validateURL(viewInfo.view_query) ? viewInfo.view_query : "/video/" + viewInfo.view_query;
        }
    },
    saveFile : function (blob) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.state.currentView + ".csv";
        link.click();
    },
    validateURL : function (textval) {
        var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        return urlregex.test(textval);
    }
});