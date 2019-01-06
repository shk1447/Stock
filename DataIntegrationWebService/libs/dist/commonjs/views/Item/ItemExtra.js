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
 * An item can contain extra content meant to be formatted separately from the main content
 * */
function ItemExtra(props) {
  var children = props.children;
  var className = props.className;
  var content = props.content;

  var classes = (0, _classnames2.default)(className, 'extra');
  var rest = (0, _lib.getUnhandledProps)(ItemExtra, props);
  var ElementType = (0, _lib.getElementType)(ItemExtra, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || content
  );
}

ItemExtra._meta = {
  name: 'ItemExtra',
  parent: 'Item',
  type: _lib.META.TYPES.VIEW
};

ItemExtra.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the ItemExtra. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the ItemExtra className. */
  className: _react.PropTypes.string,

  /** Primary content of the ItemExtra. Mutually exclusive with the children prop. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = ItemExtra;