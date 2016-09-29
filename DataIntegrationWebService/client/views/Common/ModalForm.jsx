var React = require('react');
var {Button,Modal,Image,Header,Icon,Form,Input,Select,TextArea,Checkbox,Radio,Dropdown} = require('stardust');

module.exports = React.createClass({
    displayName: 'ModalForm',
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
		return {fields:this.props.fields, data:this.props.data, size:this.props.size, dimmer:this.props.dimmer,active:this.props.active,title:this.props.title};
	},
    render : function () {
        var {fields, size, dimmer, active, title, data} = this.state;
        var isNew = false;
        if(!data) data = {}; isNew = true;
        var groups = {};
        var groupArr = [];
        _.each(fields, function(field,index){
            let groupIndex = 0;
            if(isNew) data[field.value] = '';
            if(field.group) groupIndex = field.group; 

            if(!groups[groupIndex]) {
                groups[groupIndex] = [field];
            } else {
                groups[groupIndex].push(field);
            }
        });
        var self = this;
        _.each(groups, function(group,key){
            var fieldArr = [];
            for(let i = 0; i < group.length; i++) {
                let fieldInfo = group[i];
                let fieldElement = undefined;
                switch(fieldInfo.type) {
                    case 'Radio' :{

                    } 
                    case 'Checkbox' : {
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Checkbox}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} checked={data[fieldInfo.value]}/>;
                        break;
                    }
                    case 'GroupCheckbox' : {
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Checkbox}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} checked={data[fieldInfo.value]}/>; 
                        break;
                    }
                    case 'Select' : {
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Select} options={fieldInfo.options}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>;
                        break;
                    }
                    case 'MultiSelect' : {
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Dropdown} options={fieldInfo.options}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text}  search selection fluid multiple allowAdditions defaultValue={[data[fieldInfo.value]]}/>;
                        break;
                    } 
                    case 'TextArea' : {
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={TextArea}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>;
                        break;
                    }
                    case 'Dynamic' :{
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency'>
                                            <label>ADD FIELD</label>
                                            <Button name={fieldInfo.value} type='button' onClick={self.addElement} circular icon='plus' />
                                        </Form.Field>
                        break;
                    }
                    default :{
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Input}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>;
                        break;
                    }
                }
                fieldArr.push(fieldElement);
            };
            let groupElement = <Form.Group key={key} widths='equal'>{fieldArr}</Form.Group>;
            groupArr.splice(parseInt(key),0,groupElement);
        });

        return (
            <Modal basic size={size} dimmer={dimmer} active={active} onHide={this.hide}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Content>
                    <Form>
                        {groupArr}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                    <Button color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                </Modal.Actions>
            </Modal>
        )
    },
    addElement: function(e){
        console.log(e.target.name);
    },
    handleChange: function(e,value) {
        console.log(value);
        console.log(e.target.value);
    },
    hide : function() {
        this.setState({active:false});
    }
});