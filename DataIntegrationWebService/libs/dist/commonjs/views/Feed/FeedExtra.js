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

function FeedExtra(props) {
  var children = props.children;
  var className = props.className;
  var images = props.images;
  var text = props.text;

  var classes = (0, _classnames2.default)(className, (0, _lib.useKeyOnly)(images, 'images'), (0, _lib.useKeyOnly)(text, 'text'), 'extra');
  var rest = (0, _lib.getUnhandledProps)(FeedExtra, props);
  var ElementType = (0, _lib.getElementType)(FeedExtra, props);

  if (Array.isArray(images)) {
    var imagesJSX = images.map(function (image, index) {
      var key = [index, image].join('-');

      return (0, _factories.createImg)(image, { key: key });
    });

    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      imagesJSX
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || text
  );
}

FeedExtra._meta = {
  name: 'FeedExtra',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedExtra.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedExtra. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the FeedExtra className. */
  className: _react.PropTypes.string,

  /** An event can contain additional information like a set of images. */
  images: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['text']), _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.arrayOf(_react.PropTypes.string)])]),

  /** An event can contain additional information like a set of images. */
  text: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['images']), _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.string])])
};

exports.default = FeedExtra;