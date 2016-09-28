var React = require('react');
var {Button,Modal,Image,Header,Icon,Form,Input,Select,TextArea,Checkbox,Radio} = require('stardust');

module.exports = React.createClass({
    displayName: 'UpdateControl',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {fields:this.props.fields, data:this.props.data, title:this.props.title, active:this.props.active, dimmer:this.props.dimmer};
	},
    render : function () {
        console.log('render UpdateControl');
        var { fields, data, active, dimmer, title } = this.state;
        const size = 'fullscreen';
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
                    case 'TextArea' : fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={TextArea}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>; break;
                    case 'Checkbox' : fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Checkbox}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} checked={data[fieldInfo.value]}/>; break;
                    case 'Select' : fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Select} options={fieldInfo.options}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>; break;
                    default : fieldElement = <Form.Field key={fieldInfo.value} className='transparency' onChange={self.handleChange} control={Input}
                                        label={fieldInfo.text} name={fieldInfo.value} placeholder={fieldInfo.text} defaultValue={data[fieldInfo.value]}/>; break;
                }
                fieldArr.push(fieldElement);
            };
            let groupElement = <Form.Group key={key} widths='equal'>{fieldArr}</Form.Group>;
            groupArr.splice(parseInt(key),0,groupElement);
        });
        
        return (
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='small'>
                    <Button icon='save' onClick={this.show}/>
                    <Button icon='upload' />
                    <Button icon='download' />
                </Button.Group>

                <Modal basic size={size} dimmer={dimmer} active={active} onHide={this.hide}>
                    <Modal.Header>{title}</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            {groupArr}
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                        <Button color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    },
    handleChange: function(e,value) {
        console.log(typeof(value));
        console.log(e.target.value);
    },
    handleSubmit: function(e, serializedForm){
        console.log(serializedForm);
    },
    show : function() {
        this.setState({active:true});
    },
    hide : function() {
        console.log(ReactDOM.findDOMNode(this.refs.UpdateDataForm));
        this.setState({active:false});
    }
});