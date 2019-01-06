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

function AccordionContent(props) {
  var active = props.active;
  var children = props.children;
  var className = props.className;

  var classes = (0, _classnames2.default)('content', (0, _lib.useKeyOnly)(active, 'active'), className);
  var rest = (0, _lib.getUnhandledProps)(AccordionContent, props);
  var ElementType = (0, _lib.getElementType)(AccordionContent, props);
  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

AccordionContent.displayName = 'AccordionContent';

AccordionContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Whether or not the content is visible. */
  active: _react.PropTypes.bool,

  /** Primary content of the Content. */
  children: _react.PropTypes.node,

  /** Classes to add to the content className. */
  className: _react.PropTypes.string
};

AccordionContent._meta = {
  name: 'AccordionContent',
  type: _lib.META.TYPES.MODULE,
  parent: 'Accordion'
};

exports.default = AccordionContent;