var React = require('react');
var { Component } = require('react');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var editor = require('../../libs/chart/FreeChartEditor');
var connector = require('../../libs/connector/WebSocketClient.js')
var ModalForm = require('../Common/ModalForm');
var { Sidebar, Form, Segment } = require('semantic-ui-react');
var hmm = require('vis');
module.exports = React.createClass({
    displayName: 'Editor',
    clusterSettings : [
    ],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        console.log(hmm);
        var me = this;
        editor.initialize('chart',this.actionByEditor);
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
                    var settings = [{
                        value:'name', text:"CLUSTER NAME", type:'Text', group:0
                    }]
                    _.forEach(tabInfo.view_options.view_fields, function(value,key){
                        var setting = {
                            value:value, text:value, type:'Text', group:Math.floor((parseInt(key)+2) / 2)
                        }
                        settings.push(setting);
                    });
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
        var data = {"broadcast":false,"target":"cluster", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"],"view_type":"current"}};
        connector.socket.emit('fromclient', data);

        var data = [{id: 1, content: 'item 1', start: '2017-06-20'}];
        var options = {};
        var container = document.getElementById('timeline');
        var timeline = new hmm.Timeline(container, data, options);
    },
    componentWillUnmount : function () {
        connector.socket.off('cluster.getlist').off('cluster.gettab');
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {visible:false, mode:false};
	},
    render : function () {
        var me = this;
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
    playback: function(index) {
        console.log(index);
    },
    applyCluster: function(result) {
        this._deferred.resolve(result);
    },
    actionByEditor: function(action) {
        this._deferred = $.Deferred();
        if(action.name === "addCluster") {
            this.refs.ModalForm.setState({active:true});
        } else if (action.name === "showInfoPanel") {
            this.setState({visible : !this.state.visible})
        } else if (action.name === "showPlaybackPanel") {
            this.setState({mode : !this.state.mode})
        }
        this._deferred.promise();
        return this._deferred;
    }
});