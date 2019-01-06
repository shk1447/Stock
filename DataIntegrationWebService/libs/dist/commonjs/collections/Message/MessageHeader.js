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

function MessageHeader(props) {
  var className = props.className;
  var children = props.children;

  var rest = (0, _lib.getUnhandledProps)(MessageHeader, props);
  var classes = (0, _classnames2.default)('header', className);
  var ElementType = (0, _lib.getElementType)(MessageHeader, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

MessageHeader._meta = {
  name: 'MessageHeader',
  parent: 'Message',
  type: _lib.META.TYPES.COLLECTION
};

MessageHeader.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content. */
  children: _react.PropTypes.node,

  /** Additional classes. */
  className: _react.PropTypes.node
};

exports.default = MessageHeader;