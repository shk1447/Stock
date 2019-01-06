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

var _ItemContent = require('./ItemContent');

var _ItemContent2 = _interopRequireDefault(_ItemContent);

var _ItemDescription = require('./ItemDescription');

var _ItemDescription2 = _interopRequireDefault(_ItemDescription);

var _ItemExtra = require('./ItemExtra');

var _ItemExtra2 = _interopRequireDefault(_ItemExtra);

var _ItemGroup = require('./ItemGroup');

var _ItemGroup2 = _interopRequireDefault(_ItemGroup);

var _ItemHeader = require('./ItemHeader');

var _ItemHeader2 = _interopRequireDefault(_ItemHeader);

var _ItemImage = require('./ItemImage');

var _ItemImage2 = _interopRequireDefault(_ItemImage);

var _ItemMeta = require('./ItemMeta');

var _ItemMeta2 = _interopRequireDefault(_ItemMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An item view presents large collections of site content for display
 * */
function Item(props) {
  var children = props.children;
  var className = props.className;
  var content = props.content;
  var description = props.description;
  var extra = props.extra;
  var header = props.header;
  var image = props.image;
  var meta = props.meta;

  var classes = (0, _classnames2.default)(className, 'item');
  var rest = (0, _lib.getUnhandledProps)(Item, props);
  var ElementType = (0, _lib.getElementType)(Item, props);

  if (children) {
    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      children
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    image && _react2.default.createElement(_ItemImage2.default, { src: image }),
    _react2.default.createElement(_ItemContent2.default, {
      content: content,
      description: description,
      extra: extra,
      header: header,
      meta: meta
    })
  );
}

Item._meta = {
  name: 'Item',
  type: _lib.META.TYPES.VIEW
};

Item.Content = _ItemContent2.default;
Item.Description = _ItemDescription2.default;
Item.Extra = _ItemExtra2.default;
Item.Group = _ItemGroup2.default;
Item.Header = _ItemHeader2.default;
Item.Image = _ItemImage2.default;
Item.Meta = _ItemMeta2.default;

Item.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the Item. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the Item className. */
  className: _react.PropTypes.string,

  /** Shorthand for ItemContent component. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemDescription component. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemExtra component. */
  extra: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemImage component. */
  image: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemHeader component. */
  header: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** Shorthand for ItemMeta component. */
  meta: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = Item;