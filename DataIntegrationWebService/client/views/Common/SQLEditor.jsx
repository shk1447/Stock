var React = require('react');
var io = require('socket.io-client');
var {Form,TextArea} = require('stardust');

module.exports = React.createClass({
    displayName: 'SQLEditor',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        console.log('render sql editor');
        var self = this;
        var $edit = $(self.refs.sqleditor);
        var $hint = $(self.refs.hintTracker);
        $hint.hide();
        $hint.click(function(e){
            console.log(e.target.innerText);
        });
        $edit.keyup(function(e){
            self.update(e.key);
        });
        $edit.scroll(function(e){
            self.update();
        });
        $edit.mouseup(function(e){
            self.update();
        });
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {options:_.cloneDeep(this.props.options)};
	},
    render : function () {
        const { options } = this.state;
        var liArr = [];
        _.each(options, function(row,i){
            liArr.push(<li key={i}>{row.name}</li>)
        });
        return (
            <div>
                <textarea className='sqleditor' ref='sqleditor' onChange={this.props.onChange.bind(this.handleChange)} />
                <ul className='hintTracker' ref='hintTracker'>
                    {liArr}
                </ul>
            </div>
        )
    },
    handleChange : function (e) {
        //console.log(e.target.value);
    },
    update : function (key) {
        var computedStyle = getComputedStyle(this.refs.sqleditor);
        var elementWidth = this.refs.sqleditor.clientWidth;
        elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        let text = this.refs.sqleditor.value.substr(0, this.refs.sqleditor.selectionStart).replace(/\n$/, "\n");
        let textArr = text.split("\n");
        if(textArr.length > 1) text = textArr[textArr.length - 1];

        if(key && key == '.') {
            var hintArr = text.split(' ');
            var hintText = hintArr[hintArr.length - 1];
            if(key == hintText) {
                $(this.refs.hintTracker).show();
            }
        } else if(key) {
            $(this.refs.hintTracker).hide();
        }

        let ctx = document.createElement('canvas').getContext('2d');
        ctx.font = computedStyle.font;
        let measureResult = ctx.measureText(text);
        let fontHeight = parseInt(computedStyle.font.match("\/ (.*?)px")[1]);
        let fontWidth = measureResult.width;
        this.refs.hintTracker.style.left = this.refs.sqleditor.offsetLeft + parseFloat(computedStyle.paddingLeft) + (measureResult.width % elementWidth) + "px";
        this.refs.hintTracker.style.top = this.refs.sqleditor.offsetTop + parseFloat(computedStyle.paddingTop) - this.refs.sqleditor.scrollTop +
                                          (measureResult.width / elementWidth + (textArr.length - 1)) * fontHeight + "px";
    }
});