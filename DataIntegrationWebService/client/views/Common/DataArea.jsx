var React = require('react');
var { Icon } =  require('stardust');

module.exports = React.createClass({
    displayName: 'DataArea',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function (nextProps) {
    },
    getInitialState: function() {
        var filters = this.props.filters ? this.props.filters : [];
		return {data:this.props.data,fields:this.props.fields,selectedItems:[],page:1, pageCount:50,filters:filters,sort_field:{},direction:'desc'};
	},
    render : function () {
        var trArr = [];
        var self = this;
        const {fields,page,pageCount} = this.state;
        var {data} = this.state;
        if(data && data.length > 0) {
            data = data.filter(function(data){
                let condition = '';
                _.each(self.state.filters,function(row,i){
                    condition += row + " && ";
                });
                condition += "true";
                return eval(condition);
            });
            if(this.state.sort_field.text) {
                data = data.sort(function(a,b){
                    let compare01 = a[self.state.sort_field.text];
                    let compare02 = b[self.state.sort_field.text];
                    if(parseFloat(compare01)) {
                        compare01 = parseFloat(compare01);
                        compare02 = parseFloat(compare02);
                    }
                    return compare01 < compare02 ? (self.state.direction == "desc" ? 1 : -1) : compare01 > compare02 ? (self.state.direction == "desc" ? -1 : 1) : 0;
                });
            }
            var currentPage = pageCount > data.length ? data.length : page*pageCount;
            for(var i = ((page-1)*pageCount); i < currentPage; i++) {
                let row = data[i];
                if(row == undefined) {
                    continue;
                }
                let tdArr = [];
                let status = '';
                _.each(fields, function(field,index){
                    if(field.type && field.type != 'AddFields') {
                        var data = '-';
                        data = field.datakey ? row[field.datakey] ? row[field.datakey][field.value] : undefined : row[field.value];
                        if(data) {
                            if(field.type == 'MultiSelect') {
                                data = _.map(data, function(value,key){return value}).toString();
                            } else if (field.type == 'GroupCheckbox') {
                                let result = [];
                                _.each(data, function(row,i) {
                                    if(row.checked){
                                        result.push(row.value);
                                    }
                                });
                                data = result.toString();
                            } else if(field.type == 'Radio' || field.type == 'Checkbox') {
                                data = data.value;
                            }
                        }
                        if(field.type == 'Action') {
                            let icon = data;
                            let loading = data == "spinner" ? true : false;
                            if(data == "play" || data == "stop") {
                                icon = data + " circle";
                            }
                            tdArr.push(<td key={index}><Icon size='large' loading={loading} onClick={self.actionItem} name={icon}/></td>)
                        } else {
                            tdArr.push(<td key={index}>{data}</td>);
                        }
                    }
                });

                trArr.push(<tr key={i} name={i} onClick={self.handleClickItem} onDoubleClick={self.handleDoubleClickItem} className={status}>{tdArr}</tr>);
            }
        }
        return (
            <table className="table-container" ref="table_contents">
                <tbody>
                    {trArr}
                </tbody>
            </table>
        )
    },
    actionItem : function(e){
        this.props.executeItem(this.state.data[e.target.parentElement.parentElement.attributes.name.value]);
    },
    handleDoubleClickItem : function(e) {
        var self = this;
        var {data} = this.state;
        if(data && data.length > 0) {
            data = data.filter(function(data){
                let condition = '';
                _.each(self.state.filters,function(row,i){
                    condition += row + " && ";
                });
                condition += "true";
                return eval(condition);
            });
            if(this.state.sort_field.text) {
                data = data.sort(function(a,b){
                    let compare01 = a[self.state.sort_field.text];
                    let compare02 = b[self.state.sort_field.text];
                    if(parseFloat(compare01)) {
                        compare01 = parseFloat(compare01);
                        compare02 = parseFloat(compare02);
                    }
                    return compare01 < compare02 ? (self.state.direction == "desc" ? 1 : -1) : compare01 > compare02 ? (self.state.direction == "desc" ? -1 : 1) : 0;
                });
            }
        }
        var result = _.cloneDeep(data[e.target.parentElement.attributes.name.value]);
        this.props.modify(result);
    },
    handleClickItem : function(e) {
        if(e.ctrlKey) {
            if(e.target.parentElement.className == 'selected') {
                this.state.selectedItems.splice(e.target.parentElement.attributes.name.value,1)
                e.target.parentElement.className = ''
            } else {
                this.state.selectedItems.splice(e.target.parentElement.attributes.name.value,1,this.state.data[e.target.parentElement.attributes.name.value])
                e.target.parentElement.className = 'selected'
            }
        } else if (e.shiftKey) {
            // console.log(e.target.parentElement.attributes.name.value);
        } else {
            // unselected
        }
    }
});