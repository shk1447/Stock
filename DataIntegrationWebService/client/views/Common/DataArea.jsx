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
		return {data:this.props.data};
	},
    render : function () {
        console.log('render data area');
        var trArr = [];
        var self = this;
        const {data} = this.state;
        _.each(data, function(row,i){
            let tdArr = [];
            let status = '';
            _.each(row, function(value,key){
                if(key == 'status'){ status = value };
                var data = value;
                if(typeof(value) == 'object') {
                    if(value instanceof Array){
                        if(value.length > 0) {
                            if(typeof(value[0]) =='string') {
                                data = value.toString();
                            } else {
                                let result = [];
                                _.each(value, function(row,i){
                                    if(row.checked){
                                        result.push(row.value);
                                    }
                                });
                                data = result.toString();
                            }
                        }
                    } else {
                        data = value.value;
                    }
                }
                tdArr.splice(0,0,<td key={key}>{data}</td>);
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