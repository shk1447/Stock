'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _modules = require('../../modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Select is sugar for <Dropdown selection />.
 * @see Dropdown
 * @see Form
 */
function Select(props) {
  var selection = props.selection;

  var rest = (0, _lib.getUnhandledProps)(Select, props);
  return _react2.default.createElement(_modules.Dropdown, _extends({}, rest, { selection: selection }));
}

Select._meta = {
  name: 'Select',
  type: _lib.META.TYPES.ADDON
};

Select.propTypes = {
  /** selection value */
  selection: _react.PropTypes.bool
};

Select.defaultProps = {
  selection: true
};

exports.default = Select;