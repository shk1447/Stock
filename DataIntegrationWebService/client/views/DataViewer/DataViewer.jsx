var React = require('react');
var io = require('socket.io-client');
var { Table } = require('stardust');
var DataTable = require('../Common/DataTable');

module.exports = React.createClass({
    displayName: 'DataViewer',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        const hh = [{
            name:"shkim",
            phone:'01057721447',
            address:'서울시 동작구'
        },{
            name:"shkim",
            phone:'01057721447',
            address:'서울시 동작구'
        },{
            name:"shkim",
            phone:'01057721447',
            address:'서울시 동작구'
        }]
        const fields = [
            {key:'name', text:"이름"},
            {key:'phone', text:"전화번호"},
            {key:'address', text:"주소"}
        ];
		return {data : hh, fields:fields};
	},
    render : function () {
        console.log('render data view');
        const { data, fields } = this.state;
        return (
            <div style={{height:'800px'}}>
                <DataTable data={data} fields={fields} updatable={false} selectable={true}/>
            </div>
        )
    },
    handleSelectRow : function(e,d){

    }
});