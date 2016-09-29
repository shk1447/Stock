var React = require('react');
var io = require('socket.io-client');
var { Table } = require('stardust');
var DataTable = require('../Common/DataTable');

module.exports = React.createClass({
    displayName: 'DataView',
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
            {value:'name', text:"이름", group:1},
            {value:'phone', text:"전화번호", group:1},
            {value:'address', text:"주소", group:1},
            {value:'age', text:"나이", group:2},
            {value:'gender', text:"성별", type:"MultiSelect", options:[{value:'male',text:'남성'},{value:'female',text:'여성'}],group:2},
            {value:'query', text:"SQL QUERY", type:"TextArea",group:3},
            {value:'useSQL', text:"USE SQL", type:"Dynamic",group:4}
        ];
		return {data : hh, fields:fields};
	},
    render : function () {
        console.log('render data view');
        const { data, fields } = this.state;
        const filters = [];
        return (
            <div style={{height:'800px'}}>
                <DataTable key={'dataview'} data={data} fields={fields} filters={filters} updatable={false} selectable={true}/>
            </div>
        )
    },
    handleSelectRow : function(e,d){

    }
});