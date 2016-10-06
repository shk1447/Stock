var React = require('react');
var { Button, Menu } =  require('stardust');
var DataArea = require('./DataArea');
var SearchFilter = require('./SearchFilter');
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
		return {title: this.props.title, filters:this.props.filters, fields:this.props.fields, data: this.props.data };
	},
    render : function () {
        console.log('render DataTable');
        const { data, fields, filters, title } = this.state;
        var thArr = [];
        fields.forEach(function(row,i){
            if(row.type && row.type != 'AddFields') {
                thArr.push(<th key={i}>{row.text}</th>)
            };
        });
        
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    <SearchFilter ref='SearchFilter' fields={fields} filters={filters}/>
                    <UpdateControl ref='UpdateControl' title={title} fields={fields} active={false} callback={this.props.callback}/>
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
                        <DataArea data={data} fields={fields} modify={this.modifyItem}/>
                    </div>
                </div>
            </div>
        )
    },
    modifyItem : function(result){
        this.refs.UpdateControl.refs.ModalForm.setState({active:true,data:result});
    }
});