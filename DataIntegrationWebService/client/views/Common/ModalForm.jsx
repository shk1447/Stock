var React = require('react');
var ReactDOM = require('react-dom');
var {Button,Modal,Image,Header,Icon,Form,Input,Select,TextArea,Checkbox,Radio,Dropdown} = require('stardust');
var TimePicker = require('react-times');
require('../../../public/style.css');
require('react-times/css/material/default.css');
var MessageBox = require('./MessageBox');
var DynamicField = require('./DynamicField');
var SQLEditor = require('./SQLEditor');
var moment = require('moment');

module.exports = React.createClass({
    displayName: 'ModalForm',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        console.log('mount');
    },
    componentWillUnmount : function () {
        console.log('unmount');
    },
    componentDidUpdate : function () {
        console.log('update');
    },
    getInitialState: function() {
        console.log('initialize')
		return {action:this.props.action, fields: this.props.fields, data:this.props.data, size:this.props.size, dimmer:this.props.dimmer,active:this.props.active,title:this.props.title};
	},
    render : function () {
        console.log('render modal form')
        var self = this;

        if(this.state.fields) {
            this.state.fields = this.state.fields.filter(function(d){
                return !d.temp;
            });
            var dynamicFields = this.state.fields.filter(function(d){
                return d.type=='Select' && d.dynamic;
            });
            if(dynamicFields.length > 0) {
                self.setDynamicFields(dynamicFields);
            }
        }

        const {fields, size, dimmer, active, title } = this.state;
        
        if(!this.state.data) { this.state.data = {}; }
        var groups = {};
        var groupArr = [];
        _.each(fields, function(field,index){
            let groupIndex = 0;
            if(field.group) groupIndex = field.group;
            if(!groups[groupIndex]) {
                groups[groupIndex] = [field];
            } else {
                groups[groupIndex].push(field);
            }
            if(field.type == 'AddFields' && self.state.data[field.value]) {
                _.each(self.state.data[field.value], function(value,key){
                    if(!self.state.fields.find(function(d){return d.value == key})) {
                        let addedField = {text:key,value:key,type:'Text',required:field.required,datakey:field.value};
                        if(!groups[groupIndex + 1]){
                            groups[groupIndex + 1] = [addedField]
                        } else {
                            groups[groupIndex + 1].push(addedField);
                        }
                    }
                });
            }
        });
        
        _.each(groups, function(group,key){
            var fieldArr = [];
            for(let i = 0; i < group.length; i++) {
                let fieldInfo = group[i];
                let fieldElement = undefined;
                if(fieldInfo.type == 'Data' || fieldInfo.type == 'Action') {
                    if(self.state.data[fieldInfo.value]){
                        delete self.state.data[fieldInfo.value];
                    }
                    continue;
                }
                switch(fieldInfo.type) {
                    case 'Radio' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let radioArr = [];
                        let required = fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : {};
                        let error = !required ? false : defaultData[fieldInfo.value] == {} ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text; 
                        _.each(fieldInfo.options, function(row,i){
                            defaultData[fieldInfo.value]['value'] = defaultData[fieldInfo.value]['value'] ? defaultData[fieldInfo.value]['value'] : '';
                            defaultData[fieldInfo.value]['checked'] = defaultData[fieldInfo.value]['checked'] ? defaultData[fieldInfo.value]['checked'] : false;
                            let sublabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + row.text : row.text;
                            radioArr.push(<Form.Field key={row.value} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Radio} type='radio'
                                        label={sublabel} name={fieldInfo.value} value={row.value} error={error}
                                        checked={defaultData[fieldInfo.value]['value'] === row.value}/>)
                        });
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency'><label name={fieldInfo.value}>{mainlabel}</label>
                                                    <Form.Group inline>{radioArr}</Form.Group></Form.Field>
                        break;
                    }
                    case 'GroupCheckbox' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let checkboxArr = [];
                        let required = fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : [];
                        let error = !required ? false : defaultData[fieldInfo.value].length == 0 ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        _.each(fieldInfo.options, function(row,i){
                            let sublabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + row.text : row.text;
                            var selectedItem = defaultData[fieldInfo.value].length != fieldInfo.options.length ? {
                                name : fieldInfo.value,
                                value : row.value,
                                checked : false
                            } : defaultData[fieldInfo.value][i]; 
                            if(defaultData[fieldInfo.value].length != fieldInfo.options.length) defaultData[fieldInfo.value].push(selectedItem); 
                            checkboxArr.push(<Form.Field key={row.value} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Checkbox}
                                        label={sublabel} name={selectedItem.name} value={row.value} defaultChecked={selectedItem.checked} error={error}/>)
                        });
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency'><label name={fieldInfo.value}>{mainlabel}</label>
                                                    <Form.Group inline>{checkboxArr}</Form.Group></Form.Field>
                        break;
                    }
                    case 'Checkbox' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false; 
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : {};
                        let error = !required ? false : defaultData[fieldInfo.value] == {} ? true : false; fieldInfo['error'] = error;
                        defaultData[fieldInfo.value]['value'] = defaultData[fieldInfo.value]['value'] ? defaultData[fieldInfo.value]['value'] : '';
                        defaultData[fieldInfo.value]['checked'] = defaultData[fieldInfo.value]['checked'] ? defaultData[fieldInfo.value]['checked'] : false;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} error={error}
                                    control={Checkbox} label={mainlabel} name={fieldInfo.value} value={fieldInfo.value} defaultChecked={defaultData[fieldInfo.value]['checked']}/>;
                        break;
                    }
                    case 'Select' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        var test = _.cloneDeep(fieldInfo.options);
                        _.each(test, function(row,i) { delete row.fields;});
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} compact selection className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)}
                                    control={Select} options={test} label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]} error={error}/>;
                        break;
                    }
                    case 'MultiSelect' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? typeof(defaultData[fieldInfo.value]) == 'object' ? _.map(defaultData[fieldInfo.value], function(value,key){return value}) : defaultData[fieldInfo.value] : [];
                        let error = !required ? false : defaultData[fieldInfo.value].length == 0 ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} onSearchChange={self.handleSearchChange.bind(self,fieldInfo,fields)}
                                        control={Dropdown} options={fieldInfo.options} label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text}
                                        compact selection multiple defaultValue={defaultData[fieldInfo.value]} error={error}/>;
                        break;
                    } 
                    case 'TextArea' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : self.state.data[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} error={error}
                                        control={TextArea} label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]}/>;
                        break;
                    }
                    case 'TimePicker' : {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : moment().format("HH:mm");
                        let error = !required ? false : !defaultData[fieldInfo.value] ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} error={error} className='transparency'><label>{mainlabel}</label>
                                        <TimePicker ref={fieldInfo.value} defaultTime={defaultData[fieldInfo.value]} timeMode={24} onTimeChange={self.handleChange.bind(self,fieldInfo,fields,null)}
                                                    onFocusChange={self.onFocusChange.bind(self,fieldInfo)}/>
                                       </Form.Field>                                        
                        break;
                    }
                    case 'Text' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        let attributes = fieldInfo.attributes ? fieldInfo.attributes : {};
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Input} error={error}
                                        label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]} maxLength={attributes.maxlength}/>;
                        break;
                    }
                    case 'Number' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        let attributes = fieldInfo.attributes ? fieldInfo.attributes : {};
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Input}
                                        type='number' label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]}
                                        min={attributes.min} max={attributes.max} step={attributes.step} error={error}/>;
                        break;
                    }
                    case 'Password' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        let attributes = fieldInfo.attributes ? fieldInfo.attributes : {};
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Input}
                                        type='password' label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]}
                                        maxLength={attributes.maxlength} error={error}/>;
                        break;
                    }
                    case 'Date' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        let attributes = fieldInfo.attributes ? fieldInfo.attributes : {};
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Input}
                                        type='date' label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]}
                                        min={attributes.min} max={attributes.max} error={error}/>;
                        break;
                    }
                    case 'Range' :{
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data; 
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        let attributes = fieldInfo.attributes ? fieldInfo.attributes : {};
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : defaultData[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field key={fieldInfo.value} required={required} className='transparency' onChange={self.handleChange.bind(self,fieldInfo,fields)} control={Input}
                                        type='range' label={mainlabel} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={defaultData[fieldInfo.value]}
                                        min={attributes.min} max={attributes.max} error={error}/>;
                        break;
                    }
                    case 'SQLEditor': {
                        let defaultData;
                        fieldInfo.datakey ? defaultData = self.state.data[fieldInfo.datakey] = self.state.data[fieldInfo.datakey] ? self.state.data[fieldInfo.datakey] : {} : defaultData = self.state.data;
                        let required= fieldInfo.required ? fieldInfo.required : false;
                        defaultData[fieldInfo.value] = defaultData[fieldInfo.value] ? defaultData[fieldInfo.value] : '';
                        let error = !required ? false : self.state.data[fieldInfo.value] == '' ? true : false; fieldInfo['error'] = error;
                        let mainlabel = fieldInfo.datakey ? fieldInfo.datakey + '.' + fieldInfo.text : fieldInfo.text;
                        fieldElement = <Form.Field className='transparency' key={fieldInfo.value} schema={fieldInfo.schema} control={SQLEditor} label={mainlabel} error={error}
                                        defaultValue={defaultData[fieldInfo.value]} onChange={self.handleChange.bind(self,fieldInfo,fields)}/>
                        break;
                    }
                    case 'AddFields' : {
                        let defaultData;
                        fieldInfo.value ? defaultData = self.state.data[fieldInfo.value] = self.state.data[fieldInfo.value] ? self.state.data[fieldInfo.value] : {} : defaultData = self.state.data;
                        fieldElement = <Form.Field key={fieldInfo.value} className='transparency'>
                                            <label name={fieldInfo.value}>{fieldInfo.text}</label>
                                            <Button name={fieldInfo.value} type='button' onClick={self.handleChange.bind(self,fieldInfo,fields)} circular icon='plus' />
                                        </Form.Field>;
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
            <div>
                <Modal id='ModalContainer' className='ModalForm' basic size={size} closeOnEscape={false} closeOnClickOutside={false} dimmer={dimmer} active={active} onHide={this.hide}>
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
                <MessageBox ref='MessageBox' title='Alert' message='필수 입력 항목을 기입하세요.'/>
                <DynamicField ref='DynamicField' active={false} callback={this.addField} />
            </div>
        )
    },
    setDynamicFields : function(dynamicFields) {
        var self = this;
        _.each(dynamicFields, function(row,i) {
            if(self.state.data && self.state.data[row.value]) {
                var selectedOptions = row.options.find(function(d){
                    return d.value == self.state.data[row.value];
                });
                if(selectedOptions && selectedOptions.fields) {
                    var subDynamicFields = selectedOptions.fields.filter(function(d){
                        return d.type == 'Select' && d.dynamic;
                    });
                    var subFields = selectedOptions.fields.filter(function(d){
                        return d.type != 'Select';
                    });
                    if(subDynamicFields.length > 0) {
                        self.setDynamicFields(subDynamicFields);
                        _.each(subDynamicFields, function(row, i){
                            self.state.fields.push(row);
                        });
                    }
                    if(subFields.length > 0) {
                        _.each(subFields, function(row, i){
                            self.state.fields.push(row);
                        });
                    }
                }
            }
        });
    },
    onFocusChange : function(field,focus) {
        if(focus) {
            console.log(this.state.data[field.value]);
            var time = moment(this.state.data[field.value], "HH:mm");
            if(time.isValid()){
                time.minute(time.minute() + 1);
                var minute = time.format("mm")
                this.refs[field.value].setState({minute:minute});
                this.state.data[field.value] = time.format("HH:mm");
            }
        }
    },
    addField : function(field) {
        if(field !== 'cancel') {
            this.state.fields.push(field);
            this.setState(this.state);
        }
    },
    handleSearchChange : function(field,fields,e,data) {
        console.log(e);
    },
    handleAddItem : function(field,fields,value) {
        field.options.push({text:value,value:value});
        this.setState(this.state.fields);
    },
    handleChange: function(field,fields,e,data) {
        var self = this;
        switch(field.type.toLowerCase()) {
            case 'select' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = data;
                } else {
                    this.state.data[field.value] = data;
                }
                break;
            }
            case 'text' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'number' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'password' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'date' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'range' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'textarea' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'sqleditor' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = e.target.value;
                } else {
                    this.state.data[field.value] = e.target.value;
                }
                break;
            }
            case 'timepicker' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = data;
                } else {
                    this.state.data[field.value] = data;
                }
                break;
            }
            case 'multiselect' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = data;
                } else {
                    this.state.data[field.value] = data;
                }
                break;
            }
            case 'checkbox' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = data;
                } else {
                    this.state.data[field.value] = data;
                }
                break;
            }
            case 'radio' : {
                if(field.datakey) {
                    this.state.data[field.datakey][field.value] = data;
                } else {
                    this.state.data[field.value] = data;
                }
                break;
            }
            case 'groupcheckbox' : {
                if(field.datakey) {
                    this.state.data[field.datakey][data.name].find(function(d){
                            return d.value == data.value;
                        }).checked = data.checked;
                } else {
                    this.state.data[data.name].find(function(d){
                            return d.value == data.value;
                        }).checked = data.checked;
                }
                break;
            }
            case 'addfields' : {
                this.refs.DynamicField.setState({active:true,field:{required : field.required, group:field.group+1, datakey:field.value, type:'Text'}});
                break;
            }
        }
        console.log(self.state.data);
        self.setState({fields:self.state.fields});
    },
    hide : function(e) {
        if(!e) return;
        e.preventDefault();
        if(e.target.name == 'save') {
            if(this.props.callback) {
                this.state.fields.filter(function(d){
                    return d.error;
                }).length > 0 ? this.refs.MessageBox.setState({active:true}) : (this.props.callback({action:this.state.action,data:this.state.data}), this.setState({active:false}));
            }
        } else {
            if(this.props.callback) {
                this.props.callback({action:'cancel'});
                this.setState({active:false});
            }
        }
    }
});