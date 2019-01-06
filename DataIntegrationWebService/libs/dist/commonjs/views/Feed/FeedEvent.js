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

var _FeedContent = require('./FeedContent');

var _FeedContent2 = _interopRequireDefault(_FeedContent);

var _FeedLabel = require('./FeedLabel');

var _FeedLabel2 = _interopRequireDefault(_FeedLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeedEvent(props) {
  var content = props.content;
  var children = props.children;
  var className = props.className;
  var date = props.date;
  var extraImages = props.extraImages;
  var extraText = props.extraText;
  var image = props.image;
  var icon = props.icon;
  var meta = props.meta;
  var summary = props.summary;

  var classes = (0, _classnames2.default)(className, 'event');
  var rest = (0, _lib.getUnhandledProps)(FeedEvent, props);
  var ElementType = (0, _lib.getElementType)(FeedEvent, props);

  var hasContentProp = content || date || extraImages || extraText || meta || summary;
  var contentProps = { content: content, date: date, extraImages: extraImages, extraText: extraText, meta: meta, summary: summary };

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    icon && _react2.default.createElement(_FeedLabel2.default, { icon: icon }),
    image && _react2.default.createElement(_FeedLabel2.default, { image: image }),
    hasContentProp && _react2.default.createElement(_FeedContent2.default, contentProps),
    children
  );
}

FeedEvent._meta = {
  name: 'FeedEvent',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedEvent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedEvent. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content', 'date', 'extraImages', 'extraText', 'meta', 'summary']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedEvent className. */
  className: _react.PropTypes.string,

  /** Shorthand for FeedContent. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'date', 'extraImages', 'extraText', 'meta', 'summary']), _react.PropTypes.string]),

  /** Shorthand for FeedDate. */
  date: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.string]),

  /** Shorthand for FeedExtra with prop images. */
  extraImages: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.arrayOf(_react.PropTypes.node)]),

  /** Shorthand for FeedExtra with prop text. */
  extraText: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.string]),

  /** An event can contain icon label. */
  icon: _react.PropTypes.node,

  /** An event can contain image label. */
  image: _react.PropTypes.node,

  /** Shorthand for FeedMeta. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.string]),

  /** Shorthand for FeedSummary. */
  summary: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'content']), _react.PropTypes.string])
};

exports.default = FeedEvent;