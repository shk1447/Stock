var React = require('react');
var Router = require('react-router');
var {Grid,Row,Col,Button} = require('react-bootstrap');
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
		return {message: 'hoho', values: {}};
	},
    render : function () {
        return (
            <Grid>
                <Row className="show-grid">
                    <Col sm={4}><Button onClick={this.handleLogin}>LOGIN</Button></Col>
                    <Col sm={8}>{this.state.message}</Col>
                </Row>
            </Grid>
        )
    },
    handleLogin: function (e) {
        var data = {"broadcast":false,"target":"login.access", "parameters":{"id":"shkim","password":"inno1029#"}};
        this.socket.emit('fromclient', data);
    }
});