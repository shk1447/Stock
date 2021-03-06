var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var connector = require('../../libs/connector/WebSocketClient.js')

module.exports = React.createClass({
    displayName: 'Input',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        connector.socket.on('input.getlist', function(data) {
            self.refs.InputTable.setState({data:data});
            self.refs.loader.setState({active:false});
        });
        connector.socket.on('input.create', function(data) {
            if(data.code == "200") {
                self.refs.InputTable.setState({active:false});
                var data = {"broadcast":true,"target":"input", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE COLLECTION)',message:data.message, active : true})
            }
        });
        connector.socket.on('input.modify', function(data) {
            if(data.code == "200") {
                self.refs.InputTable.setState({active:false});
                var data = {"broadcast":true,"target":"input", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY COLLECTION)',message:data.message, active : true})
            }
        });
        connector.socket.on('input.delete', function(data) {
            if(data.code == "200") {
                var data = {"broadcast":true,"target":"input", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
                connector.socket.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE COLLECTION)',message:data.message, active : true})
            }
        });
        var data = {"broadcast":false,"target":"input", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"]}};
        connector.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        connector.socket.off('input.delete').off('input.create').off('input.modify').off('input.getlist');
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        return {data:[],fields:[
            {
                "text": "CATEGORY",
                "value": "category",
                "type": "Text",
                "group": 0,
                "required": true
            },
            {
                "text": "rawdata",
                "value": "rawdata",
                "type": "AddFields",
                "group": 1,
                "required": true
            },
            {
                "text": "UPDATED TIME",
                "value": "unixtime",
                "type": "data",
                "group": 1,
                "required": false
            }
        ],filters:[]};
    },
    render : function () {
        const {data,fields,filters} = this.state;
        
        return (
            <div style={{height:document.documentElement.offsetHeight - 77 + 'px',width:document.documentElement.offsetWidth + 'px'}}>
                <Loader ref='loader' active={true}/>
                <DataTable ref='InputTable' key={'input'} data={data} fields={fields} filters={filters} updatable repeatable={false} callback={this.callbackInput}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackInput : function (result) {
        var self = this;
        if(result.action == 'insert') {
            result.data["member_id"] = sessionStorage["member_id"];
            var data = {"broadcast":false,"target":"input", "method":"create", "parameters":result.data};
            connector.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            result.data["member_id"] = sessionStorage["member_id"];
            var data = {"broadcast":false,"target":"input", "method":"modify", "parameters":result.data};
            connector.socket.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.InputTable.refs.DataArea.state.selectedItems;
            var $dataArea = $(ReactDOM.findDOMNode(this.refs.InputTable.refs.DataArea.refs.table_contents));
            _.forEach($dataArea.find('tbody').children('[class=selected]'),function(row,value) {$(row).attr('class','');});
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"input", "method":"delete", "parameters":{member_id:sessionStorage["member_id"], category:row.category}};
                connector.socket.emit('fromclient', data);
            });
        }
    }
});