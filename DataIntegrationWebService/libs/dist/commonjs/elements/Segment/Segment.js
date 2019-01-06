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

var _SegmentGroup = require('./SegmentGroup');

var _SegmentGroup2 = _interopRequireDefault(_SegmentGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A segment is used to create a grouping of related content.
 */
function Segment(props) {
  var attached = props.attached;
  var basic = props.basic;
  var children = props.children;
  var circular = props.circular;
  var className = props.className;
  var clearing = props.clearing;
  var color = props.color;
  var compact = props.compact;
  var disabled = props.disabled;
  var floated = props.floated;
  var inverted = props.inverted;
  var loading = props.loading;
  var padded = props.padded;
  var piled = props.piled;
  var raised = props.raised;
  var secondary = props.secondary;
  var stacked = props.stacked;
  var tertiary = props.tertiary;
  var textAlign = props.textAlign;
  var vertical = props.vertical;


  var classes = (0, _classnames2.default)('ui', color, (0, _lib.useKeyOrValueAndKey)(attached, 'attached'), (0, _lib.useKeyOnly)(basic, 'basic'), (0, _lib.useKeyOnly)(circular, 'circular'), (0, _lib.useKeyOnly)(clearing, 'clearing'), (0, _lib.useKeyOnly)(compact, 'compact'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useValueAndKey)(floated, 'floated'), (0, _lib.useKeyOnly)(inverted, 'inverted'), (0, _lib.useKeyOnly)(loading, 'loading'), (0, _lib.useKeyOrValueAndKey)(padded, 'padded'), (0, _lib.useKeyOnly)(piled, 'piled'), (0, _lib.useKeyOnly)(raised, 'raised'), (0, _lib.useKeyOnly)(secondary, 'secondary'), (0, _lib.useKeyOnly)(stacked, 'stacked'), (0, _lib.useKeyOnly)(tertiary, 'tertiary'), (0, _lib.useTextAlignProp)(textAlign), (0, _lib.useKeyOnly)(vertical, 'vertical'), className, 'segment');

  var rest = (0, _lib.getUnhandledProps)(Segment, props);
  var ElementType = (0, _lib.getElementType)(Segment, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

Segment.Group = _SegmentGroup2.default;

Segment._meta = {
  name: 'Segment',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    attached: ['top', 'bottom'],
    floated: _lib.SUI.FLOATS,
    textAlign: _lib.SUI.TEXT_ALIGNMENTS,
    padded: ['very'],
    color: _lib.SUI.COLORS
  }
};

Segment.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Attach segment to other content, like a header */
  attached: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(Segment._meta.props.attached), _react.PropTypes.bool]),

  /** A basic segment has no special formatting */
  basic: _react.PropTypes.bool,

  /** Segment tag body content. */
  children: _react.PropTypes.any,

  /** A segment can be circular */
  circular: _react.PropTypes.bool,

  /** Class names for custom styling. */
  className: _react.PropTypes.string,

  /** A segment can clear floated content */
  clearing: _react.PropTypes.bool,

  /** Segment can be colored */
  color: _react.PropTypes.oneOf(Segment._meta.props.color),

  /** A segment may take up only as much space as is necessary */
  compact: _react.PropTypes.bool,

  /** A segment may show its content is disabled */
  disabled: _react.PropTypes.bool,

  /** Segment content can be floated to the left or right */
  floated: _react.PropTypes.oneOf(Segment._meta.props.floated),

  /** A segment can have its colors inverted for contrast */
  inverted: _react.PropTypes.bool,

  /** A segment may show its content is being loaded */
  loading: _react.PropTypes.bool,

  /** A segment can increase its padding */
  padded: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Segment._meta.props.padded)]),

  /** Formatted to look like a pile of pages. */
  piled: _react.PropTypes.bool,

  /** A segment may be formatted to raise above the page. */
  raised: _react.PropTypes.bool,

  /** A segment can be formatted to appear less noticeable */
  secondary: _react.PropTypes.bool,

  /** Formatted to show it contains multiple pages. */
  stacked: _react.PropTypes.bool,

  /** A segment can be formatted to appear even less noticeable */
  tertiary: _react.PropTypes.bool,

  /** Formats content to be aligned as part of a vertical group. */
  textAlign: _react.PropTypes.oneOf(Segment._meta.props.textAlign),

  /** Formats content to be aligned vertically */
  vertical: _react.PropTypes.bool
};

exports.default = Segment;