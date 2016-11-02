var React = require('react');
var {Button} = require('stardust');

module.exports = React.createClass({
    displayName: 'GridControl',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {repeat:false};
	},
    render : function () {
        var self = this;
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='small'>
                    <Button icon='chevron left' onClick={function(){self.props.action('prev')}}/>
                    <Button icon='chevron right' onClick={function(){self.props.action('next')}}/>
                    <Button icon='repeat' active={this.state.repeat} toggle onClick={this.handleToggle}/>
                    <Button icon='settings' />
                </Button.Group>
            </div>
        )
    },
    handleToggle : function(){
        this.setState({repeat:!this.state.repeat});
        let actionName = 'repeat_on';
        if(this.state.repeat) {
            actionName = 'repeat_off'
        }
        this.props.action(actionName);
    }
});