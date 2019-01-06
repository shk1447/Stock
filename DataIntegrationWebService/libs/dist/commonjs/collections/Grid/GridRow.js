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

function GridRow(props) {
  var centered = props.centered;
  var children = props.children;
  var className = props.className;
  var color = props.color;
  var columns = props.columns;
  var only = props.only;
  var reversed = props.reversed;
  var stretched = props.stretched;
  var textAlign = props.textAlign;
  var verticalAlign = props.verticalAlign;

  var classes = (0, _classnames2.default)(className, color, (0, _lib.useKeyOnly)(centered, 'centered'), (0, _lib.useWidthProp)(columns, 'column', true), (0, _lib.useValueAndKey)(only, 'only'), (0, _lib.useValueAndKey)(reversed, 'reversed'), (0, _lib.useKeyOnly)(stretched, 'stretched'), (0, _lib.useTextAlignProp)(textAlign), (0, _lib.useVerticalAlignProp)(verticalAlign), 'row');
  var rest = (0, _lib.getUnhandledProps)(GridRow, props);
  var ElementType = (0, _lib.getElementType)(GridRow, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

GridRow._meta = {
  name: 'GridRow',
  parent: 'Grid',
  type: _lib.META.TYPES.COLLECTION,
  props: {
    color: _lib.SUI.COLORS,
    columns: _lib.SUI.WIDTHS,
    only: ['computer', 'large screen', 'mobile', 'tablet mobile', 'tablet', 'widescreen'],
    reversed: ['computer', 'computer vertically', 'mobile', 'mobile vertically', 'tablet', 'tablet vertically'],
    textAlign: _lib.SUI.TEXT_ALIGNMENTS,
    verticalAlign: _lib.SUI.VERTICAL_ALIGNMENTS
  }
};

GridRow.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A row can have its columns centered. */
  centered: _react.PropTypes.bool,

  /** Primary content of the GridRow. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the GridRow className. */
  className: _react.PropTypes.string,

  /** A grid row can be colored. */
  color: _react.PropTypes.oneOf(GridRow._meta.props.color),

  /** Represents column count per line in Row. */
  columns: _react.PropTypes.oneOf(GridRow._meta.props.columns),

  /** A row can appear only for a specific device, or screen sizes. */
  only: _react.PropTypes.oneOf(GridRow._meta.props.only),

  /** A  row can specify that its columns should reverse order at different device sizes. */
  reversed: _react.PropTypes.oneOf(GridRow._meta.props.reversed),

  /** An can stretch its contents to take up the entire column height. */
  stretched: _react.PropTypes.bool,

  /** A row can specify its text alignment. */
  textAlign: _react.PropTypes.oneOf(GridRow._meta.props.textAlign),

  /** A row can specify its vertical alignment to have all its columns vertically centered. */
  verticalAlign: _react.PropTypes.oneOf(GridRow._meta.props.verticalAlign)
};

exports.default = GridRow;