var React = require('react');
var ModalForm = require('./ModalForm');
var {Button} = require('stardust');

module.exports = React.createClass({
    displayName: 'UpdateControl',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {active:this.props.active, fields:this.props.fields, data:this.props.data, title:this.props.title, dimmer:this.props.dimmer};
	},
    render : function () {
        console.log('render UpdateControl');
        const { fields, data, dimmer, title, active } = this.state;
        
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='small'>
                    <Button icon='save' onClick={this.show}/>
                    <Button icon='remove' onClick={this.removeItems}/>
                    <Button icon='upload' />
                    <Button icon='download' />
                </Button.Group>
                <ModalForm ref='ModalForm' size={'fullscreen'} title={title} active={active} fields={fields} data={data} callback={this.props.callback}/>
            </div>
        )
    },
    removeItems : function(e){
        
    },
    show : function() {
        this.refs.ModalForm.setState({active:true});
    }
});