'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _Step = require('./Step');

var _Step2 = _interopRequireDefault(_Step);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepGroup(props) {
  var className = props.className;
  var children = props.children;
  var fluid = props.fluid;
  var items = props.items;
  var ordered = props.ordered;
  var size = props.size;
  var stackable = props.stackable;
  var vertical = props.vertical;

  var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(ordered, 'ordered'), (0, _lib.useValueAndKey)(stackable, 'stackable'), (0, _lib.useKeyOnly)(vertical, 'vertical'), size, className, 'steps');
  var rest = (0, _lib.getUnhandledProps)(StepGroup, props);
  var ElementType = (0, _lib.getElementType)(StepGroup, props);

  var content = !items ? children : items.map(function (item) {
    var key = item.key || [item.title, item.description].join('-');
    return _react2.default.createElement(_Step2.default, _extends({ key: key }, item));
  });

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    content
  );
}

StepGroup._meta = {
  name: 'StepGroup',
  parent: 'Step',
  props: {
    sizes: (0, _without3.default)(_lib.SUI.SIZES, 'medium'),
    stackable: ['tablet']
  },
  type: _lib.META.TYPES.ELEMENT
};

StepGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Classes that will be added to the StepGroup className. */
  className: _react.PropTypes.string,

  /** Primary content of the StepGroup. Mutually exclusive with items prop. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['items']), _react.PropTypes.node]),

  /** A fluid step takes up the width of its container. */
  fluid: _react.PropTypes.bool,

  /** Primary content of the StepGroup. Mutually exclusive with items children. */
  items: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description', 'title']), _react.PropTypes.arrayOf(_react.PropTypes.shape({
    description: _react.PropTypes.node,
    icon: _react.PropTypes.node,
    key: _react.PropTypes.string,
    title: _react.PropTypes.node
  }))]),

  /** A step can show a ordered sequence of steps. */
  ordered: _react.PropTypes.bool,

  /** Steps can have different sizes. */
  size: _react.PropTypes.oneOf(StepGroup._meta.props.sizes),

  /** A step can stack vertically only on smaller screens. */
  stackable: _react.PropTypes.oneOf(StepGroup._meta.props.stackable),

  /** A step can be displayed stacked vertically. */
  vertical: _react.PropTypes.bool
};

exports.default = StepGroup;