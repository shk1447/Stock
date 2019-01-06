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

function ModalContent(props) {
  var children = props.children;
  var image = props.image;
  var className = props.className;


  var classes = (0, _classnames2.default)(className, (0, _lib.useKeyOnly)(image, 'image'), 'content');

  var rest = (0, _lib.getUnhandledProps)(ModalContent, props);
  var ElementType = (0, _lib.getElementType)(ModalContent, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

ModalContent._meta = {
  name: 'ModalContent',
  type: _lib.META.TYPES.MODULE,
  parent: 'Modal'
};

ModalContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the modal content */
  children: _react.PropTypes.any,

  /** Classes to add to the modal content className */
  className: _react.PropTypes.string,

  /** A modal can contain image content */
  image: _react.PropTypes.bool
};

exports.default = ModalContent;