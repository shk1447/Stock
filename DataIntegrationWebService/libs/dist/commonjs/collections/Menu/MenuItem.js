'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _startCase2 = require('lodash/startCase');

var _startCase3 = _interopRequireDefault(_startCase2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MenuItem(props) {
  var active = props.active;
  var children = props.children;
  var className = props.className;
  var color = props.color;
  var content = props.content;
  var fitted = props.fitted;
  var header = props.header;
  var icon = props.icon;
  var index = props.index;
  var link = props.link;
  var name = props.name;
  var onClick = props.onClick;
  var position = props.position;

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(active, 'active'), (0, _lib.useKeyOrValueAndKey)(fitted, 'fitted'), (0, _lib.useKeyOnly)(icon, 'icon'), (0, _lib.useKeyOnly)(header, 'header'), (0, _lib.useKeyOnly)(link, 'link'), color, position, className, 'item');
  var ElementType = (0, _lib.getElementType)(MenuItem, props, function () {
    if (onClick) return 'a';
  });
  var handleClick = function handleClick(e) {
    if (onClick) onClick(e, { name: name, index: index });
  };
  var rest = (0, _lib.getUnhandledProps)(MenuItem, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, onClick: handleClick }),
    children || content || (0, _startCase3.default)(name)
  );
}

MenuItem._meta = {
  name: 'MenuItem',
  type: _lib.META.TYPES.COLLECTION,
  parent: 'Menu',
  props: {
    color: _lib.SUI.COLORS,
    fitted: ['horizontally', 'vertically'],
    position: ['right']
  }
};

MenuItem.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A menu item can be active. */
  active: _react.PropTypes.bool,

  /** Primary content of the MenuItem. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the MenuItem className. */
  className: _react.PropTypes.string,

  /** Additional colors can be specified. */
  color: _react.PropTypes.oneOf(MenuItem._meta.props.color),

  /** Shorthand for primary content of the MenuItem. Mutually exclusive with the children. */
  content: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** A menu item or menu can remove element padding, vertically or horizontally. */
  fitted: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(MenuItem._meta.props.fitted)]),

  /** A menu item may include a header or may itself be a header. */
  header: _react.PropTypes.bool,

  /** MenuItem can be only icon. */
  icon: _react.PropTypes.bool,

  /** MenuItem index inside Menu. */
  index: _react.PropTypes.number,

  /** A menu item can be link. */
  link: _react.PropTypes.bool,

  /** Internal name of the MenuItem. */
  name: _react.PropTypes.string,

  /** Render as an `a` tag instead of a `div` and called with event on MenuItem click. */
  onClick: _react.PropTypes.func,

  /** A menu item can take right position. */
  position: _react.PropTypes.oneOf(MenuItem._meta.props.position)
};

exports.default = MenuItem;