var React = require('react');
var { Button, Menu, Select, Input, Dropdown } =  require('stardust');
//var $ = require('jQuery');
const options = [
            {value:">", text:"초과"},
            {value:"<", text:"미만"},
            {value:">=", text:"이상"},
            {value:"<=", text:"이하"},
            {value:"=", text:"동일"}
        ]; 
module.exports = React.createClass({
    displayName: 'DataTable',
    componentDidMount : function() {
        this.refs.table_contents_container.style.width = this.refs.table_contents.offsetWidth + 'px';
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
        this.refs.table_contents_container.style.width = this.refs.table_contents.offsetWidth + 'px';
    },
    getInitialState: function() {
		return {fields:this.props.fields, data: this.props.data, updatable:this.props.updatable, selectable:this.props.selectable};
	},
    render : function () {
        const { data, fields, updatable, selectable } = this.state;
        var updateControl = <div style={{float:'right',marginRight:'10px'}}></div>
        if(updatable) {
            updateControl = <div style={{float:'right',marginRight:'10px'}}>
                                <Button.Group basic size='small'>
                                    <Button icon='file' />
                                    <Button icon='save' />
                                    <Button icon='upload' />
                                    <Button icon='download' />
                                </Button.Group>
                            </div>;
        }
        
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%',marginBottom:'10px'}}>
                    <div style={{float:'left',marginLeft:'10px'}}>
                        <Dropdown
                            className='small'
                            options={fields}
                            search
                            selection
                            fluid
                            multiple
                            allowAdditions
                            additionPosition='top'
                            additionLabel=''
                            onAddItem={this.handleAdditionMultiple}
                            onChange={this.handleChangeMultiple}
                        />
                    </div>
                    <div style={{float:'left', marginLeft:'5px'}}>
                        <Input className='small left icon action' icon='search' placeholder='Input Value'>
                            <Select compact options={options} defaultValue='=' />
                            <Select compact options={fields} defaultValue='field01' />
                            <Button type='submit'>Search</Button>
                        </Input>
                    </div>
                    {updateControl}
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                {fields.map(function(row, i){
                                    var columnId = row["key"];
                                    var columnName = row["text"];
                                    return <th key={columnId}>{columnName}</th>
                                })}
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto',direction: 'rtl'}}>
                        <table className="table-container" ref="table_contents">
                            <tbody>
                                {data.map(function(row, i){
                                    var tds = []; 
                                    fields.map(function(col,j){
                                        var dataId = i + '_' + j;
                                        var data = row[col['key']];
                                        tds.push(React.createElement('td',{key:dataId,children:data}));
                                    });
                                    
                                    return React.createElement('tr', null, tds);
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    },
    handleAdditionMultiple : function(value) {

    },
    handleChangeMultiple: function(e, values) {

    }
});