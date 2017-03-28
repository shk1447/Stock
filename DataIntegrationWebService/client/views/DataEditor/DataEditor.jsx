var React = require('react');
var io = require('socket.io-client');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');

module.exports = React.createClass({
    displayName: 'Editor',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
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
        return (
            <div></div>
        )
    }
});