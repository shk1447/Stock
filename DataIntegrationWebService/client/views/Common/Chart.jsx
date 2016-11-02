var ChartPlayer = require('../../libs/chart/FreeChartPlayer.js');
var {Icon} = require('stardust');

module.exports = React.createClass({
    displayName: 'Chart',
    getInitialState: function () {
        return { player: {},title : this.props.title,data:this.props.data,fields:this.props.fields,RangeType:'period'}
    },
    onRemove : function () {
    },
    componentDidMount: function () {
        var self = this;        
        self.state.player = new ChartPlayer();
        this.state.player.initialize(this.refs.player);
    },
    componentDidUpdate: function () {
        console.log('update chart');
        this.state.player.options.title = this.state.title;
        this.state.player.options.fake = true;
        this.state.player.options.data = {fields:this.state.fields, data : this.state.data};
        this.state.player.load();
    },
    componentWillUnmount: function () {
        if(this.state.player){
            this.state.player.close();
        }
    },
    render: function () {
        var self = this;
        if(self.state.data && self.state.data.length > 0) {
            var rangeType = <select value={this.state.RangeType} onChange={this.handleRangeTypeChange} style={{float:'right',marginRight: '10px'}}>
                                <option value="period">Period</option>
                                <option value="dateRange">DateRange</option>
                            </select>;
            var range = <div style={{float:'right',marginRight: '10px'}}>
                        <Icon name="calendar"/>
                        <input type='date' />
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="23" style={{marginLeft:'0.5em',width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'start','hour')}></input>:
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="59" style={{width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'start','min')}></input>:
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="59" style={{width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'start','sec')}></input>
                        <span style={{marginLeft: '10px',marginRight: '10px'}}>~</span>
                        <Icon name="calendar"/>
                        <input type='date' />
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="23" style={{marginLeft:'0.5em',width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'end','hour')}></input>:
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="59" style={{width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'end','min')}></input>:
                        <input type="number" pattern="[0-9]*" step="1" min="0" max="59" style={{width:'3em'}} onKeyPress={this.preventDefault}
                            onChange={this.handleTimeChange.bind(this, 'end','sec')}></input>
                    </div>;

            if(this.state.RangeType == "period") {
                range = <div style={{float:'right',marginRight: '10px'}}>
                            <input type='number' step="1" max="0" style={{width:'4em'}} onKeyPress={this.preventDefault} onChange={this.handlePeriodChange.bind(this,'period')}/>
                            <select style={{marginLeft: '10px'}} onChange={this.handlePeriodChange.bind(this,'periodUnit')}>
                                <option value="YEAR">YEAR</option>
                                <option value="MONTH">MONTH</option>
                                <option value="DAY">DAY</option>
                            </select>
                        </div>;
            }
        }

        return (
            <div style={{width:'100%', height:'100%'}}>
                <div style={{height:'100%',width:'100%',background:'transparent'}} ref="player">
                </div>
                <div style={{height:'2em',width:'100%',alignItems:'center'}}>
                    <div style={{justifyContent:'flex-end',marginRight:'20px',alignItems:'center'}}>
                        {range}
                        {rangeType}
                    </div>
                </div>
            </div>);
    },
    handlePeriodChange : function (type,e){
        this.state.options[type] = e.target.value;
        this.setState(this.state);
    },
    handleRangeTypeChange : function(e) {
        this.setState({RangeType : e.target.value});
    },
    handleTimeChange : function(type01,type02,e){
        this[type01 + "_" + type02] = e.target.value;
        if(type01 == "start") {
            var timestamp = new Date(this.start_date + " " + this.start_hour + ":" + this.start_min + ":" + this.start_sec).getTime();
            this.state.options.start = this.state.player.options.start = timestamp;
        } else {
            var timestamp = new Date(this.end_date + " " + this.end_hour + ":" + this.end_min + ":" + this.end_sec).getTime();
            this.state.options.end = this.state.player.options.end = timestamp;
        }
        this.setState(this.state);
    },
    handleFieldChange: function(field, name, value, oldValue){
        this.temp[name] = value; 
    },
    handleApply : function() {
        var self = this;
        var params = {ObjectName:[this.props.config.data.Name],Fields:this.state.options.fields,
                            Begin:this.state.options.start,End:this.state.options.end, XAxisField :this.state.options.xAxisField};

        if(this.state.RangeType == 'period') {
            params.options.end = Date.now();
            params.options.start = this.calculateDate(Date.now(),this.state.options.periodUnit, this.state.options.period);
        }
    },
    onCancel : function(){
        this.temp = {};
        this.setState(this.state);
    },
    onConfirm : function () {
        _.extend(this.state.options, this.temp);
        _.extend(this.state.player.options, this.temp);
        this.temp = {};
        this.setState(this.state);
    }
});