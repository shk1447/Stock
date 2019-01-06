'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropdownMenu(props) {
  var children = props.children;
  var className = props.className;

  var classes = (0, _classnames2.default)('menu transition', className);
  var rest = (0, _lib.getUnhandledProps)(DropdownMenu, props);
  var ElementType = (0, _lib.getElementType)(DropdownMenu, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

DropdownMenu._meta = {
  name: 'DropdownMenu',
  parent: 'Dropdown',
  type: _lib.META.TYPES.MODULE
};

DropdownMenu.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Should be <Dropdown.Item /> components. */
  children: _react.PropTypes.node,

  /** Classes to add to the className. */
  className: _react.PropTypes.string
};

exports.default = DropdownMenu;