var React = require('react');
var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');
var Loader = require('../Common/Loader');
var editor = require('../../libs/chart/FreeChartEditor');
var connector = require('../../libs/connector/WebSocketClient.js')

module.exports = React.createClass({
    displayName: 'Editor',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        editor.initialize('chart');
        connector.socket.on('collection.getlist', function(data) {
            var $tabs = $('#workspace-tabs');
            $tabs.empty();
            _.forEach(data.result, function(value,key){
                var state = '';
                if(key == 0) {
                    state = ' active'
                }
                var tab = $('<li class="ui-tab ui-draggable'+ state +'" style="width:100%;"><a class="ui-tab-label" title="'
                            + value.name+'"><span>'+value.name+'</span></a></li>');
                $tabs.append(tab);
            });
        });
        var data = {"broadcast":false,"target":"collection", "method":"getlist", "parameters":{}};
        connector.socket.emit('fromclient', data);
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
            </div>
        )
    }
});