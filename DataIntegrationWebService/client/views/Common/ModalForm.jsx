var React = require('react');
var {Button,Modal,Image,Header,Icon,Form,Input,Select,TextArea,Checkbox,Radio,Dropdown} = require('stardust');
var TimePicker = require('react-times');
require('../../../public/style.css');
require('react-times/css/material/default.css');

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
        console.log('render modal form')
        var self = this;
        const {fields, size, dimmer, active, title } = this.state;
        var isNew = false;
        if(!this.state.data) { this.state.data = {}; isNew = true; }
        var groups = {};
        var groupArr = [];
        _.each(fields, function(field,index){
            let groupIndex = 0;
            if(isNew) self.state.data[field.value] = '';
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
                        let radioArr = [];
                        let required = fieldInfo.required ? fieldInfo.required : false; 
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : {};
                        _.each(fieldInfo.options, function(row,i){
                            self.state.data[fieldInfo.value]['value'] = self.state.data[fieldInfo.value]['value'] ? self.state.data[fieldInfo.value]['value'] : '';
                            self.state.data[fieldInfo.value]['checked'] = self.state.data[fieldInfo.value]['checked'] ? self.state.data[fieldInfo.value]['checked'] : false;
                            radioArr.push(<Form.Field key={row.value} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)} control={Radio} type='radio'
                                        label={row.text} name={fieldInfo.value} value={row.value}
                                        checked={self.state.data[fieldInfo.value]['value'] === row.value}/>)
                        });
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency'><label name={fieldInfo.value}>{fieldInfo.text}</label>
                                                    <Form.Group inline>{radioArr}</Form.Group></Form.Field>
                        break;
                    }
                    case 'GroupCheckbox' : {
                        let checkboxArr = [];
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : [];
                        _.each(fieldInfo.options, function(row,i){
                            var selectedItem = self.state.data[fieldInfo.value].length != fieldInfo.options.length ? {
                                name : fieldInfo.value,
                                value : row.value,
                                checked : false
                            } : self.state.data[fieldInfo.value][i]; 
                            if(self.state.data[fieldInfo.value].length != fieldInfo.options.length) self.state.data[fieldInfo.value].push(selectedItem); 
                            checkboxArr.push(<Form.Field key={row.value} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)} control={Checkbox}
                                        label={row.text} name={selectedItem.name} value={row.value} defaultChecked={selectedItem.checked}/>)
                        });
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency'><label name={fieldInfo.value}>{fieldInfo.text}</label>
                                                    <Form.Group inline>{checkboxArr}</Form.Group></Form.Field>
                        break;
                    }
                    case 'Checkbox' : {
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : {};
                        self.state.data[fieldInfo.value]['value'] = self.state.data[fieldInfo.value]['value'] ? self.state.data[fieldInfo.value]['value'] : '';
                        self.state.data[fieldInfo.value]['checked'] = self.state.data[fieldInfo.value]['checked'] ? self.state.data[fieldInfo.value]['checked'] : false;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)} control={Checkbox}
                                        label={fieldInfo.text} name={fieldInfo.value} value={fieldInfo.value} defaultChecked={self.state.data[fieldInfo.value]['checked']}/>;
                        break;
                    }
                    case 'Select' : {
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : '';
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)}
                                        control={Select} options={fieldInfo.options} label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={self.state.data[fieldInfo.value]}/>;
                        break;
                    }
                    case 'MultiSelect' : {
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : [];
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)}
                                        control={Dropdown} options={fieldInfo.options} label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text}
                                        compact search selection fluid multiple allowAdditions defaultValue={self.state.data[fieldInfo.value]}/>;
                        break;
                    } 
                    case 'TextArea' : {
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] =self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : '';
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)}
                                        control={TextArea} label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={self.state.data[fieldInfo.value]}/>;
                        break;
                    }
                    case 'Dynamic' :{
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency'>
                                            <label name={fieldInfo.value}>ADD FIELD</label>
                                            <Button name={fieldInfo.value} type='button' onClick={self.handleChange.bind(self,fieldInfo)} circular icon='plus' />
                                        </Form.Field>
                        break;
                    }
                    case 'TimePicker' : {
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        fieldElement = <Form.Field key={fieldInfo.value} defaultTime={self.state.data[fieldInfo.value]} timeMode={24}
                                            onTimeChange={self.handleChange.bind(self,fieldInfo,null)} className='transparency' label={fieldInfo.text} control={TimePicker}/>
                                        
                        break;
                    }
                    case 'Input' :{
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : ''
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo)} control={Input}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={self.state.data[fieldInfo.value]}/>;
                        break;
                    }
                    default : {
                        fieldElement = <Form.Field key={i}></Form.Field>
                        break;
                    }
                }
                fieldArr.push(fieldElement);
            };
            let groupElement = <Form.Group key={key} widths='equal'>{fieldArr}</Form.Group>;
            groupArr.splice(parseInt(key),0,groupElement);
        });

        return (
            <Modal className='ModalForm' basic size={size} closeOnEscape={false} closeOnClickOutside={false} dimmer={dimmer} active={active} onHide={this.hide}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Content>
                    <Form>
                        {groupArr}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button type='submit' name='save' color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                    <Button name='cancel' color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                </Modal.Actions>
            </Modal>
        )
    },
    timeChanged: function(time,a,b,c){
        console.log(time,a,b,c)
    },
    addElement: function(e){
        console.log(e.target.name);
    },
    handleChange: function(field,e,data) {
        switch(field.type.toLowerCase()) {
            case 'select' : {
                this.state.data[field.value] = data;
                break;
            }
            case 'multiselect' : {
                this.state.data[field.value] = data;
                break;
            }
            case 'checkbox' : {
                this.state.data[data.name] = data; 
                break;
            }
            case 'radio' : {
                this.state.data[data.name] = data;
                break;
            }
            case 'groupcheckbox' : {
                this.state.data[data.name].find(function(d){
                            return d.value == data.value;
                        }).checked = data.checked;
                break;
            }
            case 'input' : {
                this.state.data[field.value] = e.target.value;
                console.log(data);
                break;
            }
            case 'textarea' : {
                this.state.data[field.value] = e.target.value;
                console.log(data);
                break;
            }
            case 'timepicker' : {
                this.state.data[field.value] = data;
                break;
            }
            case 'dynamic' : {
                break;
            }
        }
        this.setState(this.state.data);
        
        console.log(this.state.data);
    },
    hide : function(e) {
        if(e.target.name == 'save') {
            if(this.props.callback) {
                this.props.callback(this.state.data);
            }
        }
        this.setState({active:false});
    }
});