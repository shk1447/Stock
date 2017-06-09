var React = require('react');
var {Form} = require('stardust');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var connector = require('../../libs/connector/WebSocketClient.js')

module.exports = React.createClass({
    displayName: 'Collection',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        connector.on('collection.schema',function(data){
            self.refs.CollectionTable.setState({fields:data})
            var data = {"broadcast":false,"target":"collection", "method":"getlist", "parameters":{}};
            connector.emit('fromclient', data);
        });
        connector.on('collection.getlist', function(data) {
            self.refs.CollectionTable.setState({data:data.result});
            self.refs.loader.setState({active:false});
        });
        connector.on('collection.create', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                // var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                // self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE COLLECTION)',message:data.message, active : true})
            }
        });
        connector.on('collection.modify', function(data) {
            if(data.code == "200") {
                self.refs.CollectionTable.setState({active:false});
                // var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                // self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (MODIFY COLLECTION)',message:data.message, active : true})
            }
        });
        connector.on('collection.delete', function(data) {
            if(data.code == "200") {
                // var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                // connector.emit('fromclient', data);
                // self.refs.loader.setState({active:true});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (DELETE COLLECTION)',message:data.message, active : true})
            }
        });
        connector.on('collection.execute', function(data) {
            // var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
            // connector.emit('fromclient', data);
            self.refs.loader.setState({active:true});
        });

        var data = {"broadcast":false,"target":"collection", "method":"schema", "parameters":{}};
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
            connector.emit('fromclient', data);
        } else if (result.action == 'update') {
            var data = {"broadcast":false,"target":"collection", "method":"modify", "parameters":result.data};
            connector.emit('fromclient', data);
        } else if (result.action == 'delete') {
            var selectedItems = this.refs.CollectionTable.refs.DataArea.state.selectedItems;
            var $dataArea = $(ReactDOM.findDOMNode(this.refs.CollectionTable.refs.DataArea.refs.table_contents));
            _.forEach($dataArea.find('tbody').children('[class=selected]'),function(row,value) {console.log($(row).attr('class',''));});
            _.each(selectedItems, function(row, i){
                var data = {"broadcast":false,"target":"collection", "method":"delete", "parameters":{name:row.name}};
                connector.emit('fromclient', data);
            });
        }
    },
    executeCollection : function(item) {
        var data = {"broadcast":false,"target":"collection", "method":"execute", "parameters":{name:item.name,command:item.status == 'stop' ? 'start':'stop'}};
        connector.emit('fromclient', data);
    }
});