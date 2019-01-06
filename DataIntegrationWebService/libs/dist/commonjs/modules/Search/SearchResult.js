'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note: You technically only need the 'content' wrapper when there's an
// image. However, optionally wrapping it makes this function a lot more
// complicated and harder to read. Since always wrapping it doesn't affect
// the style in any way let's just do that.
//
// Note: To avoid requiring a wrapping div, we return an array here so to
// prevent rendering issues each node needs a unique key.
var defaultRenderer = function defaultRenderer(_ref) {
  var image = _ref.image;
  var price = _ref.price;
  var title = _ref.title;
  var description = _ref.description;
  return [image && _react2.default.createElement(
    'div',
    { key: 'image', className: 'image' },
    (0, _factories.createImg)(image)
  ), _react2.default.createElement(
    'div',
    { key: 'content', className: 'content' },
    price && _react2.default.createElement(
      'div',
      { className: 'price' },
      price
    ),
    title && _react2.default.createElement(
      'div',
      { className: 'title' },
      title
    ),
    description && _react2.default.createElement(
      'div',
      { className: 'description' },
      description
    )
  )];
};

function SearchResult(props) {
  var active = props.active;
  var className = props.className;
  var id = props.id;
  var onClick = props.onClick;
  var renderer = props.renderer;


  var handleClick = function handleClick(e) {
    if (onClick) onClick(e, id);
  };

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(active, 'active'), 'result', className);
  var ElementType = (0, _lib.getElementType)(SearchResult, props);
  var rest = (0, _lib.getUnhandledProps)(SearchResult, props);

  // Note: You technically only need the 'content' wrapper when there's an
  // image. However, optionally wrapping it makes this function a lot more
  // complicated and harder to read. Since always wrapping it doesn't affect
  // the style in any way let's just do that.
  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, onClick: handleClick }),
    renderer ? renderer(props) : defaultRenderer(props)
  );
}

SearchResult._meta = {
  name: 'SearchResult',
  parent: 'Search',
  type: _lib.META.TYPES.MODULE
};

SearchResult.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** The item currently selected by keyboard shortcut. */
  active: _react.PropTypes.bool,

  /** Additional className. */
  className: _react.PropTypes.string,

  /** Additional text with less emphasis. */
  description: _react.PropTypes.string,

  /** A unique identifier. */
  id: _react.PropTypes.number,

  /** Add an image to the item. */
  image: _react.PropTypes.string,

  /** Customized text for price. */
  price: _react.PropTypes.string,

  /**
   * A function that returns the result contents.
   * Receives all SearchResult props.
   */
  renderer: _react.PropTypes.func,

  /** Display title. */
  title: _react.PropTypes.string,

  /** Called on click with (event, value, text). */
  onClick: _react.PropTypes.func
};

exports.default = SearchResult;