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

function FeedUser(props) {
  var children = props.children;
  var className = props.className;
  var user = props.user;

  var classes = (0, _classnames2.default)(className, 'user');
  var rest = (0, _lib.getUnhandledProps)(FeedUser, props);
  var ElementType = (0, _lib.getElementType)(FeedUser, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || user
  );
}

FeedUser._meta = {
  name: 'FeedUser',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedUser.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedUser. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['user']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedUser className. */
  className: _react.PropTypes.string,

  /** Shorthand for primary content of the FeedUser. Mutually exclusive with the children prop. */
  user: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

FeedUser.defaultProps = {
  as: 'a'
};

exports.default = FeedUser;