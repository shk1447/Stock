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
        const {data} = this.state;

        var trArr = [];
        _.each(data, function(row,i){
            let tdArr = [];
            let status = '';
            _.each(row, function(value,key){
                if(key == 'status'){ status = value };
                tdArr.splice(0,0,<td key={key}>{value}</td>);
            });

            trArr.push(<tr key={i} className={status}>{tdArr}</tr>);
        });

        return (
            <table className="table-container" ref="table_contents">
                <tbody>
                    {trArr}
                </tbody>
            </table>
        )
    }
});