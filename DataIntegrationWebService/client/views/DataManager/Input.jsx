var DataTable = require('../Common/DataTable');
var MessageBox = require('../Common/MessageBox');

module.exports = React.createClass({
    displayName: 'Input',
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
        return {};
    },
    render : function () {
        var fields = [
            {
                "text": "CATEGORY",
                "value": "category",
                "type": "Text",
                "group": 0,
                "required": true
            },
            {
                "text": "rawdata",
                "value": "rawdata",
                "type": "AddFields",
                "group": 1,
                "required": true
            }
        ];
        var data = [];
        var filters = [];
        
        return (
            <div style={{height:document.documentElement.offsetHeight - 77 + 'px',width:document.documentElement.offsetWidth + 'px'}}>
                <DataTable ref='InputTable' key={'input'} data={data} fields={fields} filters={filters} updatable repeatable={false} callback={this.callbackInput}/>
                <MessageBox ref='alert_messagebox' />
            </div>
        )
    },
    callbackCollection : function (result) {

    }
});