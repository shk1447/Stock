var React = require('react');
var Router = require('react-router');
var {Form,Grid,Row,Checkbox,Col,Button,FormGroup,ControlLabel,FormControl,HelpBlock} = require('react-bootstrap');
var io = require('socket.io-client');

module.exports = React.createClass({
    displayName: 'Login',
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
                <Form horizontal>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col componentClass={ControlLabel} lg={2}>
                            Email
                        </Col>
                        <Col sm={4}>
                            <FormControl type="email" placeholder="Email" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPassword">
                        <Col componentClass={ControlLabel} lg={2}>
                            Password
                        </Col>
                        <Col lg={4}>
                            <FormControl type="password" placeholder="Password" />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col lgOffset={5} lg={5}>
                            <Checkbox>Remember me</Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col lgOffset={5} lg={5}>
                            <Button type="submit">Sign in</Button>
                        </Col>
                    </FormGroup>
                </Form>
        )
    },
    handleLogin: function (e) {
        var data = {"broadcast":false,"target":"login.access", "parameters":{"id":"shkim","password":"inno1029#"}};
        this.socket.emit('fromclient', data);
    }
});