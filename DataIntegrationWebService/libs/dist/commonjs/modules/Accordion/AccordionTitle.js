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

function AccordionTitle(props) {
  var active = props.active;
  var children = props.children;
  var className = props.className;
  var onClick = props.onClick;

  var classes = (0, _classnames2.default)('title', (0, _lib.useKeyOnly)(active, 'active'), className);

  var handleClick = function handleClick(e) {
    if (onClick) onClick(e);
  };

  var ElementType = (0, _lib.getElementType)(AccordionTitle, props);
  var rest = (0, _lib.getUnhandledProps)(AccordionTitle, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, onClick: handleClick }),
    children
  );
}

AccordionTitle.displayName = 'AccordionTitle';

AccordionTitle.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Whether or not the title is in the open state. */
  active: _react.PropTypes.bool,

  /** Primary content of the Title. */
  children: _react.PropTypes.node,

  /** Classes to add to the title className. */
  className: _react.PropTypes.string,

  /** Called with (event, index) on title click. */
  onClick: _react.PropTypes.func
};

AccordionTitle._meta = {
  name: 'AccordionTitle',
  type: _lib.META.TYPES.MODULE,
  parent: 'Accordion'
};

exports.default = AccordionTitle;