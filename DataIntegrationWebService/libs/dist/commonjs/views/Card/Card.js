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

var _CardContent = require('./CardContent');

var _CardContent2 = _interopRequireDefault(_CardContent);

var _CardDescription = require('./CardDescription');

var _CardDescription2 = _interopRequireDefault(_CardDescription);

var _CardGroup = require('./CardGroup');

var _CardGroup2 = _interopRequireDefault(_CardGroup);

var _CardHeader = require('./CardHeader');

var _CardHeader2 = _interopRequireDefault(_CardHeader);

var _CardMeta = require('./CardMeta');

var _CardMeta2 = _interopRequireDefault(_CardMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A card displays site content in a manner similar to a playing card
 */
function Card(props) {
  var centered = props.centered;
  var children = props.children;
  var className = props.className;
  var color = props.color;
  var description = props.description;
  var extra = props.extra;
  var fluid = props.fluid;
  var header = props.header;
  var href = props.href;
  var image = props.image;
  var meta = props.meta;
  var onClick = props.onClick;
  var raised = props.raised;


  var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(centered, 'centered'), (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(raised, 'raised'), color, 'card', className);
  var rest = (0, _lib.getUnhandledProps)(Card, props);

  var handleClick = function handleClick(e) {
    if (onClick) onClick(e);
  };
  var ElementType = (0, _lib.getElementType)(Card, props, function () {
    if (onClick) return 'a';
  });

  if (children) {
    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes, href: href, onClick: handleClick }),
      children
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, href: href, onClick: handleClick }),
    (0, _factories.createImage)(image),
    (description || header || meta) && _react2.default.createElement(_CardContent2.default, { description: description, header: header, meta: meta }),
    extra && _react2.default.createElement(
      _CardContent2.default,
      { extra: true },
      extra
    )
  );
}

Card._meta = {
  name: 'Card',
  type: _lib.META.TYPES.VIEW,
  props: {
    color: _lib.SUI.COLORS
  }
};

Card.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A Card can center itself inside its container. */
  centered: _react.PropTypes.bool,

  /** Primary content of the Card. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description', 'header', 'image', 'meta']), _react.PropTypes.node]),

  /** Classes that will be added to the Card className. */
  className: _react.PropTypes.string,

  /** A Card can be formatted to display different colors. */
  color: _react.PropTypes.oneOf(Card._meta.props.color),

  /** Shorthand prop for CardDescription. Mutually exclusive with children. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Shorthand prop for CardContent containing extra prop. Mutually exclusive with children. */
  extra: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** A Card can be formatted to take up the width of its container. */
  fluid: _react.PropTypes.bool,

  /** Shorthand prop for CardHeader. Mutually exclusive with children. */
  header: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Render as an `a` tag instead of a `div` and adds the href attribute. */
  href: _react.PropTypes.string,

  /** A card can contain an Image component. */
  image: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Shorthand prop for CardMeta. Mutually exclusive with children. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Render as an `a` tag instead of a `div` and called with event on Card click. */
  onClick: _react.PropTypes.func,

  /** A Card can be formatted to raise above the page. */
  raised: _react.PropTypes.bool
};

Card.Content = _CardContent2.default;
Card.Description = _CardDescription2.default;
Card.Group = _CardGroup2.default;
Card.Header = _CardHeader2.default;
Card.Meta = _CardMeta2.default;

exports.default = Card;