var React = require('react');

module.exports = React.createClass({
    displayName: 'DataArea',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {data:this.props.data,fields:this.props.fields};
	},
    render : function () {
        console.log('render data area');
        var trArr = [];
        var self = this;
        const {data,fields} = this.state;
        _.each(data, function(row,i){
            let tdArr = [];
            let status = '';

            _.each(fields, function(field,index){
                if(field.type && field.type != 'AddFields') {
                    var data = '-';
                    if(row[field.value]) {
                        data = row[field.value];

                        if(field.type == 'MultiSelect') {
                            data = data.toString();
                        } else if(field.type == 'GroupCheckbox') {
                            let result = [];
                            _.each(data, function(row,i){
                                if(row.checked){
                                    result.push(row.value);
                                }
                            });
                            data = result.toString();
                        } else if(field.type == 'Radio' || field.type == 'Checkbox') {
                            data = data.value;
                        }
                    }
                    tdArr.splice(0,0,<td key={index}>{data}</td>);
                }
            });

            trArr.push(<tr key={i} name={i} onClick={self.handleClickItem} onDoubleClick={self.handleDoubleClickItem} className={status}>{tdArr}</tr>);
        });

        return (
            <table className="table-container" ref="table_contents">
                <tbody>
                    {trArr}
                </tbody>
            </table>
        )
    },
    handleDoubleClickItem : function(e) {
        var data = this.state.data[e.target.parentElement.attributes.name.value];
        this.props.modify(data);
    },
    handleClickItem : function(e) {
        if(e.ctrlKey) {
            if(e.target.parentElement.className == 'selected') {
                e.target.parentElement.className = ''
            } else {
                e.target.parentElement.className = 'selected'
            }
        } else if (e.shiftKey) {
            console.log(e.target.parentElement.attributes.name.value);
        }
    }
});