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

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropdownHeader(props) {
  var className = props.className;
  var children = props.children;
  var content = props.content;
  var icon = props.icon;

  var classes = (0, _classnames2.default)('header', className);
  var rest = (0, _lib.getUnhandledProps)(DropdownHeader, props);
  var ElementType = (0, _lib.getElementType)(DropdownHeader, props);

  if (children) {
    return _react2.default.createElement(
      ElementType,
      _extends({ className: classes }, rest),
      children
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    (0, _factories.createIcon)(icon),
    content
  );
}

DropdownHeader._meta = {
  name: 'DropdownHeader',
  parent: 'Dropdown',
  type: _lib.META.TYPES.MODULE
};

DropdownHeader.propTypes = {
  /** An element type to render as (string or function) */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the header, same as content. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content', 'icon']), _react.PropTypes.node]),

  /** Additional classes */
  className: _react.PropTypes.node,

  /** Primary content of the header, same as children. */
  content: _react.PropTypes.node,

  /** Add an icon by icon name or pass an <Icon /> */
  icon: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.object])
};

exports.default = DropdownHeader;