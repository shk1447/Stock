var {Modal,Header} = require('stardust')

module.exports = React.createClass({
    displayName: 'MessageBox',
    componentDidMount : function() {
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return { active: this.props.active, title:this.props.title, message : this.props.message };
	},
    render : function () {
        const {active, title, message} = this.state;
        return (
            <Modal basic size='small' active={active} onHide={this.hide}>
                <Header>{title}</Header>
                <Modal.Content>
                    <p>{message}</p>
                </Modal.Content>
            </Modal>
        )
    },
    hide:function(){
        this.setState({active:false});
    }
});