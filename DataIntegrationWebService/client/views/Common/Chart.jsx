var ChartPlayer = require('../../libs/chart/FreeChartPlayer.js');
var {Icon, Button} = require('stardust');
var ModalForm = require('./ModalForm');

module.exports = React.createClass({
    displayName: 'Chart',
    chartSettingFields : [
        {
            value:'chartType', text:"CHART TYPE", type:'Select', group:0, options:[
                {value:'line',text:'LINE CHART'},{value:'area',text:'AREA CHART'},{value:'bar',text:'BAR CHART'},{value:'pie',text:'PIE CHART'}
            ]
        }
    ],
    getInitialState: function () {
        return { player: {}, repeat:false, title : this.props.title,data:this.props.data,fields:this.props.fields}
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
        if(this.state.fields.length > 0) {
            var chartControl = <Button.Group basic size='small'>
                <Button icon='repeat' active={this.state.repeat} toggle onClick={this.handleToggle}/>
                <Button icon='settings' onClick={this.handleChartSetting} />
            </Button.Group>
        }
        return (
            <div style={{width:'100%', height:'100%'}}>
                <div style={{padding:'8px',textAlign:'end', marginRight:'40px'}}>
                    {chartControl}
                </div>
                <div style={{height:'100%',width:'100%',background:'transparent'}} ref="player">
                </div>
                <ModalForm ref='ModalForm' action={'insert'} size={'large'} title={'CHART SETTING'} active={false}
                    fields={self.chartSettingFields} data={[]} callback={this.applyChartSetting}/>
            </div>);
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
    applyChartSetting : function(result) {
        if(result.action != 'cancel') {
            this.state.player.options.chartType = result.data.chartType;
            this.state.player.load();
        }
    }
});