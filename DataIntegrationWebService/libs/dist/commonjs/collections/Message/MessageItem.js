'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MessageItem(props) {
  var children = props.children;

  var rest = (0, _lib.getUnhandledProps)(MessageItem, props);
  var ElementType = (0, _lib.getElementType)(MessageItem, props);

  return _react2.default.createElement(
    ElementType,
    rest,
    children
  );
}

MessageItem._meta = {
  name: 'MessageItem',
  parent: 'Message',
  type: _lib.META.TYPES.COLLECTION
};

MessageItem.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content. */
  children: _react.PropTypes.node
};

MessageItem.defaultProps = {
  as: 'li'
};

exports.default = MessageItem;