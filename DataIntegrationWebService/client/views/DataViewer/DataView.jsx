var React = require('react');
var io = require('socket.io-client');
var {Menu,Icon} = require('stardust');
var {List} = require('semantic-ui-react');
var DataTable = require('../Common/DataTable');

module.exports = React.createClass({
    displayName: 'DataView',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var self = this;
        this.$ViewList = $(ReactDOM.findDOMNode(this.refs.ViewList));
        
        self.socket = io.connect();
        self.socket.on('view.getlist', function(data) {
            self.setState({viewlist:data});
        });
        var data = {"broadcast":true,"target":"view.getlist", "parameters":{}};
        self.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {activeItem : '',viewlist:[]};
	},
    render : function () {
        console.log('render data view');
        const { activeItem, viewlist } = this.state;
        let viewArr = [];
        _.each(viewlist, function(row,i){
            if(row.view_type == activeItem) {
                let icon = row.view_type == "current" ? "table" : "line chart"
                var item = <List.Item>
                                <List.Icon name={icon} size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header as='a'>{row.name}</List.Header>
                                    <List.Description as='a'>{row.unixtime}</List.Description>
                                </List.Content>
                            </List.Item>;
                viewArr.push(item);
            }
        });
        
        const filters = [];
        return (
            <div>
                <Menu icon vertical floated>
                    <Menu.Item name='current' onClick={this.handleItemClick} active={activeItem === 'current'}>
                        <Icon name='table' />
                    </Menu.Item>

                    <Menu.Item name='past' onClick={this.handleItemClick} active={activeItem === 'past'}>
                        <Icon name='line chart' />
                    </Menu.Item>
                </Menu>
                <div ref='ViewList' style={{height:'900px',position:'absolute',left:'60px',marginLeft:'-600px',boxShadow:'rgba(34, 36, 38, 0.2002) 1px 2px 2px 1px',
                                            zIndex:'1000',borderRadius:'10px',background:'white',display:'none', width:'16%',padding:'15px'}}>
                    <div style={{height:'4%'}}>{activeItem.toUpperCase()}</div>
                    <div style={{height:'96%', overflow:'auto'}}>
                        <List animated divided relaxed verticalAlign='middle'>
                            {viewArr}
                        </List>
                    </div>
                </div>
                <div style={{height:'850px',float:'left',width:'96%'}}>
                    <DataTable key={'dataview'} title={'DataView'} data={[]} fields={[]} filters={filters} searchable callback={this.getData}/>
                </div>
            </div>
        )
    },
    handleItemClick : function (e, {name}) {
        var itemName = name;
        if(this.state.activeItem == name) {
            this.$ViewList.animate({"margin-left": '-=600'});
            itemName = '';
        } else {
            this.$ViewList.show();
            if(this.$ViewList.css("margin-left") == "-600px") {
                this.$ViewList.animate({"margin-left": '+=600'});
            } else {
                this.$ViewList.animate({"margin-left": '-=600'});
                this.$ViewList.animate({"margin-left": '+=600'});
            }
        }
        this.setState({activeItem:itemName});
    },
    getData : function(result) {
        console.log('result : ', result);
    },
    handleSelectRow : function(e,d){

    }
});