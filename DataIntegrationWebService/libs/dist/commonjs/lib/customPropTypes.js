'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demand = exports.givenProps = exports.some = exports.every = exports.disallow = exports.ofComponentTypes = undefined;

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _every2 = require('lodash/every');

var _every3 = _interopRequireDefault(_every2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _compact2 = require('lodash/compact');

var _compact3 = _interopRequireDefault(_compact2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _templateObject = _taggedTemplateLiteral([' See ', ' prop `', '`.'], [' See ', ' prop \\`', '\\`.']);

var _react = require('react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var type = function type() {
  var _Object$prototype$toS;

  return (_Object$prototype$toS = Object.prototype.toString).call.apply(_Object$prototype$toS, arguments);
};

/**
 * Ensures children are of a set of types. Matches are made against the component _meta.name property.
 * @param {String[]} allowedTypes Collection of allowed component types.
 */
var ofComponentTypes = exports.ofComponentTypes = function ofComponentTypes(allowedTypes) {
  return function (props, propName, componentName) {
    if (propName !== 'children') {
      throw new Error('ofComponentTypes can only be used on the `children` prop, not ' + propName + '.');
    }
    if (!(0, _isArray3.default)(allowedTypes)) {
      throw new Error(['Invalid argument supplied to ofComponentTypes, expected an instance of array.'(_templateObject, componentName, propName)].join(''));
    }
    var disallowed = (0, _compact3.default)(_react.Children.map(props.children, function (child) {
      return (0, _includes3.default)(allowedTypes, (0, _get3.default)(child, 'type._meta.name')) ? null : child;
    }));
    if (!(0, _isEmpty3.default)(disallowed)) {
      return new Error('`' + componentName + '` should only have children of type `' + allowedTypes + '`.');
    }
  };
};

/**
 * Verifies exclusivity of a given prop.
 * @param {string[]} disallowedProps An array of props that cannot be used with this prop.
 */
var disallow = exports.disallow = function disallow(disallowedProps) {
  return function (props, propName, componentName) {
    if (!(0, _isArray3.default)(disallowedProps)) {
      throw new Error(['Invalid argument supplied to mutuallyExclusive, expected an instance of array.'(_templateObject, componentName, propName)].join(''));
    }

    // mutually exclusive
    var disallowed = disallowedProps.reduce(function (acc, exclusive) {
      if (!(0, _isUndefined3.default)(props[propName]) && !(0, _isUndefined3.default)(props[exclusive])) {
        return [].concat(_toConsumableArray(acc), [exclusive]);
      }
      return acc;
    }, []);

    if (!(0, _isEmpty3.default)(disallowed)) {
      return new Error(['`' + componentName + '` prop `' + propName + '` conflicts with props: `' + disallowed.join('`, `') + '`.', 'They cannot be defined together, choose one or the other.'].join(' '));
    }
  };
};

/**
 * Ensure a prop adherers to multiple prop type validators.
 * @param {function[]} validators An array of propType functions.
 */
var every = exports.every = function every(validators) {
  return function (props, propName, componentName) {
    for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    if (!(0, _isArray3.default)(validators)) {
      throw new Error(['Invalid argument supplied to all, expected an instance of array.', 'See ' + componentName + ' prop `' + propName + '`.'].join(' '));
    }

    var errors = (0, _compact3.default)((0, _map3.default)(validators, function (validator) {
      if (!(0, _isFunction3.default)(validator)) {
        throw new Error('all() argument "validators" should contain functions, found: ' + type(validator) + '.');
      }
      return validator.apply(undefined, [props, propName, componentName].concat(rest));
    }));

    // we can only return one error at a time
    return errors[0];
  };
};

/**
 * Ensure a prop adherers to at least one of the given prop type validators.
 * @param {function[]} validators An array of propType functions.
 */
var some = exports.some = function some(validators) {
  return function (props, propName, componentName) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    if (!(0, _isArray3.default)(validators)) {
      throw new Error(['Invalid argument supplied to all, expected an instance of array.', 'See ' + componentName + ' prop `' + propName + '`.'].join(' '));
    }

    var errors = (0, _compact3.default)((0, _map3.default)(validators, function (validator) {
      if (!(0, _isFunction3.default)(validator)) {
        throw new Error('any() argument "validators" should contain functions, found: ' + type(validator) + '.');
      }
      return validator.apply(undefined, [props, propName, componentName].concat(rest));
    }));

    // fail only if all validators failed
    if (errors.length === validators.length) {
      var error = new Error('One of these validators must pass:');
      error.message += '\n' + (0, _map3.default)(errors, function (err, i) {
        return '[' + (i + 1) + ']: ' + err.message;
      }).join('\n');
      return error;
    }
  };
};

/**
 * Ensure a validator passes only when a component has a given propsShape.
 * @param {object} propsShape An object describing the prop shape.
 * @param {function} validator A propType function.
 */
var givenProps = exports.givenProps = function givenProps(propsShape, validator) {
  return function (props, propName, componentName) {
    for (var _len3 = arguments.length, rest = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      rest[_key3 - 3] = arguments[_key3];
    }

    var shouldValidate = (0, _every3.default)(propsShape, function (val, key) {
      // require propShape validators to pass or prop values to match
      return (0, _isFunction3.default)(val) ? !val.apply(undefined, [props, key, componentName].concat(rest)) : val === props[propName];
    });

    if (!shouldValidate) return;

    if (!(0, _isPlainObject3.default)(propsShape)) {
      throw new Error('Invalid argument supplied to whenShape, expected an object. See ' + componentName + ' prop `' + propName + '`.');
    }

    if (!(0, _isFunction3.default)(validator)) {
      throw new Error('Invalid argument supplied to whenShape, expected a function. See ' + componentName + ' prop `' + propName + '`.');
    }

    var error = validator.apply(undefined, [props, propName, componentName].concat(rest));

    if (error) {
      // poor mans shallow pretty print, prevents JSON circular reference errors
      var prettyProps = '{ ' + (0, _map3.default)((0, _pick3.default)(props, (0, _keys3.default)(propsShape)), function (val, key) {
        var value = val;
        if ((0, _isString3.default)(val)) value = '"' + val + '"';else if ((0, _isArray3.default)(val)) value = '[' + val.join(', ') + ']';else if ((0, _isObject3.default)(val)) value = '{...}';

        return key + ': ' + value;
      }).join(', ') + ' }';

      error.message = 'Given props ' + prettyProps + ': ' + error.message;
      return error;
    }
  };
};

/**
 * Define prop dependencies by requiring other props.
 * @param {string[]} requiredProps An array of required prop names.
 */
var demand = exports.demand = function demand(requiredProps) {
  return function (props, propName, componentName) {
    if (!(0, _isArray3.default)(requiredProps)) {
      throw new Error(['Invalid `requiredProps` argument supplied to require, expected an instance of array.'(_templateObject, componentName, propName)].join(''));
    }

    // do not require requiredProps if the prop does not exist in props
    if ((0, _isUndefined3.default)(props, propName)) return;

    var missingRequired = requiredProps.filter(function (required) {
      return (0, _isUndefined3.default)(props, required);
    });
    if (!(0, _isEmpty3.default)(missingRequired)) {
      return new Error('`' + componentName + '` prop `' + propName + '` requires props: `' + missingRequired.join('`, `') + '`.');
    }
  };
};