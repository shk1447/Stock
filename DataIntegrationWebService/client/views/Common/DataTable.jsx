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
		return {fields:this.props.fields, data: this.props.data, updatable:this.props.updatable, selectable:this.props.selectable};
	},
    render : function () {
        const { data, fields, updatable, selectable } = this.state;
        // var updateControl = <div style={{float:'right',padding:'5px'}}></div>
        // if(updatable) {
        //     updateControl = <div style={{float:'right',padding:'5px'}}>
        //                         <Button.Group basic size='small'>
        //                             <Button icon='save' />
        //                             <Button icon='upload' />
        //                             <Button icon='download' />
        //                         </Button.Group>
        //                     </div>;
        // }
        const filters = [];
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    <SearchFilter fields={fields} filters={filters}/>
                    <UpdateControl />
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