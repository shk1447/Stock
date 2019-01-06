'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListItem = function (_Component) {
  _inherits(ListItem, _Component);

  function ListItem() {
    _classCallCheck(this, ListItem);

    return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
  }

  _createClass(ListItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var className = _props.className;
      var description = _props.description;
      var header = _props.header;
      var icon = _props.icon;
      var image = _props.image;

      var rest = _objectWithoutProperties(_props, ['children', 'className', 'description', 'header', 'icon', 'image']);

      var classes = (0, _classnames2.default)(className, 'item');

      var media = (0, _factories.createIcon)(icon) || (0, _factories.createImage)(image);
      var _description = description || children;

      var content = header ? [header && _react2.default.createElement(
        'div',
        { key: 'header', className: 'header' },
        header
      ), _description && _react2.default.createElement(
        'div',
        { key: 'description', className: 'description' },
        _description
      )] : _description;

      // wrap content for icon/image layouts
      if (media) content = _react2.default.createElement(
        'div',
        { className: 'content' },
        content
      );
      var ElementType = (0, _lib.getElementType)(ListItem, this.props);
      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes }),
        media,
        content
      );
    }
  }]);

  return ListItem;
}(_react.Component);

ListItem.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  children: _react.PropTypes.node,
  className: _react.PropTypes.string,
  description: _react.PropTypes.node,
  header: _react.PropTypes.string,
  icon: _react.PropTypes.node,
  image: _react.PropTypes.node
};
ListItem._meta = {
  name: 'ListItem',
  type: _lib.META.TYPES.ELEMENT,
  parent: 'List'
};
exports.default = ListItem;