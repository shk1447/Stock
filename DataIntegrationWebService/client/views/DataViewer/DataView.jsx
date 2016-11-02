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
        var data = {"broadcast":true,"target":"view.getlist", "parameters":{}};
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
                let icon = row.view_type == "current" ? "table" : "line chart"
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
            var contents = <Chart ref='contents' key={'dataview_past'} title={this.state.currentView} data={this.state.data} fields={this.state.fields} />;
        } else if(activeItem =='current') {
            var contents = <DataTable ref='contents' key={'dataview_current'} title={'DataView'} data={this.state.data}
                                        fields={this.state.fields} filters={filters} searchable callback={this.callbackDataView}/>;
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
        }
        this.setState({activeItem:itemName});
    },
    callbackDataView : function(result) {
        var self = this;
        if(result.action == 'repeat_on') {
            if(self.state.currentView != '') {
                self.repeatInterval = setInterval(function(){
                    var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":self.state.currentView}};
                    self.socket.emit('fromclient', data);
                },1000)
            }
        } else if(result.action == 'repeat_off') {
            clearInterval(self.repeatInterval);
        }
    },
    handleSelectRow : function(e,d){

    },
    executeItem : function(value) {
        this.state.currentView = value;
        var data = {"broadcast":false,"target":"view.execute", "parameters":{"name":value}};
        this.socket.emit('fromclient', data);
    }
});