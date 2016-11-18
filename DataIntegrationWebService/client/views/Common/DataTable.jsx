var React = require('react');
var { Button, Menu, Radio, Select } =  require('stardust');
var DataArea = require('./DataArea');
var SearchFilter = require('./SearchFilter');
var UpdateControl = require('./UpdateControl');
var GridControl = require('./GridControl');

module.exports = React.createClass({
    displayName: 'DataTable',
    componentDidMount : function() {
        this.refs.table_contents_container.style.width = this.refs.table_headers.offsetWidth + 'px';
        this.refs.table_contents_container.style.height = this.refs.table_headers_container.offsetHeight - this.refs.table_headers.offsetHeight - 20 + 'px';
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
        if(this.state.searchable && this.state.fields.length > 0) {
            this.refs.SearchFilter.setState({fields:this.state.fields});
        }
        if(this.state.updatable && this.state.fields.length > 0) {
            this.refs.UpdateControl.setState({fields:this.state.fields});
        }
        if(this.state.fields.length > 0) {
            this.refs.DataArea.setState({fields:this.state.fields,data:this.state.data});
            this.refs.table_contents_container.style.width = this.refs.table_headers.offsetWidth + 'px';
            this.refs.table_contents_container.style.height = this.refs.table_headers_container.offsetHeight - this.refs.table_headers.offsetHeight - 20 + 'px';
        }
    },
    getInitialState: function() {
		return {title: this.props.title, filters:this.props.filters, fields:this.props.fields, data: this.props.data,
                searchable: this.props.searchable, updatable : this.props.updatable };
	},
    render : function () {
        var self = this;
        const { data, fields, filters, title } = this.state;
        var thArr = [];
        fields.forEach(function(row,i){
            if(row.type && row.type != 'AddFields') {
                thArr.push(<th key={i} onClick={self.handleSortByItem.bind(self,row)}>{row.text}</th>)
            };
        });
        if(this.state.searchable && fields.length > 0) {
            var searchControl = <SearchFilter ref='SearchFilter' fields={fields} filters={filters} action={this.handleSearch}/>;
        }
        if(this.state.updatable && fields.length > 0) {
            var updateControl = <UpdateControl ref='UpdateControl' title={title} fields={fields} active={false} callback={this.props.callback}/>;
        }
        if(fields.length > 0) {
            var gridControl = <GridControl action={this.handlePagination}/>;
        }
        return (
            <div style={{height:'100%', width:'100%'}}>
                <div style={{width:'100%'}}>
                    {searchControl}
                    {gridControl}
                    {updateControl}
                </div>
                <div ref='table_headers_container' style={{width:'100%',height:'100%',overflowX:'auto',overflowY:'hidden',padding:'6px'}}>
                    <table className="table-container" ref="table_headers">
                        <thead>
                            <tr>
                                {thArr}
                            </tr>
                        </thead>
                    </table>
                    <div ref='table_contents_container' style={{height:'100%',width:'auto',overflowY:'auto',overflowX:'hidden'}}>
                        <DataArea ref='DataArea' data={data} fields={fields} executeItem={this.props.executeItem} modify={this.modifyItem}/>
                    </div>
                </div>
                <div>
                </div>
            </div>
        )
    },
    modifyItem : function(result) {
        if(this.state.updatable) {
            this.refs.UpdateControl.refs.ModalForm.setState({action:'update', active:true,data:_.cloneDeep(result),fields:_.cloneDeep(this.state.fields)});
        } else {
            this.props.callback({action:'doubleclick',data:result});
        }
    },
    handlePagination: function(control) {
        if(control == 'next') {
            this.refs.DataArea.state.page += 1;
        } else if(control == 'prev') {
            this.refs.DataArea.state.page -= 1;
        } else {
            this.props.callback({action:control});
        }
        this.refs.DataArea.setState(this.refs.DataArea.state);
    },
    handleSearch: function(searches) {
        var filteredData = this.state.data.filter(function(data){
            let condition = '';
            _.each(searches,function(row,i){
                condition += row + " && ";
            });
            condition += "true";
            return eval(condition);
        });
        this.refs.DataArea.setState({data:_.cloneDeep(filteredData)});
    },
    handleSortByItem: function(field,e) {
        let direction = "desc";
        if(field.sort !== undefined) {
            field.sort ? (direction = "desc", field.sort = false) : (direction = "asc", field.sort = true); 
        } else {
            field["sort"] = false;
        }
        this.refs.DataArea.state.data.sort(function(a,b){
            let compare01 = a[field.text];
            let compare02 = b[field.text];
            if(parseFloat(compare01)) {
                compare01 = parseFloat(compare01);
                compare02 = parseFloat(compare02);
            }
            return compare01 < compare02 ? (direction == "desc" ? 1 : -1) : compare01 > compare02 ? (direction == "desc" ? -1 : 1) : 0;
        });
        this.refs.DataArea.setState(this.refs.DataArea.state.data)
    }
});