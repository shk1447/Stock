var React = require('react');
var io = require('socket.io-client');
var {Form,TextArea} = require('stardust')

module.exports = React.createClass({
    displayName: 'SQLEditor',
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount : function() {
        console.log('render sql editor');
        var self = this;
        var $edit = $(self.refs.sqleditor);
        var $hint = $(self.refs.sqlhint);
        var $mirror = $(self.refs.textAreaMirror);
        $mirror.css('left', $edit.position().left).css('top', $edit.position().top);
        $edit.keyup(function(e){
            self.update();
        });
        $edit.scroll(function(e){
            self.update();
        });
        $edit.mouseup(function(e){
            self.update();
        })
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
            <div>
                <textarea className='sqleditor' ref='sqleditor' onChange={this.props.onChange.bind(this.handleChange)} />
                <div className='textAreaMirror' ref='textAreaMirror'>
                    <span ref='textAreaMirrorInline'></span>
                </div>
                <ul className='hintTracker' ref='hintTracker'>
                    <li>tracker</li>
                </ul>
            </div>
        )
    },
    handleChange : function (e) {
        //console.log(e.target.value);
    },
    handleKeyDown : function(e, commands) {
        console.log(e.ctrlKey);
    },
    update : function () {
        console.log('update');
        var computedStyle = getComputedStyle(this.refs.sqleditor);

        var elementHeight = this.refs.sqleditor.clientHeight;
        var elementWidth = this.refs.sqleditor.clientWidth;

        elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

        this.refs.textAreaMirrorInline.innerHTML = this.refs.sqleditor.value.substr(0, this.refs.sqleditor.selectionStart).replace(/\n$/, "\n");
        var rects = this.refs.textAreaMirrorInline.getClientRects(),
            lastRect = rects[rects.length - 1],
            top = lastRect.top - this.refs.sqleditor.scrollTop + $('.modals.dimmer').scrollTop(),
            left = this.refs.textAreaMirror.offsetLeft + parseFloat(computedStyle.paddingLeft) + (lastRect.width % elementWidth);
        //elementWidth < lastRect.width ? 
        
        console.log(this.refs.textAreaMirror.offsetTop)
        console.log(this.refs.textAreaMirror.offsetLeft)
        console.log(top)
        console.log(left)
        this.refs.hintTracker.style.top = top + "px";
        this.refs.hintTracker.style.left = left + "px";
    }
});