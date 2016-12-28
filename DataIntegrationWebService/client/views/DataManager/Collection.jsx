var React = require('react');
var io = require('socket.io-client');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');

module.exports = React.createClass({
    displayName: 'Collection',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket.on('collection.schema',function(data){
            self.refs.CollectionTable.setState({fields:data})
            var data = {"broadcast":false,"target":"collection", "method":"getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
        self.socket.on('collection.getlist', function(data) {
            self.refs.CollectionTable.setState({data:data.result})
        });
        self.socket.on('collection.create', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE COLLECTION)',message:data.message, active : true})
            }
        });
        self.socket.on('collection.modify', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY COLLECTION)',message:data.message, active : true})
            }
        });
        self.socket.on('collection.delete', function(data) {
            if(data.code == "200") {
                var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE COLLECTION)',message:data.message, active : true})
            }
        });
        self.socket.on('collection.execute', function(data) {
            var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });

        self.socket.on('connected', function() {
            var data = {"broadcast":false,"target":"collection", "method":"schema", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        this.socket = io.connect();
		return {data:[],fields:[],filters:[]};
	},
    render : function () {
        const {data,fields,filters} = this.state;
        return (
            <div style={{height:document.documentElement.offsetHeight - 200 + 'px',width:document.documentElement.offsetWidth + 'px'}}>
                <DataTable ref='CollectionTable' key={'collection'} data={data} fields={fields} filters={filters} updatable repeatable={false}
                           executeItem={this.executeCollection} callback={this.callbackCollection}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackCollection: function (result) {
        var self = this;
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"collection", "method":"create", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"collection", "method":"modify", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.CollectionTable.refs.DataArea.state.selectedItems;
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"collection", "method":"delete", "parameters":{name:row.name}};
                self.socket.emit('fromclient', data);
            });
        }
    },
    executeCollection : function(item) {
        var data = {"broadcast":false,"target":"collection", "method":"execute", "parameters":{name:item.name,command:item.status == 'stop' ? 'start':'stop'}};
        this.socket.emit('fromclient', data);
        console.log(item);
    }
});