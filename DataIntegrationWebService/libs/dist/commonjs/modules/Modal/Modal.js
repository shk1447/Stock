'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ModalHeader = require('./ModalHeader');

var _ModalHeader2 = _interopRequireDefault(_ModalHeader);

var _ModalContent = require('./ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

var _ModalActions = require('./ModalActions');

var _ModalActions2 = _interopRequireDefault(_ModalActions);

var _ModalDescription = require('./ModalDescription');

var _ModalDescription2 = _interopRequireDefault(_ModalDescription);

var _reactPortal = require('react-portal');

var _reactPortal2 = _interopRequireDefault(_reactPortal);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _lib.makeDebugger)('modal');

var _meta = {
  name: 'Modal',
  type: _lib.META.TYPES.MODULE,
  props: {
    size: ['fullscreen', 'large', 'small'],
    dimmer: ['inverted', 'blurring']
  }
};

/**
 * A modal displays content that temporarily blocks interactions with the main view of a site
 * @see Confirm
 */

var Modal = function (_Component) {
  _inherits(Modal, _Component);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.onHide = function () {
      debug('onHide()');
      var onHide = _this.props.onHide;

      if (onHide) onHide();
    }, _this.handleHide = function () {
      debug('handleHide()');

      // Always remove all dimmer classes.
      // If the dimmer value changes while the modal is open,
      //   then removing its current value could leave cruft classes previously added.
      document.body.classList.remove('blurring', 'dimmable', 'dimmed', 'scrollable');

      document.removeEventListener('keydown', _this.handleDocumentKeyDown);
      document.removeEventListener('click', _this.handleClickOutside);
    }, _this.handleShow = function () {
      debug('handleShow()');
      var dimmer = _this.props.dimmer;

      if (dimmer) {
        debug('adding dimmer');
        document.body.classList.add('dimmable', 'dimmed');

        if (dimmer === 'blurring') {
          debug('adding blurred dimmer');
          document.body.classList.add('blurring');
        }
      }

      document.addEventListener('keydown', _this.handleDocumentKeyDown);
      document.addEventListener('click', _this.handleClickOutside);
    }, _this.handleClickOutside = function (e) {
      // do nothing when clicking inside the modal or if clickOnClickOutside is disabled
      var closeOnClickOutside = _this.props.closeOnClickOutside;

      if (!closeOnClickOutside || _this._modalNode.contains(e.target)) return;

      debug('handleDimmerClick()');

      e.stopPropagation();
      _this.onHide();
    }, _this.handleDocumentKeyDown = function (e) {
      var closeOnEscape = _this.props.closeOnEscape;

      var key = _lib.keyboardKey.getCode(e);
      debug('handleDocumentKeyDown()', key);

      switch (key) {
        case _lib.keyboardKey.Escape:
          if (closeOnEscape) {
            _this.onHide();
          }

          break;
        default:
          break;
      }
    }, _this.setPosition = function () {
      if (_this._modalNode) {
        var _this$_modalNode$getB = _this._modalNode.getBoundingClientRect();

        var height = _this$_modalNode$getB.height;

        var scrolling = height >= window.innerHeight;

        var newState = {
          marginTop: -Math.round(height / 2),
          scrolling: scrolling
        };

        // add/remove scrolling class on body
        if (!_this.state.scrolling && scrolling) {
          document.body.classList.add('scrolling');
        } else if (_this.state.scrolling && !scrolling) {
          document.body.classList.remove('scrolling');
        }

        if (!(0, _isEqual3.default)(newState, _this.state)) {
          _this.setState(newState);
        }
      }

      requestAnimationFrame(_this.setPosition);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Modal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      debug('componentWillMount()');
      var active = this.props.active;


      if (active) this.handleShow();

      this.setPosition();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      debug('componentDidUpdate()');

      if (!prevProps.active && this.props.active) {
        debug('modal changed to shown');
        this.handleShow();
      } else if (prevProps.active && !this.props.active) {
        debug('modal changed to hidden');
        this.handleHide();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug('componentWillUnmount()');
      this.handleHide();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var active = _props.active;
      var basic = _props.basic;
      var children = _props.children;
      var className = _props.className;
      var dimmer = _props.dimmer;
      var size = _props.size;
      var _state = this.state;
      var marginTop = _state.marginTop;
      var scrolling = _state.scrolling;

      var classes = (0, _classnames2.default)('ui', size, (0, _lib.useKeyOnly)(basic, 'basic'), (0, _lib.useKeyOnly)(scrolling, 'scrolling'), 'modal', (0, _lib.useKeyOnly)(active, 'transition visible active'), className);
      var rest = (0, _lib.getUnhandledProps)(Modal, this.props);
      var ElementType = (0, _lib.getElementType)(Modal, this.props);

      var modalJSX = _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes, style: { marginTop: marginTop }, ref: function ref(c) {
            return _this2._modalNode = c;
          } }),
        children
      );

      // wrap dimmer modals
      var dimmerClasses = !dimmer ? null : (0, _classnames2.default)('ui', dimmer === 'inverted' && 'inverted', (0, _lib.useKeyOnly)(active, 'transition visible active'), 'page modals dimmer');

      // Heads up!
      //
      // The SUI CSS selector to prevent the modal itself from blurring requires an immediate .dimmer child:
      // .blurring.dimmed.dimmable>:not(.dimmer) { ... }
      //
      // The .blurring.dimmed.dimmable is the body, so that all body content inside is blurred.
      // We need the immediate child to be the dimmer to :not() blur the modal itself!
      // Otherwise, the portal div is also blurred, blurring the modal.
      //
      // We cannot them wrap the modalJSX in an actual <Dimmer /> instead, we apply the dimmer classes to the <Portal />.

      return _react2.default.createElement(
        _reactPortal2.default,
        { isOpened: active, className: dimmerClasses },
        modalJSX
      );
    }
  }]);

  return Modal;
}(_react.Component);

Modal.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the modal. Consider using ModalHeader, ModalContent or ModalActions here */
  children: _react.PropTypes.node,

  /** Classes to add to the modal className */
  className: _react.PropTypes.string,

  /** An active modal is visible on the page */
  active: _react.PropTypes.bool,

  /** A modal can reduce its complexity */
  basic: _react.PropTypes.bool,

  /** Closes the modal if Escape is pressed */
  closeOnEscape: _react.PropTypes.bool,

  /** Closes the modal if user clicks anywhere outside the modal */
  closeOnClickOutside: _react.PropTypes.bool,

  /** A modal can appear in a dimmer */
  dimmer: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.dimmer)]),

  /** A modal can vary in size */
  size: _react.PropTypes.oneOf(_meta.props.size),

  /** Called when the modal is hidden */
  onHide: _react.PropTypes.func
};
Modal.defaultProps = {
  dimmer: true,
  closeOnEscape: true,
  closeOnClickOutside: true
};
Modal._meta = _meta;
Modal.Header = _ModalHeader2.default;
Modal.Content = _ModalContent2.default;
Modal.Description = _ModalDescription2.default;
Modal.Actions = _ModalActions2.default;
exports.default = Modal;