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
        var thArr = [];
        _.each(data[0], function(value,key){
            thArr.push(<th key={key}>{key}</th>)
        });
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    <SearchFilter fields={fields} filters={filters}/>
                    <UpdateControl title={'Input Data'} fields={fields} />
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden',padding:'4px'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                {thArr}
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto',direction: 'rtl'}}>
                        <DataArea data={data}/>
                    </div>
                </div>
            </div>
        )
    }
});