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
 * A card can contain a description with one or more paragraphs
 */
function CardDescription(props) {
  var className = props.className;
  var children = props.children;
  var content = props.content;

  var classes = (0, _classnames2.default)(className, 'description');
  var rest = (0, _lib.getUnhandledProps)(CardDescription, props);
  var ElementType = (0, _lib.getElementType)(CardDescription, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || content
  );
}

CardDescription._meta = {
  name: 'CardDescription',
  parent: 'Card',
  type: _lib.META.TYPES.VIEW
};

CardDescription.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the CardDescription. Mutually exclusive with content. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the CardDescription className. */
  className: _react.PropTypes.string,

  /** Primary content of the CardDescription. Mutually exclusive with children. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])])
};

exports.default = CardDescription;