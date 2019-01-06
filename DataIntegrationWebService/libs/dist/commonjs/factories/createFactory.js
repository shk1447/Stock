'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The default CreateFactory mergeExtraProps function.  Merges props and classNames.
 * @param props
 * @param extraProps
 * @returns {{className: *}}
 */
var mergePropsAndClassName = function mergePropsAndClassName(props, extraProps) {
  var className = void 0;
  if ((0, _has3.default)(props, 'className') || (0, _has3.default)(extraProps.className)) {
    className = (0, _classnames2.default)(props.className, extraProps.className); // eslint-disable-line react/prop-types
  }
  return _extends({}, props, extraProps, { className: className });
};

/**
 * Return a function that produces ReactElements.  Similar to React.createFactory with some extras.
 * If the returned factory is passed a ReactElement it will be cloned.
 * If it passed null or undefined it will do nothing.
 * @param {function|string} Component A ReactClass or string
 * @param {function} mapValueToProps A function that maps a primitive value to the Component props
 * @param {function} [mergeExtraProps=mergePropsAndClassName]
 * @returns {function}
 */
var createFactory = function createFactory(Component, mapValueToProps) {
  var mergeExtraProps = arguments.length <= 2 || arguments[2] === undefined ? mergePropsAndClassName : arguments[2];

  return function Factory(val) {
    var extraProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // Clone ReactElements
    if ((0, _react.isValidElement)(val)) {
      return _react2.default.cloneElement(val, mergeExtraProps(val.props, extraProps));
    }

    // Create ReactElements from props objects
    if ((0, _isPlainObject3.default)(val)) {
      return _react2.default.createElement(Component, mergeExtraProps(val, extraProps));
    }

    // Map values to props and create an ReactElement
    if (!(0, _isNil3.default)(val)) {
      return _react2.default.createElement(Component, mergeExtraProps(mapValueToProps(val), extraProps));
    }
  };
};

exports.default = createFactory;