var React = require('react');
var {Button} = require('stardust');
var ModalForm = require('./ModalForm');

module.exports = React.createClass({
    displayName: 'GridControl',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {repeat:false, active:this.props.active, fields:this.props.fields, repeatable:this.props.repeatable};
	},
    render : function () {
        var self = this;
        const { fields, active, repeatable } = this.state;
        var repeatBtn;
        if(repeatable) {
            repeatBtn = <Button icon='repeat' active={this.state.repeat} toggle onClick={this.handleToggle}/>;
        }
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='mini'>
                    <Button icon='search' onClick={this.show}/>
                    <Button icon='chevron left' onClick={function(){self.props.action('prev')}}/>
                    <Button icon='chevron right' onClick={function(){self.props.action('next')}}/>
                    {repeatBtn}
                </Button.Group>
                <ModalForm ref='ModalForm' action={'search'} size={'large'} title={'SEARCHER'} active={active} fields={_.cloneDeep(fields)} callback={self.handleSearch.bind(self)}/>
            </div>
        )
    },
    downloadItem : function(e){
        this.props.action("download");
    },
    handleToggle : function(){
        this.setState({repeat:!this.state.repeat});
        let actionName = 'repeat_on';
        if(this.state.repeat) {
            actionName = 'repeat_off'
        }
        this.props.action(actionName);
    },
    show : function() {
        this.refs.ModalForm.setState({action:'search', active:true,fields:_.cloneDeep(this.state.fields),data:{}});
    },
    handleSearch : function(args) {
        if(args.action == 'search') {
            var self = this;
            let conditions = [];
            _.each(args.data, function(value,key){
                if(value !== "") {
                    var field = self.state.fields.find(function(d){return d.value == key;});
                    var condition = '';
                    if(field && field.type == 'Text') {
                        condition = 'data.' + key + '.includes("' + value + '")'
                    } else {
                        condition = 'data.' + key + value;
                    }
                    conditions.push(condition);
                }
            });
            this.props.action('search', conditions);
        }
    }
});