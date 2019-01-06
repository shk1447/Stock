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

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A label displays content classification
 */
function Label(props) {
  var attached = props.attached;
  var basic = props.basic;
  var children = props.children;
  var color = props.color;
  var corner = props.corner;
  var className = props.className;
  var circular = props.circular;
  var detail = props.detail;
  var detailAs = props.detailAs;
  var empty = props.empty;
  var floating = props.floating;
  var horizontal = props.horizontal;
  var icon = props.icon;
  var image = props.image;
  var onClick = props.onClick;
  var onDetailClick = props.onDetailClick;
  var onRemove = props.onRemove;
  var pointing = props.pointing;
  var removable = props.removable;
  var ribbon = props.ribbon;
  var size = props.size;
  var tag = props.tag;
  var content = props.content;


  var handleClick = function handleClick(e) {
    return onClick && onClick(e, props);
  };
  var handleRemove = function handleRemove(e) {
    return onRemove && onRemove(e, props);
  };
  var handleDetailClick = function handleDetailClick(e) {
    return onDetailClick && onDetailClick(e, props);
  };

  var classes = (0, _classnames2.default)('ui', size, color, (0, _lib.useKeyOnly)(basic, 'basic'), (0, _lib.useKeyOnly)(circular, 'circular'), (0, _lib.useKeyOnly)(floating, 'floating'), (0, _lib.useKeyOnly)(horizontal, 'horizontal'), (0, _lib.useKeyOnly)(empty, 'empty'), (0, _lib.useKeyOnly)(tag, 'tag'), (0, _lib.useValueAndKey)(attached, 'attached'), (0, _lib.useKeyOrValueAndKey)(corner, 'corner'), (0, _lib.useKeyOrValueAndKey)(pointing, 'pointing'), (0, _lib.useKeyOrValueAndKey)(ribbon, 'ribbon'),
  // TODO how to handle image child with no image class? there are two image style labels.
  (image || _lib.childrenUtils.someByType(children, _.Image) || _lib.childrenUtils.someByType(children, 'img')) && 'image', 'label', className);

  var DetailComponent = detailAs || 'div';
  var ElementType = (0, _lib.getElementType)(Label, props);
  var rest = (0, _lib.getUnhandledProps)(Label, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes, onClick: handleClick }, rest),
    (0, _factories.createIcon)(icon),
    (0, _factories.createImage)(image),
    content,
    children,
    detail && _react2.default.createElement(
      DetailComponent,
      { className: 'detail', onClick: handleDetailClick },
      detail
    ),
    (removable || onRemove) && _react2.default.createElement(_.Icon, { name: 'delete', onClick: handleRemove })
  );
}

Label._meta = {
  name: 'Label',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    attached: ['top', 'bottom', 'top right', 'top left', 'bottom left', 'bottom right'],
    size: _lib.SUI.SIZES,
    color: _lib.SUI.COLORS,
    pointing: ['bottom', 'left', 'right'],
    corner: ['left', 'right'],
    ribbon: ['right']
  }
};

Label.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Attach to a <Segment />. */
  attached: _react.PropTypes.oneOf(Label._meta.props.attached),

  /** A label can reduce its complexity. */
  basic: _react.PropTypes.bool,

  /** Primary content of the label, same as content. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['icon', 'image', 'content']), _react.PropTypes.node]),

  /** Classes to add to the label className. */
  className: _react.PropTypes.string,

  /** Color of the label. */
  color: _react.PropTypes.oneOf(Label._meta.props.color),

  /** Place the label in one of the upper corners. */
  corner: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Label._meta.props.corner)]),

  /** Additional text with less emphasis. */
  detail: _react.PropTypes.string,

  /** An element type to render the 'detail' as (string or function). */
  detailAs: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Formats the label as a dot. */
  empty: _lib.customPropTypes.every([_lib.customPropTypes.demand(['circular']), _react.PropTypes.bool]),

  /** Format a label to align better alongside text. */
  horizontal: _react.PropTypes.bool,

  /** Float above another element in the upper right corner. */
  floating: _react.PropTypes.bool,

  /** Make the label circular, or a dot when used with 'empty' prop. */
  circular: _react.PropTypes.bool,

  /** Add an icon by icon name or pass an <Icon /> */
  icon: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]),

  /** Add an image by img src or pass an <Image />. */
  image: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]),

  /** Adds the link style when present, called with (event, props). */
  onClick: _react.PropTypes.func,

  /** Click callback for detail, called with (event, props). Formats the detail as a link. */
  onDetailClick: _react.PropTypes.func,

  /** Adds an "x" icon, called with (event, props) when "x" is clicked. */
  onRemove: _react.PropTypes.func,

  /** Add an "x" icon that calls onRemove when clicked. */
  removable: _react.PropTypes.bool,

  /** Point to content next to it. */
  pointing: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Label._meta.props.pointing)]),

  /** Format the label as a ribbon on another component. */
  ribbon: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Label._meta.props.ribbon)]),

  /** Size of the label. */
  size: _react.PropTypes.oneOf(Label._meta.props.size),

  /** Format the label like a product tag. */
  tag: _react.PropTypes.bool,

  /** Primary content of the label, same as children. */
  content: _react.PropTypes.node
};

exports.default = Label;