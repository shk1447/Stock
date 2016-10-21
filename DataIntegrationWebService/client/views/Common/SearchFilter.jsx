var React = require('react');
var io = require('socket.io-client');
var { Button, Select, Input, Dropdown } = require('stardust')
const options = [
            {value:">", text:"초과"},
            {value:"<", text:"미만"},
            {value:">=", text:"이상"},
            {value:"<=", text:"이하"},
            {value:"=", text:"동일"}
        ];

module.exports = React.createClass({
    displayName: 'SearchFilter',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        this['filterInfo'] = {
            target: {
                text:'',
                value:''
            },
            comparison: {
                text:'',
                value:''
            },
            value:''
        };
		return {fields:this.props.fields, filters:this.props.filters};
	},
    render : function () {
        const {fields,filters} = this.state;
        var fieldsOptions = [];
        
        for(var i = 0; i < fields.length; i++) {
            if(fields[i].type && fields[i].type != 'AddFields') {
                fieldsOptions.push({
                    text : fields[i].text,
                    value : fields[i].value
                });
            }
        }
        return (
            <div>
                <div style={{float:'left',padding:'8px'}}>
                    <Dropdown
                        key='filters'
                        className='small'
                        options={filters}
                        search
                        selection
                        fluid
                        multiple
                        allowAdditions
                        additionPosition='top'
                        additionLabel='Search Filters'
                        onAddItem={this.handleAdditionMultiple}
                        onChange={this.handleChangeMultiple}
                    />
                </div>
                <div style={{float:'left',padding:'8px'}}>
                    <Input className='small left icon action' icon='search' onChange={this.changeValue} placeholder='Input Value'>
                        <Select key='target' options={fieldsOptions} defaultValue=''  onChange={this.changeTarget}/>
                        <Select key='comparison' options={options} defaultValue='' onChange={this.changeComparison} />
                        <Button type='submit' onClick={this.addFilter}>Add Filter</Button>
                    </Input>
                </div>
            </div>
        )
    },
    changeTarget: function(e,value){
        this.filterInfo.target.value = value;
        this.filterInfo.target.text = e.target.innerText;
    },
    changeComparison: function(e,value){
        this.filterInfo.comparison.value = value;
        this.filterInfo.comparison.text = e.target.innerText;
    },
    changeValue: function(e){
        this.filterInfo.value = e.target.value;
    },
    addFilter: function(){
        var filter = {
            text:this.filterInfo.target.text + ' ' + this.filterInfo.comparison.value + ' ' + this.filterInfo.value,
            value:this.filterInfo.target.value + ' ' + this.filterInfo.comparison.value + ' ' + this.filterInfo.value
        };
        this.state.filters.push(filter);
        this.setState(this.state.filters);
    },
    handleAdditionMultiple : function(value) {

    },
    handleChangeMultiple: function(e, values) {

    }
});