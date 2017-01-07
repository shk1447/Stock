var {Loader} = require('stardust')

module.exports = React.createClass({
    displayName: 'Loader',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { active: this.props.active };
	},
    render : function () {
        const {active} = this.state;
        if(active) {
            var loader = <Loader active>Loading...</Loader>;
        }
        return (
            <div>
                {loader}
            </div>
        )
    }
});