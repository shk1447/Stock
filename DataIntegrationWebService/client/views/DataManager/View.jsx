var React = require('react');
var io = require('socket.io-client');
var {Form} = require('stardust')

module.exports = React.createClass({
    displayName: 'View',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {};
	},
    render : function () {
        return (
            <Form>
            </Form>
        )
    }
});