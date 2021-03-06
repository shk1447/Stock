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

var _StatisticGroup = require('./StatisticGroup');

var _StatisticGroup2 = _interopRequireDefault(_StatisticGroup);

var _StatisticLabel = require('./StatisticLabel');

var _StatisticLabel2 = _interopRequireDefault(_StatisticLabel);

var _StatisticValue = require('./StatisticValue');

var _StatisticValue2 = _interopRequireDefault(_StatisticValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Statistic(props) {
  var children = props.children;
  var className = props.className;
  var color = props.color;
  var floated = props.floated;
  var horizontal = props.horizontal;
  var inverted = props.inverted;
  var label = props.label;
  var size = props.size;
  var text = props.text;
  var value = props.value;

  var classes = (0, _classnames2.default)('ui', color, (0, _lib.useValueAndKey)(floated, 'floated'), (0, _lib.useKeyOnly)(horizontal, 'horizontal'), (0, _lib.useKeyOnly)(inverted, 'inverted'), size, className, 'statistic');
  var rest = (0, _lib.getUnhandledProps)(Statistic, props);
  var ElementType = (0, _lib.getElementType)(Statistic, props);

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
    _react2.default.createElement(_StatisticValue2.default, { text: text, value: value }),
    _react2.default.createElement(_StatisticLabel2.default, { label: label })
  );
}

Statistic._meta = {
  name: 'Statistic',
  type: _lib.META.TYPES.VIEW,
  props: {
    color: _lib.SUI.COLORS,
    floated: _lib.SUI.FLOATS,
    size: (0, _without3.default)(_lib.SUI.SIZES, 'big', 'massive', 'medium')
  }
};

Statistic.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the Statistic. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['label', 'value']), _react.PropTypes.node]),

  /** Classes that will be added to the Statistic className. */
  className: _react.PropTypes.string,

  /** A statistic can be formatted to be different colors. */
  color: _react.PropTypes.oneOf(Statistic._meta.props.color),

  /** A statistic can sit to the left or right of other content. */
  floated: _react.PropTypes.oneOf(Statistic._meta.props.floated),

  /** A statistic can present its measurement horizontally. */
  horizontal: _react.PropTypes.bool,

  /** A statistic can be formatted to fit on a dark background. */
  inverted: _react.PropTypes.bool,

  /** Label content of the Statistic. Mutually exclusive with the children prop. */
  label: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string]),

  /** A statistic can vary in size. */
  size: _react.PropTypes.oneOf(Statistic._meta.props.size),

  /** Format the StatisticValue with smaller font size to fit nicely beside number values. */
  text: _react.PropTypes.bool,

  /** Value content of the Statistic. Mutually exclusive with the children prop. */
  value: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])])
};

Statistic.Group = _StatisticGroup2.default;
Statistic.Label = _StatisticLabel2.default;
Statistic.Value = _StatisticValue2.default;

exports.default = Statistic;