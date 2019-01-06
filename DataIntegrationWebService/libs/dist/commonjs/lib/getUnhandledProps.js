'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an object consisting of props beyond the scope of the Component.
 * Useful for getting and spreading unknown props from the user.
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @returns {{}} A shallow copy of the prop object
 */
var getUnhandledProps = function getUnhandledProps(Component, props) {
  var handledProps = (0, _union3.default)(Component.autoControlledProps, (0, _keys3.default)(Component.defaultProps), (0, _keys3.default)(Component.propTypes));

  return (0, _omit3.default)(props, handledProps);
};

exports.default = getUnhandledProps;