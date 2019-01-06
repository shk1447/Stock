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
 * Button.Group
 */
function ButtonGroup(props) {
  var attached = props.attached;
  var basic = props.basic;
  var children = props.children;
  var className = props.className;
  var color = props.color;
  var icon = props.icon;
  var labeled = props.labeled;
  var size = props.size;
  var vertical = props.vertical;
  var widths = props.widths;


  var classes = (0, _classnames2.default)('ui', size, color, (0, _lib.useValueAndKey)(attached, 'attached'), (0, _lib.useKeyOnly)(basic, 'basic'), (0, _lib.useKeyOnly)(icon, 'icon'), (0, _lib.useKeyOnly)(labeled, 'labeled'), (0, _lib.useKeyOnly)(vertical, 'vertical'), (0, _lib.useWidthProp)(widths), 'buttons', className);

  var rest = (0, _lib.getUnhandledProps)(ButtonGroup, props);
  var ElementType = (0, _lib.getElementType)(ButtonGroup, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

ButtonGroup._meta = {
  name: 'ButtonGroup',
  parent: 'Button',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    attached: ['left', 'right', 'top', 'bottom'],
    color: _lib.SUI.COLORS,
    size: _lib.SUI.SIZES,
    widths: _lib.SUI.WIDTHS
  }
};

ButtonGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A button can be attached to the top or bottom of other content */
  attached: _react.PropTypes.oneOf(ButtonGroup._meta.props.attached),

  /** Groups can be less pronounced */
  basic: _react.PropTypes.bool,

  /** Additional classes */
  className: _react.PropTypes.string,

  /** Primary content, intended to be Button elements */
  children: _react.PropTypes.any,

  /** Groups can have a shared color */
  color: _react.PropTypes.oneOf(ButtonGroup._meta.props.color),

  /** Groups can be formatted as icons */
  icon: _react.PropTypes.bool,

  /** Groups can be formatted as labeled icon buttons */
  labeled: _react.PropTypes.bool,

  /** Groups can have different sizes */
  size: _react.PropTypes.oneOf(ButtonGroup._meta.props.size),

  /** Groups can be formatted to appear vertically */
  vertical: _react.PropTypes.bool,

  /** Groups can have their widths divided evenly */
  widths: _react.PropTypes.oneOf(ButtonGroup._meta.props.widths)
};

exports.default = ButtonGroup;