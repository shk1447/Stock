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

var _FeedLike = require('./FeedLike');

var _FeedLike2 = _interopRequireDefault(_FeedLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeedMeta(props) {
  var children = props.children;
  var className = props.className;
  var like = props.like;
  var meta = props.meta;

  var classes = (0, _classnames2.default)(className, 'meta');
  var rest = (0, _lib.getUnhandledProps)(FeedMeta, props);
  var ElementType = (0, _lib.getElementType)(FeedMeta, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    like && _react2.default.createElement(_FeedLike2.default, { like: like }),
    children || meta
  );
}

FeedMeta._meta = {
  name: 'FeedMeta',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedMeta.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedMeta. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['meta']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedMeta className. */
  className: _react.PropTypes.string,

  /** Shorthand for FeedLike. */
  like: _react.PropTypes.node,

  /** Primary content of the FeedMeta. Mutually exclusive with children. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = FeedMeta;