var React = require('react');
var io = require('socket.io-client');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');

module.exports = React.createClass({
    displayName: 'Analysis',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket = io.connect();
        self.socket.on('analysis.schema',function(data){
            self.refs.AnalysisTable.setState({fields:data})
            var data = {"broadcast":false,"target":"analysis.getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
        self.socket.on('analysis.getlist', function(data) {
            self.refs.AnalysisTable.setState({data:data.result})
        });
        self.socket.on('analysis.create', function(data) {
            if(data.code == "200") {
                self.refs.AnalysisTable.setState({active:false});
                var data = {"broadcast":true,"target":"analysis.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE ANALYSIS)',message:data.message, active : true})
            }
        });
        self.socket.on('analysis.modify', function(data) {
            if(data.code == "200") {
                self.refs.AnalysisTable.setState({active:false});
                var data = {"broadcast":true,"target":"analysis.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY ANALYSIS)',message:data.message, active : true})
            }
        });
        self.socket.on('analysis.delete', function(data) {
            if(data.code == "200") {
                var data = {"broadcast":true,"target":"analysis.getlist", "parameters":{}};
                self.socket.emit('fromclient', data);
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE ANALYSIS)',message:data.message, active : true})
            }
        });
        self.socket.on('analysis.execute', function(data) {
            var data = {"broadcast":true,"target":"analysis.getlist", "parameters":{}};
            self.socket.emit('fromclient', data);
        });

        var data = {"broadcast":false,"target":"analysis.schema", "parameters":{}};
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
                <DataTable ref='AnalysisTable' key={'analysis'} data={data} fields={fields} filters={filters} executeItem={this.executeAnalysis} updatable callback={this.callbackAnalysis}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackAnalysis : function(result) {
        var self = this;
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"analysis.create", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"analysis.modify", "parameters":result.data};
            this.socket.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.AnalysisTable.refs.DataArea.state.selectedItems;
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"analysis.delete", "parameters":{name:row.name}};
                self.socket.emit('fromclient', data);
            });
        }
    },
    executeAnalysis : function(item) {
        var data = {"broadcast":false,"target":"analysis.execute", "parameters":{name:item.name,command:item.status == 'stop' ? 'start':'stop'}};
        this.socket.emit('fromclient', data);
    }
});