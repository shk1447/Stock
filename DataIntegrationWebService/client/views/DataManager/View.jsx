var React = require('react');
var io = require('socket.io-client');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');

module.exports = React.createClass({
    displayName: 'View',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket = io.connect();
        self.socket.on('view.schema',function(data){
            self.refs.ViewTable.setState({fields:data})
            var data = {"broadcast":false,"target":"view.getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
        self.socket.on('view.getlist', function(data) {
            self.refs.ViewTable.setState({data:data})
        });
        self.socket.on('view.create', function(data) {
            if(data.code == "200") {
                self.refs.ViewTable.setState({active:false});
                var data = {"broadcast":true,"target":"view.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE VIEW)',message:data.message, active : true})
            }
        });
        self.socket.on('view.modify', function(data) {
            if(data.code == "200") {
                self.refs.ViewTable.setState({active:false});
                var data = {"broadcast":true,"target":"view.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY VIEW)',message:data.message, active : true})
            }
        });

        var data = {"broadcast":false,"target":"view.schema", "parameters":{}};
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
                <DataTable ref='ViewTable' key={'view'} data={data} fields={fields} filters={filters} updatable callback={this.callbackView}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackView: function (result) {
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"view.create", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"view.modify", "parameters":result.data};
            this.socket.emit('fromclient', data);
        }
    }
});