var React = require('react');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var connector = require('../../libs/connector/WebSocketClient.js')

module.exports = React.createClass({
    displayName: 'Analysis',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        connector.on('analysis.schema',function(data){
            self.refs.AnalysisTable.setState({fields:data})
            var data = {"broadcast":false,"target":"analysis", "method":"getlist", "parameters":{}};
            connector.emit('fromclient', data);
        });
        connector.on('analysis.getlist', function(data) {
            self.refs.AnalysisTable.setState({data:data.result});
            self.refs.loader.setState({active:false});
        });
        connector.on('analysis.create', function(data) {
            if(data.code == "200") {
                self.refs.AnalysisTable.setState({active:false});
                // var data = {"broadcast":true,"target":"analysis", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE ANALYSIS)',message:data.message, active : true})
            }
        });
        connector.on('analysis.modify', function(data) {
            if(data.code == "200") {
                self.refs.AnalysisTable.setState({active:false});
                // var data = {"broadcast":true,"target":"analysis", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY ANALYSIS)',message:data.message, active : true})
            }
        });
        connector.on('analysis.delete', function(data) {
            if(data.code == "200") {
                // var data = {"broadcast":true,"target":"analysis", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE ANALYSIS)',message:data.message, active : true})
            }
        });
        connector.on('analysis.execute', function(data) {
            // var data = {"broadcast":true,"target":"analysis", "method":"getlist", "parameters":{}};
            // connector.emit('fromclient', data);
            self.refs.loader.setState({active:true});
        });

        var data = {"broadcast":false,"target":"analysis", "method":"schema", "parameters":{}};
        connector.emit('fromclient', data);
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {data:[],fields:[],filters:[]};
	},
    render : function () {
        const {data,fields,filters} = this.state;
        return (
            <div style={{height:document.documentElement.offsetHeight - 77 + 'px',width:document.documentElement.offsetWidth + 'px'}}>
                <Loader ref='loader' active={true}/>
                <DataTable ref='AnalysisTable' key={'analysis'} data={data} fields={fields} filters={filters} repeatable={false}
                           executeItem={this.executeAnalysis} updatable callback={this.callbackAnalysis}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackAnalysis : function(result) {
        var self = this;
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"analysis", "method":"create", "parameters":result.data};
            connector.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"analysis", "method":"modify", "parameters":result.data};
            connector.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.AnalysisTable.refs.DataArea.state.selectedItems;
            var $dataArea = $(ReactDOM.findDOMNode(this.refs.AnalysisTable.refs.DataArea.refs.table_contents));
            _.forEach($dataArea.find('tbody').children('[class=selected]'),function(row,value) {$(row).attr('class','');});
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"analysis", "method":"delete", "parameters":{name:row.name}};
                connector.emit('fromclient', data);
            });
        }
    },
    executeAnalysis : function(item) {
        var data = {"broadcast":false,"target":"analysis", "method":"execute", "parameters":{name:item.name,command:item.status == 'stop' ? 'start':'stop'}};
        connector.emit('fromclient', data);
    }
});