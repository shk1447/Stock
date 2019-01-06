'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _get3 = require('lodash/get');

var _get4 = _interopRequireDefault(_get3);

var _findIndex2 = require('lodash/findIndex');

var _findIndex3 = _interopRequireDefault(_findIndex2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _MenuHeader = require('./MenuHeader');

var _MenuHeader2 = _interopRequireDefault(_MenuHeader);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _MenuMenu = require('./MenuMenu');

var _MenuMenu2 = _interopRequireDefault(_MenuMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _meta = {
  name: 'Menu',
  type: _lib.META.TYPES.COLLECTION,
  props: {
    attached: ['top', 'bottom'],
    color: _lib.SUI.COLORS,
    floated: ['right'],
    icon: ['labeled'],
    fixed: ['bottom', 'top'],
    size: (0, _without3.default)(_lib.SUI.SIZES, 'medium', 'big'),
    tabular: ['right'],
    widths: _lib.SUI.WIDTHS
  }
};

/**
 * A menu displays grouped navigation actions.
 * */

var Menu = function (_Component) {
  _inherits(Menu, _Component);

  function Menu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Menu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Menu.__proto__ || Object.getPrototypeOf(Menu)).call.apply(_ref, [this].concat(args))), _this), _this.handleItemClick = function (e, _ref2) {
      var name = _ref2.name;
      var index = _ref2.index;

      _this.trySetState({ activeIndex: index });
      var _this$props = _this.props;
      var items = _this$props.items;
      var onItemClick = _this$props.onItemClick;


      if ((0, _get4.default)(items[index], 'onClick')) items[index].onClick(e, { name: name, index: index });
      if (onItemClick) onItemClick(e, { name: name, index: index });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Menu, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _get2(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), 'componentWillMount', this).call(this);

      var items = this.props.items;

      if (items) this.trySetState({ activeIndex: (0, _findIndex3.default)(items, ['active', true]) });
    }
  }, {
    key: 'renderItems',
    value: function renderItems() {
      var _this2 = this;

      var items = this.props.items;
      var activeIndex = this.state.activeIndex;


      return (0, _map3.default)(items, function (item, index) {
        var content = item.content;
        var childKey = item.childKey;
        var name = item.name;
        var itemProps = item.itemProps;

        var finalKey = childKey || [content, name].join('-');

        return _react2.default.createElement(_MenuItem2.default, _extends({}, itemProps, {
          active: activeIndex === index,
          content: content,
          index: index,
          key: finalKey,
          name: name,
          onClick: _this2.handleItemClick
        }));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var attached = _props.attached;
      var borderless = _props.borderless;
      var className = _props.className;
      var children = _props.children;
      var color = _props.color;
      var compact = _props.compact;
      var fixed = _props.fixed;
      var floated = _props.floated;
      var fluid = _props.fluid;
      var icon = _props.icon;
      var inverted = _props.inverted;
      var pagination = _props.pagination;
      var pointing = _props.pointing;
      var secondary = _props.secondary;
      var stackable = _props.stackable;
      var tabular = _props.tabular;
      var text = _props.text;
      var vertical = _props.vertical;
      var size = _props.size;
      var widths = _props.widths;

      var classes = (0, _classnames2.default)('ui', color, size, (0, _lib.useWidthProp)(widths, 'item'), (0, _lib.useKeyOrValueAndKey)(attached, 'attached'), (0, _lib.useKeyOnly)(borderless, 'borderless'), (0, _lib.useKeyOnly)(compact, 'compact'), (0, _lib.useValueAndKey)(fixed, 'fixed'), (0, _lib.useKeyOrValueAndKey)(floated, 'floated'), (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOrValueAndKey)(icon, 'icon'), (0, _lib.useKeyOnly)(inverted, 'inverted'), (0, _lib.useKeyOnly)(pagination, 'pagination'), (0, _lib.useKeyOnly)(pointing, 'pointing'), (0, _lib.useKeyOnly)(secondary, 'secondary'), (0, _lib.useKeyOnly)(stackable, 'stackable'), (0, _lib.useKeyOrValueAndKey)(tabular, 'tabular'), (0, _lib.useKeyOnly)(text, 'text'), (0, _lib.useKeyOnly)(vertical, 'vertical'), className, 'menu');

      var rest = (0, _lib.getUnhandledProps)(Menu, this.props);
      var ElementType = (0, _lib.getElementType)(Menu, this.props);

      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes }),
        children || this.renderItems()
      );
    }
  }]);

  return Menu;
}(_lib.AutoControlledComponent);

Menu.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Index of the currently active item. */
  activeIndex: _react.PropTypes.number,

  /** A menu may be attached to other content segments. */
  attached: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.attached)]),

  /** A menu item or menu can have no borders. */
  borderless: _react.PropTypes.bool,

  /** Primary content of the Menu. Mutually exclusive with items. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the Menu className. */
  className: _react.PropTypes.string,

  /** Additional colors can be specified. */
  color: _react.PropTypes.oneOf(_meta.props.color),

  /** A menu can take up only the space necessary to fit its content. */
  compact: _react.PropTypes.bool,

  /** Initial activeIndex value. */
  defaultActiveIndex: _react.PropTypes.number,

  /** A menu can be fixed to a side of its context. */
  fixed: _react.PropTypes.oneOf(_meta.props.fixed),

  /** A menu can be floated. */
  floated: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.floated)]),

  /** A vertical menu may take the size of its container. */
  fluid: _react.PropTypes.bool,

  /** A menu may have labeled icons. */
  icon: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.icon)]),

  /** A menu may have its colors inverted to show greater contrast. */
  inverted: _react.PropTypes.bool,

  /** Shorthand array of props for Menu. Mutually exclusive with children. */
  items: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.arrayOf(_react.PropTypes.shape({
    childKey: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
  }))]),

  /** onClick handler for MenuItem. Mutually exclusive with children. */
  onItemClick: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.func]),

  /** A pagination menu is specially formatted to present links to pages of content. */
  pagination: _react.PropTypes.bool,

  /** A menu can point to show its relationship to nearby content. */
  pointing: _react.PropTypes.bool,

  /** A menu can adjust its appearance to de-emphasize its contents. */
  secondary: _react.PropTypes.bool,

  /** A menu can stack at mobile resolutions. */
  stackable: _react.PropTypes.bool,

  /** A menu can be formatted to show tabs of information. */
  tabular: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.tabular)]),

  /** A menu can be formatted for text content. */
  text: _react.PropTypes.bool,

  /** A vertical menu displays elements vertically. */
  vertical: _react.PropTypes.bool,

  /** A menu can vary in size. */
  size: _react.PropTypes.oneOf(_meta.props.size),

  /** A menu can have its items divided evenly. */
  widths: _react.PropTypes.oneOf(_meta.props.widths)
};
Menu._meta = _meta;
Menu.autoControlledProps = ['activeIndex'];
Menu.Header = _MenuHeader2.default;
Menu.Item = _MenuItem2.default;
Menu.Menu = _MenuMenu2.default;
exports.default = Menu;