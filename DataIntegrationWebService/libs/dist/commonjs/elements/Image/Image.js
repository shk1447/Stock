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

var _ImageGroup = require('./ImageGroup');

var _ImageGroup2 = _interopRequireDefault(_ImageGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An image is a graphic representation of something
 * @see Icon
 */
function Image(props) {
  var verticalAlign = props.verticalAlign;
  var alt = props.alt;
  var avatar = props.avatar;
  var bordered = props.bordered;
  var centered = props.centered;
  var className = props.className;
  var disabled = props.disabled;
  var floated = props.floated;
  var fluid = props.fluid;
  var hidden = props.hidden;
  var height = props.height;
  var href = props.href;
  var inline = props.inline;
  var shape = props.shape;
  var size = props.size;
  var spaced = props.spaced;
  var src = props.src;
  var width = props.width;
  var wrapped = props.wrapped;
  var ui = props.ui;


  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(ui, 'ui'), size, (0, _lib.useVerticalAlignProp)(verticalAlign, 'aligned'), (0, _lib.useKeyOnly)(avatar, 'avatar'), (0, _lib.useKeyOnly)(bordered, 'bordered'), (0, _lib.useKeyOnly)(centered, 'centered'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useValueAndKey)(floated, 'floated'), (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(hidden, 'hidden'), (0, _lib.useKeyOnly)(inline, 'inline'), (0, _lib.useKeyOrValueAndKey)(spaced, 'spaced'), shape, className, 'image');

  var rest = (0, _lib.getUnhandledProps)(Image, props);
  var rootProps = _extends({ className: classes }, rest);
  var imgTagProps = { src: src, alt: alt, width: width, height: height };
  var ElementType = (0, _lib.getElementType)(Image, props, function () {
    if (wrapped) return 'div';
  });

  if (ElementType === 'img') {
    return _react2.default.createElement(ElementType, _extends({}, rootProps, imgTagProps));
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rootProps, { href: href }),
    _react2.default.createElement('img', imgTagProps)
  );
}

Image.Group = _ImageGroup2.default;

Image._meta = {
  name: 'Image',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    verticalAlign: _lib.SUI.VERTICAL_ALIGNMENTS,
    floated: _lib.SUI.FLOATS,
    shape: ['rounded', 'circular'],
    size: _lib.SUI.SIZES,
    spaced: ['left', 'right']
  }
};

Image.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** An image can specify its vertical alignment */
  verticalAlign: _react.PropTypes.oneOf(Image._meta.props.verticalAlign),

  /** Alternate text for the image specified */
  alt: _react.PropTypes.string,

  /** An image may be formatted to appear inline with text as an avatar */
  avatar: _react.PropTypes.bool,

  /** An image may include a border to emphasize the edges of white or transparent content */
  bordered: _react.PropTypes.bool,

  /** An image can appear centered in a content block */
  centered: _react.PropTypes.bool,

  /** Class names for custom styling. */
  className: _react.PropTypes.string,

  /** An image can show that it is disabled and cannot be selected */
  disabled: _react.PropTypes.bool,

  /** An image can sit to the left or right of other content */
  floated: _react.PropTypes.oneOf(Image._meta.props.floated),

  /** An image can take up the width of its container */
  fluid: _lib.customPropTypes.every([_react.PropTypes.bool, _lib.customPropTypes.disallow(['size'])]),

  /** An image can be hidden */
  hidden: _react.PropTypes.bool,

  /** The img element height attribute */
  height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  /** Renders the Image as an <a> tag with this href */
  href: _react.PropTypes.string,

  /** An image may appear inline */
  inline: _react.PropTypes.bool,

  /** An image may appear rounded or circular */
  shape: _react.PropTypes.oneOf(Image._meta.props.shape),

  /** An image may appear at different sizes */
  size: _react.PropTypes.oneOf(Image._meta.props.size),

  /** An image can specify that it needs an additional spacing to separate it from nearby content */
  spaced: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Image._meta.props.spaced)]),

  /** Specifies the URL of the image */
  src: _react.PropTypes.string,

  /** Whether or not to add the ui className */
  ui: _react.PropTypes.bool,

  /** The img element width attribute */
  width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  /** An image can render wrapped in a `div.ui.image` as alternative HTML markup */
  wrapped: _lib.customPropTypes.every([_react.PropTypes.bool,
  // these props wrap the image in an a tag already
  _lib.customPropTypes.disallow(['href'])])
};

Image.defaultProps = {
  as: 'img',
  ui: true
};

exports.default = Image;