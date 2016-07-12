var n = require('nuxjs');
var StockHeader = require('../StockHeader/StockHeader.jsx');
var StockListPanel = require('../StockListPanel/StockListPanel.jsx');
var StockDetailPanel = require('../StockDetailPanel/StockDetailPanel.jsx');
var StockView = require('../StockView/StockView.jsx');
var requestHelper = require('../temp_modules/HttpRequest.js');
var chart = require('../../libs/chartjs/FreeChartPlayer.js');

var chartOptions = {
    "useControl":true,
    "fake": true,
    "data": {},
    "chartType":"line",
    "objectIds":{},
    "start":"-3M",
    "end":"-0d",
    "xAxisField":"createdtime",
    "usePeriodControl":false,
    "timeRangeSync" : false,
    "timeFormat":"yyyy-MM-dd"
};

module.exports = React.createClass({
    rightPanelState : "",
    player1: (function() {
        return new chart();
    }()),
    player2: (function() {
        return new chart();
    }()),
    player3: (function() {
        return new chart();
    }()),
    player4: (function() {
        return new chart();
    }()),
    path1: '/GetMovingAverage?source={source}&start={start}&end={end}',
    path2: '/gettrix?source={source}&type=day&trix={trix}&signal={signal}&start={start}&end={end}',
    convertDateToTimestamp : function(date) {
        if (date instanceof Date) {
            return Math.floor(date.getTime() / 1000);
        }
        return null;
    },
    calcDate : function (sign, num, unit) {
        var date = new Date();
        if (unit === 'y') {
            date.setYear(date.getFullYear() + parseInt(sign + num, 10));
        } else if (unit === 'M') {
            date.setMonth(date.getMonth() + parseInt(sign + num, 10));
        } else if (unit === 'd') {
            date.setDate(date.getDate() + parseInt(sign + num, 10));
        } else if (unit === 'h') {
            date.setHours(date.getHours() + parseInt(sign + num, 10));
        } else if (unit === 'm') {
            date.setMinutes(date.getMinutes() + parseInt(sign + num, 10));
        } else if (unit === 's') {
            date.setSeconds(date.getSeconds() + parseInt(sign + num, 10));
        }
        return date;
    },
    getInitialState : function () {
        return {options: chartOptions};
    },
    getUnixTimeStampBySignTime: function (param) {
        var Sign = param.match(/[-+]/g) == null ? "+" : param.match(/[-+]/g);
        var Time = param.replace(/[^0-9]/g, "");
        var Unit = param.replace(/[^A-Za-z]/g, "") == "" ? "d" : param.replace(/[^A-Za-z]/g, "");

        return this.convertDateToTimestamp(this.calcDate(Sign, Time, Unit));
    },
    componentDidMount : function () {
        var self = this;
        var layout = this.refs;
        layout.borderLayout.toggle('right');
        var $searchIcon = $(layout.stockView.refs.search_schedule);
        var $table_container = $(layout.stockList.refs.table_container);
        var $refresh = $(layout.stockHeader.refs.stock_refresh);

        self.player1.initialize('price-area', '', self.state.options);
        self.player2.initialize('volume-area', '', self.state.options);
        self.player3.initialize('short-trix-area', '', self.state.options);
        self.player4.initialize('long-trix-area', '', self.state.options);

        layout.stockView.refs.search_text._notifyChange = function() {
            var query, result, temp;
            var keyword = this.getValue();
            var searchType = layout.stockView.state.searchType.toLowerCase();
            if(searchType == "code") {
                query = "data.ticker.search(keyword) != -1";
                temp = layout.stockList.stockOrigin.filter(function(d){ var data = d.sourcedata; return eval(query); });
            } else if(searchType == "name") {
                query = "data.title.toLowerCase().search(keyword) != -1";
                temp = layout.stockList.stockOrigin.filter(function(d){ var data = d.sourcedata; return eval(query); });
            } else {
                query = keyword;
                temp = layout.stockList.stockOrigin.filter(function(d){
                    var detail = layout.stockList.stockDetail.find(function(a){ return d.sourcedata.ticker == a.ticker;});
                    if(!detail)
                        return false;
                    else
                        var data = detail.sourcedata;
                    return eval(query + "&& parseFloat(data.createdtime) > 1465291500");
                });
            }
            var result = temp.length == 0 ? layout.stockList.stockOrigin : temp;
            layout.stockList.setState({
                stockList : result
            });
        };

        $refresh.click(function(e){
            layout.stockList.getStock();
            layout.stockList.getStockDetail();
        });

        $searchIcon.click(function(e){
            layout.borderLayout.toggle('left');
            setTimeout(function(){
                if(self.player1.guid && self.player2.guid && self.player3.guid && self.player4.guid) {
                    self.player1.resize(), self.player2.resize(), self.player3.resize(),self.player4.resize();
                }
            },300);
        });

        $table_container.find('tbody').contextmenu(function(e) {
            e.preventDefault();
            layout.borderLayout.toggle('right');
            setTimeout(function(){
                if(self.player1.guid && self.player2.guid && self.player3.guid && self.player4.guid) {
                    self.player1.resize(), self.player2.resize(), self.player3.resize(),self.player4.resize();
                }
            },350);
        });

        $table_container.find('tbody').click(function(e) {
            var options = {
                start : layout.stockView.state.start,
                end : layout.stockView.state.end
            };

            if (options.start !== parseInt(options.start) && options.end !== parseInt(options.end)) {
                options.start = self.getUnixTimeStampBySignTime(options.start);
                options.end = self.getUnixTimeStampBySignTime(options.end);
            };
            self.player1.options.start = options.start,self.player1.options.end = options.end;
            self.player2.options.start = options.start,self.player2.options.end = options.end;
            self.player3.options.start = options.start,self.player3.options.end = options.end;
            self.player4.options.start = options.start,self.player4.options.end = options.end;
            var target = $(e.target).parents('.schedule_row');
            var key = target.attr('id');
            var name = target.attr('name');
            var newPath = self.path1.replace(/\{source\}/gi, key).replace(/\{start\}/gi, options.start).replace(/\{end\}/gi, options.end);
            var newPath2 = self.path2.replace(/\{source\}/gi, key).replace(/\{trix\}/gi, "12").replace(/\{signal\}/gi, "9").replace(/\{start\}/gi, options.start).replace(/\{end\}/gi, options.end);
            var newPath3 = self.path2.replace(/\{source\}/gi, key).replace(/\{trix\}/gi, "60").replace(/\{signal\}/gi, "45").replace(/\{start\}/gi, options.start).replace(/\{end\}/gi, options.end);
            HttpRequest.httpMethod(newPath2,"GET",null, function(data) {
                var xmlHttp = data.currentTarget;
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        self.player3.options.data = JSON.parse(xmlHttp.responseText);
                        self.player3.options.data.Fields = [{Name :"trix",DisplayName:"trix_12"},
                                                            {Name :"trix_signal",DisplayName:"signal_9"},
                                                            {Name :"createdtime",DisplayName:"생성시간"}];
                        self.player3.load(name + " (Short-term Trix Signal)");
                    }
                }
            });

            HttpRequest.httpMethod(newPath3,"GET",null, function(data) {
                var xmlHttp = data.currentTarget;
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        self.player4.options.data = JSON.parse(xmlHttp.responseText);
                        self.player4.options.data.Fields = [{Name :"trix",DisplayName:"trix_60"},
                                                            {Name :"trix_signal",DisplayName:"signal_45"},
                                                            {Name :"createdtime",DisplayName:"생성시간"}];
                        self.player4.load(name + " (Long-term Trix Signal)");
                    }
                }
            });

            HttpRequest.httpMethod(newPath,"GET",null, function(data) {
                    var xmlHttp = data.currentTarget;
                    if(xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            var data = JSON.parse(xmlHttp.responseText);
                            self.player1.options.data = data;
                            self.player1.options.data.Fields = [{Name :"quoteclose",DisplayName:"현재가"},
                                                                {Name :"ema5",DisplayName:"5일_평균"},
                                                                {Name :"ema20",DisplayName:"20일_평균"},
                                                                {Name :"ema60",DisplayName:"60일_평균"},
                                                                {Name :"ema120",DisplayName:"120일_평균"},
                                                                {Name :"quotehigh",DisplayName:"고가"},
                                                                {Name :"quotelow",DisplayName:"저가"},
                                                                {Name :"createdtime",DisplayName:"생성시간"}];
                            self.player1.load(name  + " (Price Moving Average)");
                            self.player2.options.data = data;
                            self.player2.options.data.Fields = [{Name :"quotevolume",DisplayName:"거래량"},
                                                                {Name :"emav5",DisplayName:"5일_평균"},
                                                                {Name :"emav20",DisplayName:"20일_평균"},
                                                                {Name :"emav60",DisplayName:"60일_평균"},
                                                                {Name :"emav120",DisplayName:"120일_평균"},
                                                                {Name :"createdtime",DisplayName:"생성시간"}];
                            self.player2.load(name + " (Volume Moving Average)");
                        }
                    }
            });
            var detail = layout.stockList.stockDetail.find(function(a){ return a.ticker == key;});
            layout.stockDetail.setState({
                stockDetail : detail
            });
        });
    },
    componentWillUnmount : function () {

    },
    componentDidUpdate : function () {
    },
    render : function () {
        return (
            <n.BorderLayout ref="borderLayout">
                <n.Area name="top" splitBar={false} size={50}>
                    <StockHeader ref="stockHeader"/>
                    <div id="hoho" ref="tester"></div>
                </n.Area>
                <n.Area name="center">
                    <StockView ref="stockView"/>
                </n.Area>
                <n.Area name="left" splitBar={false} size={330} >
                    <StockListPanel ref="stockList"/>
                </n.Area>
                <n.Area name="right" splitBar={false} size={200} >
                    <StockDetailPanel ref="stockDetail"/>
                </n.Area>
            </n.BorderLayout>
        )
    }
});