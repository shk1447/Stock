var React = require('react');
var { Icon } =  require('stardust');

module.exports = React.createClass({
    displayName: 'DataArea',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function (nextProps) {
        console.log(nextProps);
    },
    getInitialState: function() {
		return {data:this.props.data,fields:this.props.fields,selectedItems:[],page:1, pageCount:50};
	},
    render : function () {
        var trArr = [];
        var self = this;
        const {data,fields,page,pageCount} = this.state;
        if(data && data.length > 0) {
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
        var data = _.cloneDeep(this.state.data[e.target.parentElement.attributes.name.value]);
        this.props.modify(data);
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
            //console.log(e.target.parentElement.attributes.name.value);
        }
    }
});