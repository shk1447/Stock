var React = require('react');
var Router = require('react-router');
var io = require('socket.io-client');
var MessageBox = require('./Common/MessageBox');
var { Form, Label, Header, Icon, Image, Segment, Button, Divider, Modal, Input } = require('stardust');

module.exports = React.createClass({
    displayName: 'Login',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket = io.connect();
        self.socket.on('member.access',function(data) {
            if(data.code == "200") {
                self.context.router.replace('/App/');
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (LOGIN MEMBER)',message:data.message, active : true})
            }
        });
        self.socket.on('member.create',function(data) {
            if(data.code == "200") {
                self.setState({active:false});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE MEMBER)',message:data.message, active : true})
            }
        });
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        this['SignUpInfo'] = { };
		return { active : false };
	},
    render : function () {
        const { active } = this.state;
        return (
            <div className="outer">
                <div className="middle">
                    <div className="inner" style={{width:'300px'}}>
                        <Header as='h2' icon textAlign='center'>
                        <Icon name='users' circular />
                        <Header.Content>
                            Big Ants
                        </Header.Content>
                        </Header>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <input name='member_id' type='text' placeholder='MEMBER ID' />
                            </Form.Field>

                            <Form.Field>
                                <input name='password' type='password' placeholder='PASSWORD' />
                            </Form.Field>
                            <Segment padded>
                                <Button type='submit' primary fluid>Login</Button>
                                <Divider horizontal>Or</Divider>
                                <Button secondary fluid onClick={this.show}>Sign Up Now</Button>
                            </Segment>
                        </Form>

                        <Modal basic size={'small'} active={active} onHide={this.hide}>
                            <Modal.Header>{'Sign Up'}</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field className='transparency' required onChange={this.handleChange} control={Input}
                                        label={'MEMBER ID'} name={'member_id'} placeholder={'MEMBER ID'} />
                                    <Form.Field className='transparency' required onChange={this.handleChange} control={Input} type='password'
                                        label={'PASSWORD'} name={'password'} placeholder={'PASSWORD'} />
                                    <Form.Field className='transparency' onChange={this.handleChange} control={Input}
                                        label={'MEMBER NAME'} name={'member_name'} placeholder={'MEMBER NAME'} />
                                    <Form.Field className='transparency' onChange={this.handleChange} control={Input}
                                        label={'E-MAIL'} name={'email'} placeholder={'E-MAIL'} />
                                    <Form.Field className='transparency' onChange={this.handleChange} control={Input}
                                        label={'PHONE NUMBER'} name={'phonenumber'} placeholder={'PHONE NUMBER'} />
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button name='save' color='green' inverted primary icon onClick={this.hide}><Icon name='checkmark' />SAVE</Button>
                                <Button name='cancel' color='red' basic inverted primary icon onClick={this.hide}><Icon name='remove'/>CANCEL</Button>
                            </Modal.Actions>
                        </Modal>

                        <MessageBox ref='alert_messagebox' />
                    </div>
                </div>
            </div>
        )
    },
    handleChange: function(e, value) {
        this['SignUpInfo'][e.target.name] = e.target.value;
    },
    handleSubmit: function(e, serializedForm) {
        e.preventDefault();
        var data = {"broadcast":false,"target":"member.access", "parameters":serializedForm};
        this.socket.emit('fromclient', data);
    },
    show : function(e,v) {
        this.setState({active:true});
    },
    hide : function(e) {
        if(!e) return;
        if(e.target.name == 'save') {
            e.preventDefault();
            var data = {"broadcast":false,"target":"member.create", "parameters":this.SignUpInfo};
            this.socket.emit('fromclient', data);
        } else if(e.target.name == 'cancel') {
            this.SignUpInfo = {};
            this.setState({active:false});
        }
    }
});