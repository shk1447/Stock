var React = require('react');
var { Button, Menu, Select, Input, Dropdown } =  require('stardust');

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
        var exampleData = [
            {
                "key1":"value1",
                "key2":"value2",
                "key3":"value3"
            },
            {
                "key1":"value1",
                "key2":"value2",
                "key3":"value3"
            }
        ];
		return {data: this.props.data, updatable:this.props.updatable, selectable:this.props.selectable };
	},
    render : function () {
        const options = [
            {value:">", text:"초과"},
            {value:"<", text:"미만"},
            {value:">=", text:"이상"},
            {value:"<=", text:"이하"},
            {value:"=", text:"동일"}
        ];
        const fields = [
            {value:'field01', text:"field01"},
            {value:'field02', text:"field02"},
            {value:'field03', text:"field03"},
            {value:'field04', text:"field04"},
            {value:'field05', text:"field05"},
            {value:'field06', text:"field06"},
            {value:'field07', text:"field07"},
            {value:'field08', text:"field08"},
            {value:'field09', text:"field09"},
            {value:'field10', text:"field10"},
            {value:'field11', text:"field11"},
            {value:'field12', text:"field12"},
            {value:'field13', text:"field13"},
            {value:'field14', text:"field14"},
            {value:'field15', text:"field15"},
            {value:'field16', text:"field16"},
            {value:'field17', text:"field17"},
            {value:'field18', text:"field18"},
            {value:'field19', text:"field19"}
        ];
        const activeItem = '1';
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
                    <div style={{float:'right',marginRight:'10px'}}>
                        <Button.Group basic size='small'>
                            <Button icon='file' />
                            <Button icon='save' />
                            <Button icon='upload' />
                            <Button icon='download' />
                        </Button.Group>
                    </div>
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                                <th>Column 01</th>
                                <th>Column 02</th>
                                <th>Column 03</th>
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto',direction: 'rtl'}}>
                        <table className="table-container" ref="table_contents">
                            <tbody>
                                <tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr>
                                <tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr>
                                <tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr><tr>
                                    <td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td><td>DataRow02_01</td><td>DataRow02_02</td><td>DataRow02_03</td>                            
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                </div>
                <div style={{width:'100%'}}>
                    
                </div>
            </div>
        )
    },
    handleAdditionMultiple : function(value) {

    },
    handleChangeMultiple: function(e, values) {

    }
});