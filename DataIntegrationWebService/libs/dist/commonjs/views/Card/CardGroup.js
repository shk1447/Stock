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

var _Card = require('./Card');

var _Card2 = _interopRequireDefault(_Card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A group of cards.
 */
function CardGroup(props) {
  var className = props.className;
  var children = props.children;
  var doubling = props.doubling;
  var items = props.items;
  var itemsPerRow = props.itemsPerRow;
  var stackable = props.stackable;

  var classes = (0, _classnames2.default)('ui', (0, _lib.useWidthProp)(itemsPerRow), (0, _lib.useKeyOnly)(doubling, 'doubling'), (0, _lib.useKeyOnly)(stackable, 'stackable'), className, 'cards');
  var rest = (0, _lib.getUnhandledProps)(CardGroup, props);
  var ElementType = (0, _lib.getElementType)(CardGroup, props);

  var content = !items ? children : items.map(function (item) {
    var key = item.key || [item.header, item.description].join('-');
    return _react2.default.createElement(_Card2.default, _extends({ key: key }, item));
  });

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    content
  );
}

CardGroup._meta = {
  name: 'CardGroup',
  parent: 'Card',
  props: {
    itemsPerRow: _lib.SUI.WIDTHS
  },
  type: _lib.META.TYPES.VIEW
};

CardGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A group of Card components. Mutually exclusive with items. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['items']), _react.PropTypes.node]),

  /** Classes that will be added to the CardGroup className */
  className: _react.PropTypes.string,

  /** A group of cards can double its column width for mobile */
  doubling: _react.PropTypes.bool,

  /** Shorthand prop for children. Mutually exclusive with children. */
  items: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.arrayOf(_react.PropTypes.shape({
    description: _react.PropTypes.node,
    meta: _react.PropTypes.node,
    key: _react.PropTypes.string,
    header: _react.PropTypes.node
  }))]),

  /** A group of cards can set how many cards should exist in a row */
  itemsPerRow: _react.PropTypes.oneOf(CardGroup._meta.props.itemsPerRow),

  /** A group of cards can automatically stack rows to a single columns on mobile devices */
  stackable: _react.PropTypes.bool
};

exports.default = CardGroup;