'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _factories = require('../../factories');

var _HeaderSubheader = require('./HeaderSubheader');

var _HeaderSubheader2 = _interopRequireDefault(_HeaderSubheader);

var _HeaderContent = require('./HeaderContent');

var _HeaderContent2 = _interopRequireDefault(_HeaderContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A header provides a short summary of content
 */
function Header(props) {
  var color = props.color;
  var content = props.content;
  var dividing = props.dividing;
  var block = props.block;
  var attached = props.attached;
  var floated = props.floated;
  var inverted = props.inverted;
  var disabled = props.disabled;
  var sub = props.sub;
  var size = props.size;
  var textAlign = props.textAlign;
  var icon = props.icon;
  var image = props.image;
  var children = props.children;
  var className = props.className;
  var subheader = props.subheader;


  var classes = (0, _classnames2.default)('ui', size, color, (0, _lib.useKeyOnly)(icon === true, 'icon'), (0, _lib.useKeyOnly)(sub, 'sub'), (0, _lib.useKeyOnly)(dividing, 'dividing'), (0, _lib.useKeyOnly)(block, 'block'), (0, _lib.useKeyOrValueAndKey)(attached, 'attached'), (0, _lib.useValueAndKey)(floated, 'floated'), (0, _lib.useKeyOnly)(inverted, 'inverted'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useTextAlignProp)(textAlign), className, 'header');

  var ElementType = (0, _lib.getElementType)(Header, props);
  var rest = (0, _lib.getUnhandledProps)(Header, props);

  if (children) {
    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      children
    );
  }

  if (image || icon && typeof icon !== 'boolean') {
    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      (0, _factories.createIcon)(icon) || (0, _factories.createImage)(image),
      (content || subheader) && _react2.default.createElement(
        _HeaderContent2.default,
        null,
        content,
        subheader && _react2.default.createElement(_HeaderSubheader2.default, { content: subheader })
      )
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    content,
    subheader && _react2.default.createElement(_HeaderSubheader2.default, { content: subheader })
  );
}

Header._meta = {
  name: 'Header',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    attached: ['top', 'bottom'],
    color: _lib.SUI.COLORS,
    size: (0, _without3.default)(_lib.SUI.SIZES, 'big', 'massive'),
    floated: _lib.SUI.FLOATS,
    textAlign: _lib.SUI.TEXT_ALIGNMENTS
  }
};

Header.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Additional classes */
  className: _react.PropTypes.string,

  /** Primary content */
  children: _lib.customPropTypes.every([_react.PropTypes.node, _lib.customPropTypes.disallow(['image']), _lib.customPropTypes.givenProps({ icon: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.object]) }, _lib.customPropTypes.disallow(['icon']))]),

  /** Primary content.  Mutually exclusive with children. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Add an icon by icon name or pass an <Icon /.> */
  icon: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['image']), _lib.customPropTypes.givenProps({ children: _react.PropTypes.node.isRequired }, _react.PropTypes.bool), _lib.customPropTypes.givenProps({ icon: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.object]) }, _lib.customPropTypes.disallow(['children']))]),

  /** Add an image by img src or pass an <Image />. */
  image: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'icon']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.object])]),

  /** Color of the header. */
  color: _react.PropTypes.oneOf(Header._meta.props.color),

  /** Divide header from the content below it */
  dividing: _react.PropTypes.bool,

  /** Format header to appear inside a content block */
  block: _react.PropTypes.bool,

  /** Attach header  to other content, like a segment */
  attached: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(Header._meta.props.attached), _react.PropTypes.bool]),

  /** Header can sit to the left or right of other content */
  floated: _react.PropTypes.oneOf(Header._meta.props.floated),

  /** Inverts the color of the header for dark backgrounds */
  inverted: _react.PropTypes.bool,

  /** Show that the header is inactive */
  disabled: _react.PropTypes.bool,

  /** Headers may be formatted to label smaller or de-emphasized content */
  sub: _react.PropTypes.bool,

  /** Content headings are sized with em and are based on the font-size of their container. */
  size: _react.PropTypes.oneOf(Header._meta.props.size),

  /** Shorthand for the Header.Subheader component. Mutually exclusive with children */
  subheader: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Align header content */
  textAlign: _react.PropTypes.oneOf(Header._meta.props.textAlign)
};

Header.Content = _HeaderContent2.default;
Header.Subheader = _HeaderSubheader2.default;

exports.default = Header;