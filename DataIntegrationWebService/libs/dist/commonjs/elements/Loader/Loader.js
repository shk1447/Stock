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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Loader(props) {
  var children = props.children;
  var className = props.className;
  var active = props.active;
  var disabled = props.disabled;
  var indeterminate = props.indeterminate;
  var inline = props.inline;
  var inverted = props.inverted;
  var size = props.size;
  var text = props.text;

  var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(active, 'active'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useKeyOnly)(indeterminate, 'indeterminate'), (0, _lib.useKeyOrValueAndKey)(inline, 'inline'), (0, _lib.useKeyOnly)(inverted, 'inverted'), (0, _lib.useKeyOnly)(text, 'text') || (0, _lib.useKeyOnly)(children, 'text'), size, className, 'loader');
  var rest = (0, _lib.getUnhandledProps)(Loader, props);
  var ElementType = (0, _lib.getElementType)(Loader, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children || text
  );
}

Loader._meta = {
  name: 'Loader',
  type: _lib.META.TYPES.ELEMENT,
  props: {
    inline: ['centered'],
    size: _lib.SUI.SIZES
  }
};

Loader.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A loader can be active or visible. */
  active: _react.PropTypes.bool,

  /** Classes that will be added to the Loader className. */
  className: _react.PropTypes.string,

  /** Primary content of the Loader. Mutually exclusive with the text. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['text']), _react.PropTypes.node]),

  /** A loader can be disabled or hidden. */
  disabled: _react.PropTypes.bool,

  /** A loader can show it's unsure of how long a task will take. */
  indeterminate: _react.PropTypes.bool,

  /** Loaders can have their colors inverted. */
  inverted: _react.PropTypes.bool,

  /** Loaders can appear inline with content. */
  inline: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Loader._meta.props.inline)]),

  /** Loaders can have different sizes. */
  size: _react.PropTypes.oneOf(Loader._meta.props.size),

  /** Primary content of the Loader. Mutually exclusive with the children prop. */
  text: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

exports.default = Loader;