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

var _FeedExtra = require('./FeedExtra');

var _FeedExtra2 = _interopRequireDefault(_FeedExtra);

var _FeedMeta = require('./FeedMeta');

var _FeedMeta2 = _interopRequireDefault(_FeedMeta);

var _FeedSummary = require('./FeedSummary');

var _FeedSummary2 = _interopRequireDefault(_FeedSummary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeedContent(props) {
  var children = props.children;
  var content = props.content;
  var className = props.className;
  var extraImages = props.extraImages;
  var extraText = props.extraText;
  var date = props.date;
  var meta = props.meta;
  var summary = props.summary;

  var classes = (0, _classnames2.default)(className, 'content');
  var rest = (0, _lib.getUnhandledProps)(FeedContent, props);
  var ElementType = (0, _lib.getElementType)(FeedContent, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    date && _react2.default.createElement(_FeedDate2.default, { date: date }),
    summary && _react2.default.createElement(_FeedSummary2.default, { summary: summary }),
    extraImages && _react2.default.createElement(_FeedExtra2.default, { images: extraImages }),
    extraText && _react2.default.createElement(_FeedExtra2.default, { text: extraText }),
    meta && _react2.default.createElement(_FeedMeta2.default, { meta: meta }),
    children || content
  );
}

FeedContent._meta = {
  name: 'FeedContent',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedContent. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedContent className. */
  className: _react.PropTypes.string,

  /** Primary content of the FeedContent. Mutually exclusive with children. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** An event can contain a date. */
  date: _react.PropTypes.string,

  /** Shorthand for FeedExtra with prop images. */
  extraImages: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.arrayOf(_react.PropTypes.string)]),

  /** Shorthand for FeedExtra with prop text. */
  extraText: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.string]),

  /** A shorthand for FeedMeta. */
  meta: _react.PropTypes.string,

  /** A shorthand for FeedSummary. */
  summary: _react.PropTypes.string
};

exports.default = FeedContent;