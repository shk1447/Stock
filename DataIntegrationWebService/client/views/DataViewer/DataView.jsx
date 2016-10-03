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
        var hh = [{
                input:"shkim",
                select:'first',
                multiselect:['first','second'],
                textarea:'hohohoho',
                checkbox:{ value : 'first', checked : true },
                groupcheckbox : [{value:'fisrt',checked:true},{value:'second',checked:true}],
                radio:{ value : 'second', checked : true },
                timepicker:'11:00'
            }];
        for(var i = 0; i < 100; i++) {
            hh.push({
                input:"tester" + i.toString(),
                select:'first',
                multiselect:['second'],
                textarea:'hohohoho',
                checkbox:{ value : 'first', checked : true },
                groupcheckbox : [{value:'fisrt',checked:true},{value:'second',checked:true}],
                radio:{ value : 'second', checked : true },
                timepicker:'11:00'
            });
        }
        const fields = [
            {value:'input', text:"INPUT", type:'Input', required:true, group:1},
            {group:1},
            {value:'select', text:"SELECT", type:'Select', options:[{value:'first',text:'첫번째'},{value:'second',text:'두번째'}], group:2},
            {value:'multiselect', text:"MULTI SELECT", type:"MultiSelect", options:[{value:'first',text:'첫번째'},{value:'second',text:'두번째'}],group:3},
            {value:'textarea', text:"TEXT AREA",type:'TextArea', group:4},
            {value:'checkbox', text:"CHECK BOX", type:'Checkbox', group:5},
            {value:'groupcheckbox', text:'GROUP CHECK BOX', type:'GroupCheckbox', options:[{value:'first',text:'첫번째'},{value:'second',text:'두번째'}],group:6},
            {value:'radio', text:'RADIO', type:'Radio', options:[{value:'first',text:'첫번째'},{value:'second',text:'두번째'}],group:7},
            {value:'timepicker',text:'TIME PICKER',type:'TimePicker',group:8},
            {value:'dynamic', text:"DYNAMIC", type:"Dynamic",group:9}
        ];
		return {data : hh, fields:fields};
	},
    render : function () {
        console.log('render data view');
        const { data, fields } = this.state;
        const filters = [];
        return (
            <div style={{height:'850px'}}>
                <DataTable key={'dataview'} title={'DataView'} data={data} fields={fields} filters={filters}  searchable callback={this.getData}/>
            </div>
        )
    },
    getData : function(result) {
        console.log('result : ', result);
    },
    handleSelectRow : function(e,d){

    }
});