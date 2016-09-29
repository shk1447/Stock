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
		return {fields:this.props.fields, data:this.props.data, title:this.props.title, dimmer:this.props.dimmer};
	},
    render : function () {
        console.log('render UpdateControl');
        const { fields, data, dimmer, title } = this.state;
        
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='small'>
                    <Button icon='save' onClick={this.show}/>
                    <Button icon='upload' />
                    <Button icon='download' />
                </Button.Group>
                <ModalForm ref='ModalForm' size={'fullscreen'} title={title} active={false} fields={fields} data={data}/>
            </div>
        )
    },
    show : function() {
        this.refs.ModalForm.setState({active:true});
    }
});