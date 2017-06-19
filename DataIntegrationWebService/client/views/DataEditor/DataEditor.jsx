var React = require('react');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var editor = require('../../libs/chart/FreeChartEditor');
var connector = require('../../libs/connector/WebSocketClient.js')
var ModalForm = require('../Common/ModalForm');

module.exports = React.createClass({
    displayName: 'Editor',
    clusterSettings : [
    ],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        var me = this;
        editor.initialize('chart',this.addCluster);
        connector.socket.on('cluster.getlist', function(data) {
            var $tabs = $('#workspace-tabs');
            $tabs.empty();
            _.forEach(data, function(value,key){
                var state = '';
                value.clusters = value.clusters ? value.clusters : [];
                if(key == 0) {
                    state = ' active'
                    editor.setTab(value);
                    var settings = [{
                        value:'name', text:"CLUSTER NAME", type:'Text', group:0
                    }]
                    _.forEach(value.view_options.view_fields, function(value,key){
                        var setting = {
                            value:value, text:value, type:'Text', group:Math.floor((parseInt(key)+2) / 2)
                        }
                        settings.push(setting);
                    });
                    me.refs.ModalForm.setState({fields:settings});
                }
                var $tab = $('<li class="ui-tab ui-draggable'+ state +'" style="width:100%;"><a class="ui-tab-label" title="'
                            + value.name+'"><span>'+value.name+'</span></a></li>');
                $tab.data('data', value);
                $tab.on('click', function(){
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
                });
                $tabs.append($tab);
            });
        });
        var data = {"broadcast":false,"target":"cluster", "method":"getlist", "parameters":{"member_id":sessionStorage["member_id"],"view_type":"current"}};
        connector.socket.emit('fromclient', data);
    },
    componentWillUnmount : function () {
        connector.socket.off('cluster.getlist');
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {};
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
                <div id="chart"></div>
                <ModalForm ref='ModalForm' action={'insert'} size={'large'} title={'CLUSTER SETTING'} active={false}
                    fields={me.clusterSettings} data={[]} callback={this.applyCluster}/>
            </div>
        )
    },
    applyCluster: function(result) {
        this._deferred.resolve(result);
    },
    addCluster: function(data) {
        this._deferred = $.Deferred();
        this.refs.ModalForm.setState({active:true});
        this._deferred.promise();
        return this._deferred;
    }
});