var React = require('react');
var io = require('socket.io-client');
var { Container, Icon, Label, Menu, Dropdown, Button, Grid, Segment } = require('stardust');

module.exports = React.createClass({
    displayName: 'App',
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
		return { activeItem : 'realtime_dataview'};
	},
    render : function () {
        const {children} = this.props;
        const { activeItem, activeView } = this.state;
        const trigger = (
                        <span>
                            <Icon name='user' />
                            Hello, Admin
                        </span>
                        )

        return (
            <div>
                <Menu stackable>
                    <Menu.Item>
                        <img src='http://semantic-ui.com/images/logo.png' />
                    </Menu.Item>
                    
                    <Dropdown as={Menu.Item} text='Data Viewer' name='dataview' >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.handleDataViewer}>RealTime</Dropdown.Item>
                            <Dropdown.Item>History</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown as={Menu.Item} text='Data Manager'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.handleDataManager}>Collection</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleDataManager}>Analysis</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleDataManager}>View</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Dropdown trigger={trigger}>
                                <Dropdown.Menu>
                                    <Dropdown.Item disabled>
                                        Signed in as <strong>Admin</strong>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Your Profile</Dropdown.Item>
                                    <Dropdown.Item>Help</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Settings</Dropdown.Item>
                                    <Dropdown.Item onClick={this.signOut} >Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div>
                    { children }
                </div>
            </div>
        )
    },
    signOut : function(e) {
        console.log('Sign Out');
        this.context.router.replace('/Login/');
    },
    handleDataViewer : function(){
        this.context.router.replace('/App/DataViewer/DataView');
    },
    handleDataManager : function(e,v){
        var route = '/App/DataManager/' + e.target.innerText
        this.context.router.replace(route);
    }
});