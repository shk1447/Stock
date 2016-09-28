var React = require('react');
var Router = require('react-router');
var io = require('socket.io-client');
var { Form, Label, Header, Icon, Image, Segment, Button, Divider } = require('stardust');

module.exports = React.createClass({
    displayName: 'Login',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        self.socket = io.connect();
        self.socket.on('member.access',function(data) {
            if(data.message.code == "200") {
                self.context.router.replace('/App/');
            }
            self.socket.disconnect();
            self.socket.close();
        });
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { };
	},
    render : function () {
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
                                <Button secondary fluid>Sign Up Now</Button>
                            </Segment>
                        </Form>
                    </div>
                </div>
            </div>
        )
    },
    handleSubmit: function(e, serializedForm) {
        e.preventDefault();
        var data = {"broadcast":false,"target":"member.access", "parameters":serializedForm};
        this.socket.emit('fromclient', data);
    }
});