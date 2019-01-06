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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StatisticLabel(props) {
  var children = props.children;
  var className = props.className;
  var label = props.label;

  var classes = (0, _classnames2.default)(className, 'label');
  var rest = (0, _lib.getUnhandledProps)(StatisticLabel, props);
  var ElementType = (0, _lib.getElementType)(StatisticLabel, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || label
  );
}

StatisticLabel._meta = {
  name: 'StatisticLabel',
  parent: 'Statistic',
  type: _lib.META.TYPES.VIEW
};

StatisticLabel.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the StatisticLabel. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the StatisticLabel className. */
  className: _react.PropTypes.string,

  /** Primary content of the StatisticLabel. Mutually exclusive with the children prop. */
  label: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.string])
};

exports.default = StatisticLabel;