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
            //var data = {"broadcast":false,"target":"collection.getlist", "parameters":{}};
            //self.socket.emit('fromclient', data);
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
                <DataTable ref='AnalysisTable' key={'analysis'} data={data} fields={fields} filters={filters} updatable callback={this.callbackAnalysis}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackAnalysis : function(data) {

    }
});