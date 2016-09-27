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
        const {data, fields} = this.state;
        return (
            <table className="table-container" ref="table_contents">
                <tbody>
                    {data.map(function(row, i){
                        let tds = []; 
                        fields.map(function(col,j){
                            let key =i + '_' + j;
                            let value = row[col['value']];
                            
                            tds.push(<td key={key}>{value}</td>);
                        });
                        let trProps = {
                            key:i
                        };
                        return React.createElement('tr', trProps, tds);
                    })}
                </tbody>
            </table>
        )
    }
});