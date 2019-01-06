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
 * A group of segments can be formatted to appear together.
 */
function SegmentGroup(props) {
  var children = props.children;
  var className = props.className;
  var compact = props.compact;
  var horizontal = props.horizontal;
  var raised = props.raised;
  var stacked = props.stacked;
  var piled = props.piled;

  var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(horizontal, 'horizontal'), (0, _lib.useKeyOnly)(compact, 'compact'), (0, _lib.useKeyOnly)(piled, 'piled'), (0, _lib.useKeyOnly)(raised, 'raised'), (0, _lib.useKeyOnly)(stacked, 'stacked'), className, 'segments');

  var rest = (0, _lib.getUnhandledProps)(SegmentGroup, props);
  var ElementType = (0, _lib.getElementType)(SegmentGroup, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

SegmentGroup._meta = {
  name: 'SegmentGroup',
  parent: 'Segment',
  type: _lib.META.TYPES.ELEMENT
};

SegmentGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Class names for custom styling. */
  className: _react.PropTypes.string,

  /** Nested segments for this Segment group */
  children: _react.PropTypes.node,

  /** A segment may take up only as much space as is necessary */
  compact: _react.PropTypes.bool,

  /** Formats content to be aligned horizontally */
  horizontal: _react.PropTypes.bool,

  /** Formatted to look like a pile of pages. */
  piled: _react.PropTypes.bool,

  /** A segment group may be formatted to raise above the page. */
  raised: _react.PropTypes.bool,

  /** Formatted to show it contains multiple pages. */
  stacked: _react.PropTypes.bool
};

exports.default = SegmentGroup;