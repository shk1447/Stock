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

/**
 * A group of images
 */
function ImageGroup(props) {
  var className = props.className;
  var children = props.children;
  var size = props.size;

  var classes = (0, _classnames2.default)('ui', size, className, 'images');
  var rest = (0, _lib.getUnhandledProps)(ImageGroup, props);
  var ElementType = (0, _lib.getElementType)(ImageGroup, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

ImageGroup._meta = {
  name: 'ImageGroup',
  parent: 'Image',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    size: _lib.SUI.SIZES
  }
};

ImageGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Class names for custom styling. */
  children: _react.PropTypes.any,

  /** Class names for custom styling. */
  className: _react.PropTypes.string,

  /** A group of images can be formatted to have the same size. */
  size: _react.PropTypes.oneOf(ImageGroup._meta.props.size)
};

exports.default = ImageGroup;