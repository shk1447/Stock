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

function MenuMenu(props) {
  var children = props.children;
  var className = props.className;
  var position = props.position;

  var classes = (0, _classnames2.default)(className, position, 'menu');
  var ElementType = (0, _lib.getElementType)(MenuMenu, props);
  var rest = (0, _lib.getUnhandledProps)(MenuMenu, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

MenuMenu._meta = {
  name: 'MenuMenu',
  type: _lib.META.TYPES.COLLECTION,
  parent: 'Menu',
  props: {
    position: ['right']
  }
};

MenuMenu.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the MenuMenu. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the MenuMenu className. */
  className: _react.PropTypes.string,

  /** A sub menu can take right position. */
  position: _react.PropTypes.oneOf(MenuMenu._meta.props.position)
};

exports.default = MenuMenu;