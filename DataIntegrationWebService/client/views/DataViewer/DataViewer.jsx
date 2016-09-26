var React = require('react');
var io = require('socket.io-client');
var { Table } = require('stardust');

module.exports = React.createClass({
    displayName: 'DataViewer',
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
        const hh = [{
            name:"shkim",
            phone:'01057721447',
            state:'서울시 동작구'
        },{
            name:"shkim",
            phone:'01057721447',
            state:'서울시 동작구'
        },{
            name:"shkim",
            phone:'01057721447',
            state:'서울시 동작구'
        }]
		return {data : hh};
	},
    render : function () {
        console.log('render data view');
        const { data } = this.state;
        return (
            <div>
                <Table className='selectable' data={data} onSelectRow={this.handleSelectRow}>
                    <Table.Column dataKey='name' />
                    <Table.Column dataKey='phone' />
                    <Table.Column dataKey='state' />
                </Table>
            </div>
        )
    },
    handleSelectRow : function(e,d){

    }
});