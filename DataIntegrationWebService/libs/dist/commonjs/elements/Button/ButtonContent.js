'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used in some Button types, such as `animated`
 */
function ButtonContent(props) {
  var children = props.children;
  var className = props.className;
  var hidden = props.hidden;
  var visible = props.visible;

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(visible, 'visible'), (0, _lib.useKeyOnly)(hidden, 'hidden'), 'content', className);

  var rest = (0, _lib.getUnhandledProps)(ButtonContent, props);
  var ElementType = (0, _lib.getElementType)(ButtonContent, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

ButtonContent._meta = {
  name: 'ButtonContent',
  parent: 'Button',
  type: _lib.META.TYPES.ELEMENT
};

ButtonContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Initially visible, hidden on hover */
  visible: _react.PropTypes.bool,

  /** Initially hidden, visible on hover */
  hidden: _react.PropTypes.bool,

  /** Additional classes */
  className: _react.PropTypes.string,

  /** Primary content, intended to the Button children */
  children: _react.PropTypes.any
};

exports.default = ButtonContent;