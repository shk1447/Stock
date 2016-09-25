var React = require('react');
var io = require('socket.io-client');
var { Menu, Dropdown, Button, Grid, Segment } = require('stardust');
var DataViewer = require('./DataViewer');

module.exports = React.createClass({
    displayName: 'App',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { activeItem : 'dataviewer', activeView:'current'};
	},
    render : function () {
        const { activeItem, activeView } = this.state
        return (
            <div>
                <Menu stackable>
                    <Menu.Item>
                        <img src='http://semantic-ui.com/images/logo.png' />
                    </Menu.Item>

                    <Menu.Item
                    name='dataviewer'
                    active={activeItem === 'dataviewer'}
                    onClick={this.handleItemClick}
                    >
                    Data Viewer
                    </Menu.Item>

                    <Menu.Item
                    name='datamanager'
                    active={activeItem === 'datamanager'}
                    onClick={this.handleItemClick}
                    >
                    Data Manager
                    </Menu.Item>

                    <Menu.Menu position='right'>
                        <Dropdown as={Menu.Item} text='Language'>
                            <Dropdown.Menu>
                            <Dropdown.Item>English</Dropdown.Item>
                            <Dropdown.Item>Russian</Dropdown.Item>
                            <Dropdown.Item>Spanish</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Menu.Item>
                            <Button primary>Sign Up</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <DataViewer activeView={activeView}/>
            </div>
        )
    },
    handleItemClick : function(e, { name }) {
        this.setState({activeItem : name});
    }
});