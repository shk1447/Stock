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
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        var self = this;
        this.socket = io.connect();
        this.socket.on('login',function(data){
            self.props.history.push('/DataViewer');
        });
		return { value: '' };
	},
    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    },

    handleChange(e) {
        this.setState({ value: e.target.value });
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
                        <Form>
                            <Form.Field>
                                <input type='text' placeholder='User ID' />
                            </Form.Field>

                            <Form.Field>
                                <input type='password' placeholder='Password' />
                            </Form.Field>
                        </Form>
                        <Segment padded>
                            <Button onClick={this.handleLogin} primary fluid>Login</Button>
                            <Divider horizontal>Or</Divider>
                            <Button secondary fluid>Sign Up Now</Button>
                        </Segment>
                    </div>
                </div>
            </div>
        )
    },
    handleLogin: function (e) {
        // var data = {"broadcast":false,"target":"login.access", "parameters":{"id":"shkim","password":"inno1029#"}};
        // this.socket.emit('fromclient', data);
        this.context.router.replace('/App/');
        console.log(this);
    }
});