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

var _CardDescription = require('./CardDescription');

var _CardDescription2 = _interopRequireDefault(_CardDescription);

var _CardHeader = require('./CardHeader');

var _CardHeader2 = _interopRequireDefault(_CardHeader);

var _CardMeta = require('./CardMeta');

var _CardMeta2 = _interopRequireDefault(_CardMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A card can contain blocks of content or extra content meant to be formatted separately from the main content
 */
function CardContent(props) {
  var className = props.className;
  var children = props.children;
  var description = props.description;
  var extra = props.extra;
  var header = props.header;
  var meta = props.meta;

  var classes = (0, _classnames2.default)(className, (0, _lib.useKeyOnly)(extra, 'extra'), 'content');
  var rest = (0, _lib.getUnhandledProps)(CardContent, props);
  var ElementType = (0, _lib.getElementType)(CardContent, props);

  if (children) {
    return _react2.default.createElement(
      'div',
      _extends({}, rest, { className: classes }),
      children
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    header && _react2.default.createElement(_CardHeader2.default, { content: header }),
    meta && _react2.default.createElement(_CardMeta2.default, { content: meta }),
    description && _react2.default.createElement(_CardDescription2.default, { content: description })
  );
}

CardContent._meta = {
  name: 'CardContent',
  parent: 'Card',
  type: _lib.META.TYPES.VIEW
};

CardContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the CardContent. Mutually exclusive with all shorthand props. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description', 'header', 'meta']), _react.PropTypes.node]),

  /** Classes that will be added to the CardContent className */
  className: _react.PropTypes.string,

  /** Shorthand prop for CardDescription. Mutually exclusive with children. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])]),

  /** A card can contain extra content meant to be formatted separately from the main content */
  extra: _react.PropTypes.bool,

  /** Shorthand prop for CardHeader. Mutually exclusive with children. */
  header: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])]),

  /** Shorthand prop for CardMeta. Mutually exclusive with children. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])])
};

exports.default = CardContent;