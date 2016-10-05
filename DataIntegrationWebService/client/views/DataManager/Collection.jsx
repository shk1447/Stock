var React = require('react');
var io = require('socket.io-client');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');

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
            //self.refs.CollectionTable.setState({data:data})
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
            <div style={{height:'800px'}}>
                <DataTable ref='CollectionTable' key={'collection'} data={data} fields={fields} filters={filters} updatable={false} selectable={true}/>
            </div>
        )
    }
});