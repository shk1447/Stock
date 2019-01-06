'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A rail is used to show accompanying content outside the boundaries of the main view of a site.
 */
function Rail(props) {
  var attached = props.attached;
  var className = props.className;
  var close = props.close;
  var children = props.children;
  var dividing = props.dividing;
  var internal = props.internal;
  var position = props.position;
  var size = props.size;

  var classes = (0, _classnames2.default)('ui', position, (0, _lib.useKeyOnly)(attached, 'attached'), (0, _lib.useKeyOrValueAndKey)(close, 'close'), (0, _lib.useKeyOnly)(dividing, 'dividing'), (0, _lib.useKeyOnly)(internal, 'internal'), size, className, 'rail');
  var rest = (0, _lib.getUnhandledProps)(Rail, props);
  var ElementType = (0, _lib.getElementType)(Rail, props);

  return _react2.default.createElement(
    ElementType,
    _extends({ className: classes }, rest),
    children
  );
}

Rail._meta = {
  name: 'Rail',
  props: {
    close: ['very'],
    position: _lib.SUI.FLOATS,
    size: (0, _without3.default)(_lib.SUI.SIZES, 'medium')
  },
  type: _lib.META.TYPES.ELEMENT
};

Rail.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A rail can appear attached to the main viewport. */
  attached: _react.PropTypes.bool,

  /** Classes that will be added to the Rail className. */
  className: _react.PropTypes.string,

  /** A rail can appear closer to the main viewport. */
  close: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(Rail._meta.props.close)]),

  /** Primary content of the Rail. */
  children: _react.PropTypes.node,

  /** A rail can create a division between itself and a container. */
  dividing: _react.PropTypes.bool,

  /** A rail can attach itself to the inside of a container. */
  internal: _react.PropTypes.bool,

  /** A rail can be presented on the left or right side of a container. */
  position: _react.PropTypes.oneOf(Rail._meta.props.position).isRequired,

  /** A rail can have different sizes. */
  size: _react.PropTypes.oneOf(Rail._meta.props.size)
};

exports.default = Rail;