'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _FormField = require('./FormField');

var _FormField2 = _interopRequireDefault(_FormField);

var _addons = require('../../addons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sugar for <Form.Field control={Radio} />
 * @see Form
 * @see Radio
 */
function FormRadio(props) {
  var control = props.control;

  var rest = (0, _lib.getUnhandledProps)(FormRadio, props);
  var ElementType = (0, _lib.getElementType)(FormRadio, props);
  return _react2.default.createElement(ElementType, _extends({}, rest, { control: control }));
}

FormRadio._meta = {
  name: 'FormRadio',
  parent: 'Form',
  type: _lib.META.TYPES.COLLECTION
};

FormRadio.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A FormField control prop */
  control: _FormField2.default.propTypes.control
};

FormRadio.defaultProps = {
  as: _FormField2.default,
  control: _addons.Radio
};

exports.default = FormRadio;