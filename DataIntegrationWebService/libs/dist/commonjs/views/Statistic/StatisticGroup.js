'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _Statistic = require('./Statistic');

var _Statistic2 = _interopRequireDefault(_Statistic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StatisticGroup(props) {
  var children = props.children;
  var className = props.className;
  var horizontal = props.horizontal;
  var items = props.items;
  var widths = props.widths;

  var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(horizontal, 'horizontal'), (0, _lib.useWidthProp)(widths), 'statistics', className);
  var rest = (0, _lib.getUnhandledProps)(StatisticGroup, props);
  var ElementType = (0, _lib.getElementType)(StatisticGroup, props);

  if (children) {
    return _react2.default.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      children
    );
  }

  var itemsJSX = (0, _map3.default)(items, function (item) {
    return _react2.default.createElement(_Statistic2.default, _extends({ key: item.childKey || [item.label, item.title].join('-') }, item));
  });

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    itemsJSX
  );
}

StatisticGroup._meta = {
  name: 'StatisticGroup',
  type: _lib.META.TYPES.VIEW,
  parent: 'Statistic',
  props: {
    widths: _lib.SUI.WIDTHS
  }
};

StatisticGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the StatisticGroup. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['content']), _react.PropTypes.node]),

  /** Classes that will be added to the StatisticGroup className. */
  className: _react.PropTypes.string,

  /** A statistic can present its measurement horizontally. */
  horizontal: _react.PropTypes.bool,

  /** Array of props for Statistic. */
  items: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.arrayOf(_react.PropTypes.shape({
    childKey: _react.PropTypes.string
  }))]),

  /** A statistic group can have its items divided evenly. */
  widths: _react.PropTypes.oneOf(StatisticGroup._meta.props.widths)
};

exports.default = StatisticGroup;