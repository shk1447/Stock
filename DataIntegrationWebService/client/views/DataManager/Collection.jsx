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
        self.socket = io.connect();
        self.socket.on('collection.schema',function(data){
            self.refs.CollectionTable.setState({fields:data})
            var data = {"broadcast":false,"target":"collection.getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
        self.socket.on('collection.getlist', function(data) {
            self.refs.CollectionTable.setState({data:data})
        });
        self.socket.on('collection.create', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                var data = {"broadcast":true,"target":"collection.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE MEMBER)',message:data.message, active : true})
            }
        });
        self.socket.on('collection.modify', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                var data = {"broadcast":true,"target":"collection.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE MEMBER)',message:data.message, active : true})
            }
        });

        var data = {"broadcast":false,"target":"collection.schema", "parameters":{}};
        self.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {data:[],fields:[],filters:[]};
	},
    render : function () {
        const {data,fields,filters} = this.state;
        return (
            <div style={{height:'850px'}}>
                <DataTable ref='CollectionTable' key={'collection'} data={data} fields={fields} filters={filters} updatable executeItem={this.executeCollection} callback={this.callbackCollection}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackCollection: function (result) {
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"collection.create", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"collection.modify", "parameters":result.data};
            this.socket.emit('fromclient', data);
        }
    },
    executeCollection : function(item) {
        console.log(item);
    }
});