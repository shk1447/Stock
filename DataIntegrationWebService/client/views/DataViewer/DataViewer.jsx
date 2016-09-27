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
            address:'서울시 동작구',
            age:10
        },{
            name:"shkim",
            phone:'01057721447',
            address:'서울시 동작구',
            age:12
        },{
            name:"shkim",
            phone:'01057721447',
            address:'서울시 동작구',
            age:14
        }]
        const fields = [
            {value:'name', text:"이름"},
            {value:'phone', text:"전화번호"},
            {value:'address', text:"주소"},
            {value:'age', text:"나이"},
            {value:'age2', text:"나이2"},
            {value:'age3', text:"나이3"},
            {value:'age4', text:"나이4"},
        ];
		return {data : hh, fields:fields};
	},
    render : function () {
        console.log('render data view');
        const { data, fields } = this.state;
        return (
            <div style={{height:'800px'}}>
                <DataTable key={'dataview'} data={data} fields={fields} updatable={true} selectable={true}/>
            </div>
        )
    },
    handleSelectRow : function(e,d){

    }
});