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
 * Several icons can be used together as a group
 */
function IconGroup(props) {
  var className = props.className;
  var children = props.children;
  var size = props.size;


  var classes = (0, _classnames2.default)(size, 'icons', className);

  var rest = (0, _lib.getUnhandledProps)(IconGroup, props);
  var ElementType = (0, _lib.getElementType)(IconGroup, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

IconGroup._meta = {
  name: 'IconGroup',
  parent: 'Icon',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    size: _lib.SUI.SIZES
  }
};

IconGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Class names for custom styling. */
  className: _react.PropTypes.string,

  /** Icon children for the Icon group */
  children: _react.PropTypes.any,

  /** Size of the icon group. */
  size: _react.PropTypes.oneOf(IconGroup._meta.props.size)
};

IconGroup.defaultProps = {
  as: 'i'
};

exports.default = IconGroup;