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

/**
 * Show a feed date
 */
function FeedDate(props) {
  var children = props.children;
  var className = props.className;
  var date = props.date;

  var classes = (0, _classnames2.default)(className, 'date');
  var rest = (0, _lib.getUnhandledProps)(FeedDate, props);
  var ElementType = (0, _lib.getElementType)(FeedDate, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || date
  );
}

FeedDate._meta = {
  name: 'FeedDate',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedDate.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedDate. Mutually exclusive with the date prop. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['date']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedDate className. */
  className: _react.PropTypes.string,

  /** Shorthand for primary content of the FeedDate. Mutually exclusive with the children prop. */
  date: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = FeedDate;