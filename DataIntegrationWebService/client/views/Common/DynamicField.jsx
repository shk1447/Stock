var React = require('react');
var {Modal,Form,Checkbox,Input,Select,Icon,Button} = require('stardust');
var MessageBox = require('./MessageBox');

module.exports = React.createClass({
    displayName: 'DynamicField',
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
        var error01 = field.text && field.text !== '' ? false : true;
        var error02 = field.value && field.value !== '' ? false : true;
        var error03 = field.type && field.type !== '' ? false : true;
        var error04 = field.group && field.group !== '' ? false : true;
        var error05 = field.datakey && field.datakey !== '' ? false : true;
        this['error'] = error01 || error02 || error03 || error04;
        return (
            <div>
                <Modal basic size={'small'} closeOnEscape={false} closeOnClickOutside={false} active={active} onHide={this.hide}>
                    <Modal.Header>ADD FIELD</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field label='TEXT' error={error01} required defaultValue={field.text} className='transparency' name='text' onChange={self.handleChange.bind(self,'text')} control={Input}/>
                                <Form.Field label='VALUE' error={error02} required defaultValue={field.value} className='transparency' name='value' onChange={self.handleChange.bind(self,'value')} control={Input}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field label='TYPE' error={error03} disabled required defaultValue={field.type} className='transparency' name='type' onChange={self.handleChange.bind(self,'type')} options={options} control={Select}/>
                                <Form.Field label='GROUP' error={error04} disabled required defaultValue={field.group} className='transparency' name='group' onChange={self.handleChange.bind(self,'group')} control={Input} type='number'/>
                                <Form.Field label='DATA KEY' error={error05} disabled required defaultValue={field.datakey} className='transparency' name='group' onChange={self.handleChange.bind(self,'datakey')} control={Input} type='text'/>
                            </Form.Group>
                            <Form.Group inline>
                                <Form.Field label='REQUIRED' disabled className='transparency' defaultChecked={field.required} name='required' onChange={self.handleChange.bind(self,'required')} control={Checkbox}/>
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type='submit' name='save' color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                        <Button name='cancel' color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                    </Modal.Actions>
                </Modal>
                <MessageBox ref='MessageBox' title='Alert' message='필수 입력 항목을 기입하세요.'/>
            </div>
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
                this['error'] ? this.refs.MessageBox.setState({active:true}) : (this.props.callback(_.cloneDeep(this.state.field)), this.setState({active:false}));
            }
        } else {
            if(this.props.callback) {
                this.props.callback('cancel');
                this.setState({active:false});
            }
        }
    }
});