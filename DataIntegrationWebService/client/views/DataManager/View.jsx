var React = require('react');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var connector = require('../../libs/connector/WebSocketClient.js')

module.exports = React.createClass({
    displayName: 'View',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        connector.socket.on('view.schema',function(data){
            self.refs.ViewTable.setState({fields:data})
            var data = {"broadcast":false,"target":"view", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
            connector.socket.emit('fromclient', data);
        });
        connector.socket.on('view.getlist', function(data) {
            self.refs.ViewTable.setState({data:data});
            self.refs.loader.setState({active:false});
        });
        connector.socket.on('view.create', function(data) {
            if(data.code == "200") {
                self.refs.ViewTable.setState({active:false});
                var data = {"broadcast":false,"target":"view", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE VIEW)',message:data.message, active : true})
            }
        });
        connector.socket.on('view.modify', function(data) {
            if(data.code == "200") {
                self.refs.ViewTable.setState({active:false});
                var data = {"broadcast":false,"target":"view", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY VIEW)',message:data.message, active : true})
            }
        });
        connector.socket.on('view.delete', function(data){
            if(data.code == "200") {
                var data = {"broadcast":false,"target":"view", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE VIEW)',message:data.message, active : true})
            }
        });
        var data = {"broadcast":false,"target":"view", "method":"schema", "parameters":{privilege:sessionStorage['privilege']}};
        connector.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        connector.socket.off('view.delete').off('view.create').off('view.modify').off('view.schema').off('view.getlist');
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {data:[],fields:[],filters:[],init:false};
	},
    render : function () {
        const {data,fields,filters} = this.state;
        
        return (
            <div style={{height:document.documentElement.offsetHeight - 77 + 'px',width:document.documentElement.offsetWidth + 'px'}}>
                <Loader ref='loader' active={true}/>
                <DataTable ref='ViewTable' key={'view'} data={data} fields={fields} filters={filters} updatable repeatable={false} callback={this.callbackView}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackView: function (result) {
        var self = this;
        if(result.action == 'insert') {
            result.data["member_id"] = sessionStorage.member_id;
            var data = {"broadcast":false,"target":"view", "method":"create", "parameters":result.data};
            connector.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            result.data["member_id"] = sessionStorage.member_id;
            var data = {"broadcast":false,"target":"view", "method":"modify", "parameters":result.data};
            connector.socket.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.ViewTable.refs.DataArea.state.selectedItems;
            var $dataArea = $(ReactDOM.findDOMNode(this.refs.ViewTable.refs.DataArea.refs.table_contents));
            _.forEach($dataArea.find('tbody').children('[class=selected]'),function(row,value) {$(row).attr('class','');});
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"view", "method":"delete", "parameters":{name:row.name,member_id:sessionStorage.member_id}};
                connector.socket.emit('fromclient', data);
            });
        }
    }
});