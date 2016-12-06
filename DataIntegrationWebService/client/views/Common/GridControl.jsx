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
		return {repeat:false, active:this.props.active, fields:this.props.fields};
	},
    render : function () {
        var self = this;
        const { fields, active } = this.state;
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='mini'>
                    <Button icon='search' onClick={this.show}/>
                    <Button icon='chevron left' onClick={function(){self.props.action('prev')}}/>
                    <Button icon='chevron right' onClick={function(){self.props.action('next')}}/>
                    <Button icon='repeat' active={this.state.repeat} toggle onClick={this.handleToggle}/>
                    <Button icon='download' onClick={this.downloadItem} />
                    <Button icon='settings' />
                </Button.Group>
                <ModalForm ref='ModalForm' action={'search'} size={'large'} title={'SEARCHER'} active={active} fields={_.cloneDeep(fields)} callback={this.handleSearch}/>
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
            let conditions = [];
            _.each(args.data, function(value,key){
                if(value !== "") {
                    let condition = 'data.' + key + value;
                    conditions.push(condition);
                }
            });
            this.props.action('search', conditions);
        }
    }
});