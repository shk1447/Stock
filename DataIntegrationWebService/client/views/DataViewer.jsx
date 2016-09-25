var React = require('react');
var io = require('socket.io-client');
var { Menu, Segment, Dropdown, Grid, Header } = require('stardust');
var DataView = require('./DataView');

const options = [
  { text: 'English', value: 'English' },
  { text: 'French', value: 'French' },
  { text: 'Spanish', value: 'Spanish' },
  { text: 'German', value: 'German' },
  { text: 'Chinese', value: 'Chinese' },
]

module.exports = React.createClass({
    displayName: 'DataViewer',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { activeView: this.props.activeView };
	},
    render : function () {
        const { activeView } = this.state
        return (
            <Grid>
                <Grid.Column width={2}>
                    <Menu fluid vertical tabular>
                        <Menu.Item name='current' active={activeView === 'current'} onClick={this.handleViewClick} />
                        <Menu.Item name='past' active={activeView === 'past'} onClick={this.handleViewClick} />
                    </Menu>
                    </Grid.Column>

                    <Grid.Column stretched width={14}>
                    <Segment>
                        <DataView />
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    },
    handleViewClick : function(e, { name }) {
        this.setState({activeView : name});
    }
});