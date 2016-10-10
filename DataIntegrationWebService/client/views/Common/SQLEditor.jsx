var React = require('react');
var io = require('socket.io-client');
var {Form,TextArea} = require('stardust')

module.exports = React.createClass({
    displayName: 'SQLEditor',
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
		return {};
	},
    render : function () {
        return (
            <TextArea onChange={this.props.onChange.bind(this.handleChange)} />
        )
    },
    handleChange : function (e) {
        console.log(e.target.value);
    }
});