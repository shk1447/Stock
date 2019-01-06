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

var _elements = require('../../elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropdownItem(props) {
  var active = props.active;
  var children = props.children;
  var className = props.className;
  var disabled = props.disabled;
  var description = props.description;
  var icon = props.icon;
  var onClick = props.onClick;
  var selected = props.selected;
  var text = props.text;
  var value = props.value;


  var handleClick = function handleClick(e) {
    if (onClick) onClick(e, value);
  };

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(active, 'active'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useKeyOnly)(selected, 'selected'), 'item', className);
  // add default dropdown icon if item contains another menu
  var iconName = icon || _lib.childrenUtils.someByType(children, 'DropdownMenu') && 'dropdown';
  var iconClasses = (0, _classnames2.default)(iconName, 'icon');
  var ElementType = (0, _lib.getElementType)(DropdownItem, props);
  var rest = (0, _lib.getUnhandledProps)(DropdownItem, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, onClick: handleClick }),
    description && _react2.default.createElement(
      'span',
      { className: 'description' },
      description
    ),
    iconName && _react2.default.createElement(_elements.Icon, { name: iconClasses }),
    text,
    children
  );
}

DropdownItem._meta = {
  name: 'DropdownItem',
  parent: 'Dropdown',
  type: _lib.META.TYPES.MODULE
};

DropdownItem.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Style as the currently chosen item. */
  active: _react.PropTypes.bool,

  /** Primary content. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['text']), _react.PropTypes.node]),

  /** Additional className. */
  className: _react.PropTypes.string,

  /** Additional text with less emphasis. */
  description: _react.PropTypes.string,

  /** A dropdown item can be disabled. */
  disabled: _react.PropTypes.bool,

  /** Add an icon to the item. */
  icon: _react.PropTypes.string,

  /**
   * The item currently selected by keyboard shortcut.
   * This is not the active item.
   */
  selected: _react.PropTypes.bool,

  /** Display text. */
  text: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])]),

  /** Stored value */
  value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),

  /** Called on click with (event, value, text). */
  onClick: _react.PropTypes.func
};

exports.default = DropdownItem;