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

var _ItemHeader = require('./ItemHeader');

var _ItemHeader2 = _interopRequireDefault(_ItemHeader);

var _ItemDescription = require('./ItemDescription');

var _ItemDescription2 = _interopRequireDefault(_ItemDescription);

var _ItemExtra = require('./ItemExtra');

var _ItemExtra2 = _interopRequireDefault(_ItemExtra);

var _ItemMeta = require('./ItemMeta');

var _ItemMeta2 = _interopRequireDefault(_ItemMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An item can contain content
 * */
function ItemContent(props) {
  var children = props.children;
  var className = props.className;
  var content = props.content;
  var description = props.description;
  var extra = props.extra;
  var header = props.header;
  var meta = props.meta;
  var verticalAlign = props.verticalAlign;

  var classes = (0, _classnames2.default)(className, (0, _lib.useVerticalAlignProp)(verticalAlign), 'content');

  var rest = (0, _lib.getUnhandledProps)(ItemContent, props);
  var ElementType = (0, _lib.getElementType)(ItemContent, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    header && _react2.default.createElement(_ItemHeader2.default, { content: header }),
    meta && _react2.default.createElement(_ItemMeta2.default, { content: meta }),
    description && _react2.default.createElement(_ItemDescription2.default, { content: description }),
    extra && _react2.default.createElement(_ItemExtra2.default, { content: extra }),
    children || content
  );
}

ItemContent._meta = {
  name: 'ItemContent',
  parent: 'Item',
  type: _lib.META.TYPES.VIEW,
  props: {
    verticalAlign: _lib.SUI.VERTICAL_ALIGNMENTS
  }
};

ItemContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the ItemContent. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the ItemContent className. */
  className: _react.PropTypes.string,

  /** Primary content of the ItemContent. Mutually exclusive with the children prop. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for of the ItemDescription. Mutually exclusive with the children prop. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemExtra component. Mutually exclusive with the children prop. */
  extra: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemHeader component. Mutually exclusive with the children prop. */
  header: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemMeta component. Mutually exclusive with the children prop. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Content can specify its vertical alignment */
  verticalAlign: _react.PropTypes.oneOf(ItemContent._meta.props.verticalAlign)
};

exports.default = ItemContent;