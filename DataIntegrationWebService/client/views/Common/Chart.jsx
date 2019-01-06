var ChartPlayer = require('../../libs/chart/FreeChartPlayer.js');
var {Icon, Button} = require('stardust');
var ModalForm = require('./ModalForm');

module.exports = React.createClass({
    displayName: 'Chart',
    chartSettingFields : [
        {
            value:'chartType', text:"CHART TYPE", type:'Select', group:0, options:[
                {value:'line',text:'LINE'},{value:'area',text:'AREA'},{value:'bar',text:'BAR'},{value:'pie',text:'PIE'}
            ]
        }
    ],
    getInitialState: function () {
        return { player: {}, predict:false, repeat:false, title : this.props.title,data:this.props.data,fields:this.props.fields}
    },
    onRemove : function () {
    },
    componentDidMount: function () {
        var self = this;
        var dom = ReactDOM.findDOMNode(this.refs.chart_control);
        this.refs.player.style.height = this.refs.player.parentElement.offsetHeight - dom.offsetHeight + 'px';
        self.state.player = new ChartPlayer();
        this.state.player.initialize(this.refs.player);
        this.state.player.options.title = this.state.title;
        this.state.player.options.fake = true;
        this.state.player.options.data = {fields:this.state.fields, data : this.state.data};
        this.state.player.load();
    },
    componentDidUpdate: function () {
        var dom = ReactDOM.findDOMNode(this.refs.chart_control);
        this.refs.player.style.height = this.refs.player.parentElement.offsetHeight - dom.offsetHeight + 'px';

        this.state.player.options.title = this.state.title;
        this.state.player.options.fake = true;
        this.state.player.options.data = {fields:this.state.fields, data : this.state.data};
        this.state.player.load();
    },
    componentWillReceiveProps : function(nextProps) {
        this.state.fields = nextProps.fields;
        this.state.data = nextProps.data;
    },
    componentWillUnmount: function () {
        if(this.state.player){
            this.state.player.close();
        }
    },
    render: function () {
        var self = this;
        if(this.state.fields.length > 0) {
            var chartControl = <Button.Group basic size='small'>
                <Button icon='repeat' active={this.state.repeat} toggle onClick={this.handleToggle}/>
                <Button icon='idea' active={this.state.predict} toggle onClick={this.handlePredict}/>
                <Button icon='settings' onClick={this.handleChartSetting} />
                <Button icon='external' onClick={this.handleLeave}/>
            </Button.Group>
        }
        return (
            <div style={{width:'100%', height:'100%'}}>
                <div ref='chart_control' style={{padding:'8px',textAlign:'end', marginRight:'40px'}}>
                    {chartControl}
                </div>
                <div style={{height:'100%',width:'100%',background:'transparent',userSelect:'none'}} ref="player">
                </div>
                <ModalForm ref='ModalForm' action={'insert'} size={'large'} title={'CHART SETTING'} active={false}
                    fields={self.chartSettingFields} data={[]} callback={this.applyChartSetting}/>
            </div>);
    },
    handlePredict: function() {
        var self = this;
        this.setState({predict:!this.state.predict});
        var fieldLength = this.state.player.options.data.fields.length;
        if(!this.state.player.options.predict) {
            for(var j = 0; j < fieldLength; j++){
                var row = this.state.player.options.data.fields[j];
                if(row.value != "unixtime" && !row.value.includes('support') && !row.value.includes('resistance')) {
                    self.state.player.options.data.fields.push({text:row.value+"_real_support",value:row.value+"_real_support",type:"Number"});
                    self.state.player.options.data.fields.push({text:row.value+"_real_resistance",value:row.value+"_real_resistance",type:"Number"});
                }
            }
            this.state.player.options.predict = true;
        } else {
            for(var j = fieldLength - 1; j >= 0; j--){
                var row = this.state.player.options.data.fields[j];
                if(row.value.includes('real_support') || row.value.includes('real_resistance')) {
                    this.state.player.options.data.fields.splice(j,1);
                }
            }
            this.state.player.options.predict = false;
        }
        this.state.player.options.chartType = 'line';
        this.state.player.load();
    },
    handleChartSetting: function() {
        this.refs.ModalForm.setState({active:true});
    },
    handleToggle: function() {
        this.setState({repeat:!this.state.repeat});
        let actionName = 'repeat_on';
        if(this.state.repeat) {
            actionName = 'repeat_off'
        }
        this.props.action({action:actionName});
    },
    downloadItem : function(e){
        this.props.action({action:"download"});
    },
    applyChartSetting : function(result) {
        if(result.action != 'cancel') {
            this.state.player.options.chartType = result.data.chartType;
            this.state.player.load();
        }
    },
    handleLeave: function() {
        this.props.action({action:'return_item',cellId:this.props.cellId})
    }
});