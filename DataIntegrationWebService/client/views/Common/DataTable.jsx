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
        if(this.state.searchable) {
            this.refs.SearchFilter.setState({fields:this.state.fields});
        }
        if(this.state.updatable) {
            this.refs.UpdateControl.setState({fields:this.state.fields});
        }
        this.refs.DataArea.setState({fields:this.state.fields,data:this.state.data});
        this.refs.table_contents_container.style.width = this.refs.table_headers.offsetWidth + 'px';
    },
    getInitialState: function() {
		return {title: this.props.title, filters:this.props.filters, fields:this.props.fields, data: this.props.data, searchable: this.props.searchable, updatable : this.props.updatable };
	},
    render : function () {
        const { data, fields, filters, title } = this.state;
        var thArr = [];
        fields.forEach(function(row,i){
            if(row.type && row.type != 'AddFields') {
                thArr.push(<th key={i}>{row.text}</th>)
            };
        });
        if(this.state.searchable) {
            var searchControl = <SearchFilter ref='SearchFilter' fields={fields} filters={filters}/>;
        }
        if(this.state.updatable) {
            var updateControl = <UpdateControl ref='UpdateControl' title={title} fields={fields} active={false} callback={this.props.callback}/>;
        }
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    {searchControl}
                    {updateControl}
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden',padding:'4px'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                {thArr}
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto'}}>
                        <DataArea ref='DataArea' data={data} fields={fields} executeItem={this.props.executeItem} modify={this.modifyItem}/>
                    </div>
                </div>
            </div>
        )
    },
    modifyItem : function(result){
        this.refs.UpdateControl.refs.ModalForm.setState({action:'update', active:true,data:_.cloneDeep(result),fields:_.cloneDeep(this.state.fields)});
    }
});