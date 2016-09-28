var React = require('react');
var { Button, Menu } =  require('stardust');
var SearchFilter = require('./SearchFilter');
var DataArea = require('./DataArea');
var UpdateControl = require('./UpdateControl');

module.exports = React.createClass({
    displayName: 'DataTable',
    componentDidMount : function() {
        this.refs.table_contents_container.style.width = this.refs.table_headers.offsetWidth + 'px';
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
        this.refs.table_contents_container.style.width = this.refs.table_headers.offsetWidth + 'px';
    },
    getInitialState: function() {
		return {filters:this.props.filters, fields:this.props.fields, data: this.props.data, updatable:this.props.updatable, selectable:this.props.selectable};
	},
    render : function () {
        console.log('render DataTable');
        const { data, fields, updatable, selectable, filters } = this.state;
        
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    <SearchFilter fields={fields} filters={filters}/>
                    <UpdateControl title={'Input Data'} fields={fields} active={false} />
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden',padding:'4px'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                {fields.map(function(row, i){
                                    var columnId = row["value"];
                                    var columnName = row["text"];
                                    return <th key={columnId}>{columnName}</th>
                                })}
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto',direction: 'rtl'}}>
                        <DataArea data={data} fields={fields}/>
                    </div>
                </div>
            </div>
        )
    }
});