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

function HeaderSubheader(props) {
  var children = props.children;
  var className = props.className;
  var content = props.content;

  var classes = (0, _classnames2.default)('sub header', className);
  var rest = (0, _lib.getUnhandledProps)(HeaderSubheader, props);
  var ElementType = (0, _lib.getElementType)(HeaderSubheader, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children || content
  );
}

HeaderSubheader._meta = {
  name: 'HeaderSubheader',
  parent: 'Header',
  type: _lib.META.TYPES.ELEMENT
};

HeaderSubheader.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the HeaderSubheader. Mutually exclusive with content */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes to add to the subheader className. */
  className: _react.PropTypes.string,

  /** Shorthand for primary content. Mutually exclusive with children */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = HeaderSubheader;