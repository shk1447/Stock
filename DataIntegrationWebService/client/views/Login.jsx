var React = require('react');
var Router = require('react-router');
var io = require('socket.io-client');
var MessageBox = require('./Common/MessageBox');
var { Form, Label, Header, Icon, Image, Segment, Button, Divider, Modal, Input } = require('stardust');
var ModalForm = require('./Common/ModalForm');
var cookies = require('browser-cookies');

module.exports = React.createClass({
    displayName: 'Login',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket.on('member.schema',function(data){
            self.refs.ModalForm.setState({fields:data})
        });
        self.socket.on('member.access',function(data) {
            if(data.member_id) {
                if(window.sessionStorage) {
                    sessionStorage['member_id'] = data.member_id;
                    sessionStorage['member_name'] = data.member_name;
                    sessionStorage['privilege'] = data.privilege;
                    sessionStorage['last_view'] = '{}';
                }
                cookies.set('accessToken', data.token);
                self.context.router.replace('/App/');
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (LOGIN MEMBER)',message:"Fail Login", active : true})
            }
        });
        self.socket.on('member.create',function(data) {
            if(data.code == "200") {
                self.setState({active:false});
            } else {
                self.refs.alert_messagebox.setState({title:'ALERT (CREATE MEMBER)',message:data.message, active : true})
            }
        });
        self.socket.on('connected', function() {
            var data = {"broadcast":false,"target":"member","method":"schema", "parameters":{}};
            self.socket.emit('fromclient', data);
        });
    },
    componentWillUnmount : function () {
        this.socket.disconnect();
        this.socket.close();
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        this.socket = io.connect();
		return {};
	},
    render : function () {
        const { schema } = this.state;
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
                                <Button secondary type='button' fluid onClick={this.show}>Sign Up Now</Button>
                            </Segment>
                        </Form>

                        <ModalForm ref='ModalForm' size={'small'} title={'Sign Up'} callback={this.handleCreate}/>

                        <MessageBox ref='alert_messagebox' />
                    </div>
                </div>
            </div>
        )
    },
    handleCreate: function(result) {
        if(result.action == 'insert') {
            var data = {"broadcast":false,"target":"member", "method":"create", "parameters":result.data};
            this.socket.emit('fromclient', data);
        }
    },
    handleSubmit: function(e, serializedForm) {
        e.preventDefault();
        var data = {"broadcast":false,"target":"member", "method":"access", "parameters":serializedForm};
        this.socket.emit('fromclient', data);
    },
    show : function(e,v) {
        this.refs.ModalForm.setState({active:true,action:'insert',data:{}});
    }
});