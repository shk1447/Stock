var React = require('react');
var { Component } = require('react');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var editor = require('../../libs/chart/FreeChartEditor');
var connector = require('../../libs/connector/WebSocketClient.js')
var ModalForm = require('../Common/ModalForm');
var { Sidebar, Form, Segment, Table, Header } = require('semantic-ui-react');
var vis = require('vis');
module.exports = React.createClass({
    displayName: 'Editor',
    clusterSettings : [
    ],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var me = this;

        editor.initialize('chart',this.actionByEditor);

        var end = new Date();
        var start = new Date(); start.setDate(end.getDate()-1);
        var data = [{id: 1, content: '', start:start.format('yyyy-MM-dd HH:mm:ss'),end:end.format('yyyy-MM-dd HH:mm:ss'),
                    editable:{remove:false,updateTime:true}}]
        var options = {editable:false, zoomable:true,onUpdate:me.controlTimeline,onMove: me.moveTimeline,onMoving:me.movingTimeline};
        var container = document.getElementById('timeline');
        me.timeline = new vis.Timeline(container, data, options);

        connector.socket.on('cluster.getlist', function(data) {
            var $tabs = $('#workspace-tabs');
            $tabs.empty();
            _.forEach(data, function(value,key){
                var state = '';
                value.clusters = value.clusters ? value.clusters : [];
                var $tab = $('<li class="ui-tab ui-draggable" style="width:100%;"><a class="ui-tab-label" title="'
                            + value.name+'"><span>'+value.name+'</span></a></li>');
                $tab.data('data', value);
                $tab.on('click', function() {
                    var tabInfo = $(this).data('data');
                    $('.ui-tab.ui-draggable').removeClass('active');
                    $(this).addClass('active');
                    editor.setTab(tabInfo);
                    var settings = [{value:'name', text:"CLUSTER NAME", type:'Text', group:0, required:true}];
                    var lastIndex;
                    var sort_field_options = [];
                    _.forEach(tabInfo.view_options.view_fields, function(value,key){
                        var groupIndex = Math.floor((parseInt(key)+2) / 2);
                        var setting = {
                            value:value, text:value, type:'Text', group:groupIndex
                        }
                        settings.push(setting);
                        sort_field_options.push({value:value, text:value});
                        lastIndex = groupIndex;
                    });
                    var sort_method_options =[{value:'ASC',text:'오름차순'},{value:'DESC',text:'내림차순'}];
                    settings.push({value:'sort_field', text:"SORT FIELD", type:'Select', group:lastIndex + 1, options:sort_field_options},
                                  {value:'sort_method', text:"SORT METHOD", type:'Select', group:lastIndex + 1, options:sort_method_options},
                                  {value:'sort_limit', text:"LIMIT", type:'Number', group:lastIndex + 1});
                    me.refs.ModalForm.setState({fields:settings});
                    var data = {"broadcast":false,"target":"cluster", "method":"gettab", "parameters":{"name":tabInfo.name}};
                    connector.socket.emit('fromclient', data);
                });
                $tabs.append($tab);
            });
        });
        connector.socket.on('cluster.gettab', function(data) {
            editor.setData(data);
        });
        connector.socket.on('cluster.getplayback', function(data){
            if(data.fields !== null && data.data !== null) {
                editor.setData(data)
            }
        });
        var data = {"broadcast":false,"target":"cluster", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"],"view_type":"current"}};
        connector.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        connector.socket.off('cluster.getlist').off('cluster.gettab').off('cluster.getplayback')
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {visible:false, mode:false, playback:[], info:{}};
	},
    render : function () {
        var me = this;
        var rowArr = [];
        _.forEach(me.state.info, function(d,i){
            var table_row = <Table.Row key={i}><Table.Cell collapsing>{i}</Table.Cell><Table.Cell>{d}</Table.Cell></Table.Row>;
            rowArr.push(table_row);
        })
        return (
            <div id="workspace" style={{marginTop:'-10px'}}>
                <div className="ui-tabs ui-tabs-add ui-tabs-scrollable">
                    <div className="ui-tabs-scroll-container">
                        <ul id="workspace-tabs" style={{width: '100%'}}>
                        </ul>
                    </div>
                    <div className="ui-tab-button ui-tab-scroll ui-tab-scroll-left">
                        <a href="#" style={{display:'block'}}><i className="fa fa-caret-left"></i></a>
                    </div>
                    <div className="ui-tab-button ui-tab-scroll ui-tab-scroll-right">
                        <a href="#" style={{display:'block'}}><i className="fa fa-caret-right"></i></a>
                    </div>
                </div>
                <Sidebar.Pushable as={Segment} style={{overflow:'hidden'}}>
                    <Sidebar as={Form}
                            animation='overlay'
                            width='very wide'
                            direction = {'right'}
                            visible={me.state.visible}
                            className={'edit_panel'}>
                        <Table compact celled definition selectable unstackable>
                            <Table.Header fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='2'>
                                        <Header floated='left' as='h3' color='blue'>INFORMATION</Header>
                                    </Table.HeaderCell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.HeaderCell>KEY</Table.HeaderCell>
                                    <Table.HeaderCell>VALUE</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rowArr}
                            </Table.Body>
                        </Table>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Sidebar animation='overlay' width='very thin'
                            direction = {'top'}
                            visible={me.state.mode}
                            className={'edit_panel'}>
                                <div id="timeline"></div>
                        </Sidebar>
                        <Sidebar.Pusher>
                            <div id="chart"></div>
                        </Sidebar.Pusher>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                <ModalForm ref='ModalForm' action={'insert'} size={'large'} title={'CLUSTER SETTING'} active={false}
                    fields={me.clusterSettings} data={[]} callback={this.applyCluster}/>
            </div>
        )
    },
    movingTimeline: function(item, callback) {
        item.moving = true;
        callback(item);
    },
    moveTimeline: function(item, callback) {
        var currentTab = editor.getTab();
        var data = {"broadcast":false,"target":"cluster", "method":"getplayback",
                    "parameters":{"start":item.start.getTime()/1000,"end":item.end.getTime()/1000,"view":currentTab}};
        connector.socket.emit('fromclient', data);
    },
    controlTimeline:function(item, callback) {
        console.log(item);
    },
    applyCluster: function(result) {
        this._deferred.resolve(result);
    },
    actionByEditor: function(action) {
        this._deferred = $.Deferred();
        if(action.name === "addCluster") {
            this.refs.ModalForm.setState({active:true});
        } else if (action.name === "showInfoPanel") {
            this.setState({visible : !this.state.visible, info:action.data})
        } else if(action.name === "clickInfo") {
            this.setState({info:action.data});
        } else if (action.name === "showPlaybackPanel") {
            this.setState({mode : !this.state.mode})
        }
        this._deferred.promise();
        return this._deferred;
    }
});