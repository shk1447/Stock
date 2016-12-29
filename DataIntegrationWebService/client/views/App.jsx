var React = require('react');
var io = require('socket.io-client');
var { Container, Icon, Label, Menu, Dropdown, Button, Grid, Segment } = require('stardust');
var cookies = require('browser-cookies');

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
                            <Icon name='user' />{sessionStorage['member_name']}
                        </span>
                        )
        if(sessionStorage['privilege'] == "super") {
            var collectionPage = <Dropdown.Item onClick={this.handleDataManager}>Collection</Dropdown.Item>,
                analysisPage = <Dropdown.Item onClick={this.handleDataManager}>Analysis</Dropdown.Item>; 
        }
        return (
            <div>
                <Menu>
                    <Menu.Item>
                        <Icon name='users' circular />
                    </Menu.Item>
                    
                    <Menu.Item name='dataview' onClick={this.handleDataViewer}>
                        Viewer
                    </Menu.Item>

                    <Dropdown as={Menu.Item} text='Manager'>
                        <Dropdown.Menu>
                            {collectionPage}
                            {analysisPage}
                            <Dropdown.Item onClick={this.handleDataManager}>View</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Dropdown trigger={trigger}>
                                <Dropdown.Menu>
                                    <Dropdown.Item disabled>
                                        Signed in as <strong>{sessionStorage['member_id']}</strong>
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
        cookies.erase('accessToken');
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