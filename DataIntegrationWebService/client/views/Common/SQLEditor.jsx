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
        $edit.keydown(function(e){
            if (e.which == 9) {
                e.preventDefault();
            }
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
    componentWillReceiveProps: function(nextProps) {
        this.setState({defaultValue:nextProps.defaultValue});
    },
    componentWillUnmount : function () {
    },
    componentDidUpdate : function () {
    },
    getInitialState: function() {
		return {schema:_.cloneDeep(this.props.schema), defaultValue:this.props.defaultValue};
	},
    render : function () {
        const { schema, defaultValue } = this.state;
        var liArr = [];
        _.each(schema, function(row,i){
            if(i > 10) return;
            var val = row.name ? row.name : row;
            liArr.push(<li key={i}>{val}</li>)
        });
        return (
            <div>
                <textarea className='sqleditor' ref='sqleditor' value={defaultValue} onChange={this.props.onChange.bind(this.handleChange)} />
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

        var hintArr = text.split(' ');
        var hintText = hintArr[hintArr.length - 1];
        if(key && key == '.') {
            if(key == hintText) {
                this.setState({schema:this.props.schema});
                $(this.refs.hintTracker).show();
            } else if(hintText.length > 1) {
                let deepHintArr = hintText.split('.');
                let lastHintArr = this.props.schema;
                for(var i = 0; i < deepHintArr.length; i++){
                    let hint = deepHintArr[i];
                    if(hint == "") continue;
                    let hints = lastHintArr.find(function(d){
                        var val = d.name ? d.name : d;
                        return val.startsWith(hint);
                    });
                    lastHintArr = hints.items;
                }
                this.setState({schema:lastHintArr});
                $(this.refs.hintTracker).show();
            }
        } else if(key) {
            if(hintText != "") {
                let deepHintArr = hintText.split('.');
                let lastHintText = deepHintArr[deepHintArr.length - 1];
                var selectedItem = this.state.schema.filter(function(d){
                    var val = d.name ? d.name : d;
                    return val.startsWith(lastHintText);
                });
                if(selectedItem.length > 0) {
                    this.setState({schema:selectedItem});
                    $(this.refs.hintTracker).show();
                } else {
                    $(this.refs.hintTracker).hide();
                }
            } else {
                $(this.refs.hintTracker).hide();
            }
        } else {
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