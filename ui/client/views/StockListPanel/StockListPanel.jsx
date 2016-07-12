var n = require('nuxjs');

module.exports = React.createClass({
    stockOrigin : [],
    stockDetail : [],
    getStock : function () {
        var self = this;
        var path = '/getstocklist';
        HttpRequest.httpMethod(path,"GET", {}, function(data){
            var xmlHttp = data.currentTarget;
            if(xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    var obj = JSON.parse(xmlHttp.responseText);
                    self.stockOrigin = obj;
                    self.setState({
                        stockList : obj
                    });
                }
            }
        })
    },
    getStockDetail : function () {
        var self = this;
        var path = '/GetStockCurrent';
        HttpRequest.httpMethod(path,"GET", {}, function(data) {
            var xmlHttp = data.currentTarget;
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    var obj = JSON.parse(xmlHttp.responseText);
                    self.stockDetail = obj;
                }
            }
        });
    },
    getInitialState : function () {
        return { stockList: [] };
    },
    componentDidMount : function () {
        this.getStock();
        this.getStockDetail();
    },
    componentWillUnmount : function () {

    },
    componentDidUpdate : function () {

    },
    render : function () {
        var self = this;
        if(this.state.stockList.length < 18) {
            var count = this.state.stockList.length;
            for(var i = count; i < 18; i ++) {
                this.state.stockList.push({});
            }
        }
        return (
            <div style={{background:"#303f53", width:'100%', height:'100%', overflow:'auto'}}>
                <table className="table-container" ref="table_container">
                    <colgroup>
                        <col span={'1'} style={{width: '30%'}}/>
                        <col span={'1'} style={{width: '70%'}}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.stockList.map(function(row, i) {
                            var data = row["sourcedata"];
                            var ticker = ""; var title = "";
                            if(data !== undefined) {
                                ticker = data.ticker === undefined ? "" : data.ticker;
                                title = data.title === undefined ? "" : data.title;
                            }
                            return (<tr className="schedule_row" key={i} id={ticker} name={title}>
                                <td>{ticker}</td>
                                <td>{title}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
});