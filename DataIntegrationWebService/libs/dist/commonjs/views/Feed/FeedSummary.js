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

var _FeedDate = require('./FeedDate');

var _FeedDate2 = _interopRequireDefault(_FeedDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeedSummary(props) {
  var children = props.children;
  var className = props.className;
  var date = props.date;
  var summary = props.summary;

  var classes = (0, _classnames2.default)(className, 'summary');
  var rest = (0, _lib.getUnhandledProps)(FeedSummary, props);
  var ElementType = (0, _lib.getElementType)(FeedSummary, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || summary,
    date && _react2.default.createElement(_FeedDate2.default, { date: date })
  );
}

FeedSummary._meta = {
  name: 'FeedSummary',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedSummary.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedSummary. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['summary']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedSummary className. */
  className: _react.PropTypes.string,

  /** An event summary can contain a date. */
  date: _react.PropTypes.string,

  summary: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = FeedSummary;