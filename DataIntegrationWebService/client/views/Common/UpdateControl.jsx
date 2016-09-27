var React = require('react');
var {Button} = require('stardust');

module.exports = React.createClass({
    displayName: 'UpdateControl',
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
            <div style={{float:'right',padding:'8px'}}>
                <Button.Group basic size='small'>
                    <Button icon='save' />
                    <Button icon='upload' />
                    <Button icon='download' />
                </Button.Group>
            </div>
        )
    }
});