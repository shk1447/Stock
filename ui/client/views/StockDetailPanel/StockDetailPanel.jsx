var n = require('nuxjs');

module.exports = React.createClass({
    getInitialState : function () {
        return { stockDetail: {} };
    },
    componentDidMount : function () {
    },
    componentWillUnmount : function () {

    },
    componentDidUpdate : function () {

    },
    render : function () {
        var self = this;
        var result = [];
        if(self.state.stockDetail) {
            for(var item in self.state.stockDetail.sourcedata) {
                var obj = {};
                obj["key"] = item;
                obj["value"] = self.state.stockDetail.sourcedata[item];
                result.push(obj);
            };
        }
        return (
            <div style={{background:"#303f53", width:'100%', height:'100%', overflow:'auto'}}>
                <table className="table-container" ref="table_container">
                    <colgroup>
                        <col span={'1'} style={{width: '35%'}}/>
                        <col span={'1'} style={{width: '65%'}}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>KEY</th>
                        <th>VALUE</th>
                    </tr>
                    </thead>
                    <tbody>
                        {result.map(function(row, i){
                            var key = row["key"];
                            var value = row["value"];
                            return (<tr className="schedule_row" key={i} name={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
});