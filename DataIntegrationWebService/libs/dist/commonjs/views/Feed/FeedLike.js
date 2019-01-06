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

function FeedLike(props) {
  var children = props.children;
  var className = props.className;
  var icon = props.icon;
  var like = props.like;

  var classes = (0, _classnames2.default)(className, 'like');
  var rest = (0, _lib.getUnhandledProps)(FeedLike, props);
  var ElementType = (0, _lib.getElementType)(FeedLike, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    (0, _factories.createIcon)(icon),
    children || like
  );
}

FeedLike._meta = {
  name: 'FeedLike',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedLike.defaultProps = {
  as: 'a',
  icon: 'like'
};

FeedLike.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedLike. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['like']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedLike className. */
  className: _react.PropTypes.string,

  /** Name of icon for FeedLike. */
  icon: _react.PropTypes.node,

  /** Primary content of the FeedLike, mutually exclusive with children prop. */
  like: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = FeedLike;