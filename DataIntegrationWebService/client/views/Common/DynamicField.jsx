var React = require('react');
var {Modal,Form,Checkbox,Input,Select,Icon,Button} = require('stardust');

module.exports = React.createClass({
    displayName: 'DynamicField',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { active : this.props.active, isOptions : false, field:{} };
	},
    render : function () {
        var self = this;
        const { active, field } = this.state;
        const options = [{text:'TEXT',value:'Text'},
                        {text:'TEXT AREA',value:'TextArea'},
                        {text:'NUMBER',value:'Number'},
                        {text:'DATE',value:'Date'},
                        {text:'TIME PICKER',value:'TimePicker'}];
        var error01 = field.text ? false : true;
        var error02 = field.value ? false : true;
        var error03 = field.type ? false : true;
        var error04 = field.group ? false : true;
        return (
            <Modal className='ModalForm' basic size={'small'} closeOnEscape={false} closeOnClickOutside={false} active={active} onHide={this.hide}>
                <Modal.Header>ADD FIELD</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field label='TEXT' error={error01} required defaultValue={field.text} className='transparency' name='text' onChange={self.handleChange.bind(self,'text')} control={Input}/>
                            <Form.Field label='VALUE' error={error02} required defaultValue={field.value} className='transparency' name='value' onChange={self.handleChange.bind(self,'value')} control={Input}/>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field label='TYPE' error={error03} required defaultValue={field.type} className='transparency' name='type' onChange={self.handleChange.bind(self,'type')} options={options} control={Select}/>
                            <Form.Field label='GROUP' error={error04} required defaultValue={field.group} className='transparency' name='group' onChange={self.handleChange.bind(self,'group')} control={Input} type='number'/>
                        </Form.Group>
                        <Form.Group inline>
                            <Form.Field label='REQUIRED' className='transparency' defaultChecked={field.required} name='required' onChange={self.handleChange.bind(self,'required')} control={Checkbox}/>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button type='submit' name='save' color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                    <Button name='cancel' color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                </Modal.Actions>
            </Modal>
        )
    },
    handleChange:function(key,e,value){
        if(key == 'type') {
            this.state.field[key] = value;
        } else if ( key == 'required') {
            this.state.field[key] = value.checked;
        } else {
            this.state.field[key] = e.target.value;
        }
        this.setState({field : this.state.field});
    },
    hide:function(e){
        if(!e) return;
        e.preventDefault();
        if(e.target.name == 'save') {
            if(this.props.callback) {
                this.props.callback(this.state.field);
                this.setState({active:false})
            }
        } else {
            if(this.props.callback) {
                this.props.callback('cancel');
                this.setState({active:false});
            }
        }
    }
});