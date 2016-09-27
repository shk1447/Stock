var React = require('react');

module.exports = React.createClass({
    displayName: 'DataTable',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
        var exampleData = [
            {
                "key1":"value1",
                "key2":"value2",
                "key3":"value3"
            },
            {
                "key1":"value1",
                "key2":"value2",
                "key3":"value3"
            }
        ];
		return {data: this.props.data};
	},
    render : function () {
        return (
            <div style={{height:'100%', width:'100%', overflow:'auto'}}>
                <table className="table-container" ref="table_container">
                    <thead>
                        <tr>
                            <th>Object ID</th>
                            <th>Object Type</th>
                            <th>Interval</th>
                            <th>Type</th>
                            <th>DataBase</th>
                            <th>Site ID</th>
                            <th>Query Module</th>
                            <th>Query String</th>
                            <th>Log</th>
                            <th>Object ID</th>
                            <th>Object Type</th>
                            <th>Interval</th>
                            <th>Type</th>
                            <th>DataBase</th>
                            <th>Site ID</th>
                            <th>Query Module</th>
                            <th>Query String</th>
                            <th>Log</th>
                            <th>Object ID</th>
                            <th>Object Type</th>
                            <th>Interval</th>
                            <th>Type</th>
                            <th>DataBase</th>
                            <th>Site ID</th>
                            <th>Query Module</th>
                            <th>Query String</th>
                            <th>Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'test3'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td></tr>
                        <tr><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td></tr><tr><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td></tr><tr><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td></tr><tr><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td><td>{'test'}</td><td>{'test1'}</td><td>{'test2'}</td><td>{'test3'}</td><td>{'test4'}</td><td>{'test5'}</td><td>{'test6'}</td><td>{'test7'}</td><td>{'test8'}</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
});