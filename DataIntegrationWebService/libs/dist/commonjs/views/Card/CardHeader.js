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
 * A card can contain a header
 */
function CardHeader(props) {
  var className = props.className;
  var children = props.children;
  var content = props.content;

  var classes = (0, _classnames2.default)(className, 'header');
  var rest = (0, _lib.getUnhandledProps)(CardHeader, props);
  var ElementType = (0, _lib.getElementType)(CardHeader, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || content
  );
}

CardHeader._meta = {
  name: 'CardHeader',
  parent: 'Card',
  type: _lib.META.TYPES.VIEW
};

CardHeader.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the CardHeader. Mutually exclusive with content. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the CardHeader className */
  className: _react.PropTypes.string,

  /** Primary content of the CardHeader. Mutually exclusive with children. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

exports.default = CardHeader;