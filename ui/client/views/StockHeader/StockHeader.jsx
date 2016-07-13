var n = require('nuxjs');

module.exports = React.createClass({
    url:'http://localhost:1447',
    types :["LIST", "HISTORY", "CURRENT", "ANALYSIS"],
    setUrl : function(_comp, _val) {
        HttpRequest._url = this.url = _val;
    },
    changeType: function(_comp, _val) {
        var self = this;
        var index = this.types.findIndex(function(d) { return d == self.state.datatype;});
        index += 1;
        if(index == -1 || index > this.types.length - 1) index = 0;
        this.setState({datatype : this.types[index]});
    },
    getInitialState : function () {
        HttpRequest._url = this.url;
        return { datatype : 'LIST'};
    },
    componentDidMount : function () {
        var self = this;
        this.refs.header_calendar.className = "fa fa-calendar-o activeIcon";
        this.refs.stock_start.className = "fa fa-play fa-lg activeIcon";
        this.refs.stock_refresh.className = "fa fa-refresh fa-lg activeIcon";
        $(this.refs.stock_start).click(function(e){
            var path = "/SetStock" + self.state.datatype;
            HttpRequest.httpMethod(path, "GET", {}, function(d) {
                    var xmlHttp = d.currentTarget;
                    if(xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            console.log(xmlHttp.responseText);
                        }
                    }
            });
        });
    },
    componentWillUnmount : function () {

    },
    componentDidUpdate : function () {
    },
    render : function () {
        return (
            <n.FlexLayout direction="horizontal">
                <div style={{width:330,height:50,background:'#1a293f', padding:'1em', borderBottom : '1px solid #5a5960'}}>
                    <label style={{color:'#ffffff', fontSize:'18px'}}>STOCK  </label>
                    <label style={{color:'#8391a7', fontSize:'10px'}}>SERVICE</label>
                </div>
                <div style={{width:120,height:50,background:'#eeebec', padding:'1em', textAlign:'center', borderBottom : '1px solid #5a5960'}}>
                    <i ref="header_calendar" style={{fontWeight:'bold'}} onClick={this.changeType}><label style={{marginLeft:'8px'}}>{this.state.datatype}</label></i>
                </div>
                <div style={{width:50,height:50,background:'#ffffff', padding:'1em', textAlign:'right', borderBottom : '1px solid #5a5960'}}>
                    <i ref="stock_start" style={{color:'#ff2b4a'}} aria-hidden={"true"}></i>
                </div>
                <div style={{width:1,height:50,background:'#ffffff', padding:'1.2em 0em 1.2em 0em', borderBottom : '1px solid #5a5960'}}>
                    <div style={{height:'100%', width:'100%', background:'#489889'}}></div>
                </div>
                <div style={{width:49,height:50,background:'#ffffff', padding:'1em', textAlign:'left', borderBottom : '1px solid #5a5960'}}>
                    <i ref="stock_refresh" style={{color:'#04998f'}}></i>
                </div>
                <n.TextField ui={"header-text"} width={'100%'} placeholder={'Input Url'} value={this.url} style={{height:50,background:'#f0f8fc', borderBottom : '1px solid #5a5960'}} onChange={this.setUrl} flex={1} />
            </n.FlexLayout>
        )
    }
});