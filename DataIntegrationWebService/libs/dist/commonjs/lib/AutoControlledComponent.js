'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _difference2 = require('lodash/difference');

var _difference3 = _interopRequireDefault(_difference2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _intersection2 = require('lodash/intersection');

var _intersection3 = _interopRequireDefault(_intersection2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _transform2 = require('lodash/transform');

var _transform3 = _interopRequireDefault(_transform2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-console */
/**
 * Why choose inheritance over a HOC?  Multiple advantages for this particular use case.
 * In short, we need identical functionality to setState(), unless there is a prop defined
 * for the state key.  Also:
 *
 * 1. Single Renders
 *    Calling trySetState() in constructor(), componentWillMount(), or componentWillReceiveProps()
 *    does not cause two renders. Consumers and tests do not have to wait two renders to get state.
 *    See www.react.run/4kJFdKoxb/27 for an example of this issue.
 *
 * 2. Simple Testing
 *    Using a HOC means you must either test the undecorated component or test through the decorator.
 *    Testing the undecorated component means you must mock the decorator functionality.
 *    Testing through the HOC means you can not simply shallow render your component.
 *
 * 3. Statics
 *    HOC wrap instances, so statics are no longer accessible.  They can be hoisted, but this is more
 *    looping over properties and storing references.  We rely heavily on statics for testing and sub
 *    components.
 *
 * 4. Instance Methods
 *    Some instance methods may be exposed to users via refs.  Again, these are lost with HOC unless
 *    hoisted and exposed by the HOC.
 */


var getDefaultPropName = function getDefaultPropName(prop) {
  return 'default' + (prop[0].toUpperCase() + prop.slice(1));
};

var AutoControlledComponent = function (_Component) {
  _inherits(AutoControlledComponent, _Component);

  function AutoControlledComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AutoControlledComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AutoControlledComponent.__proto__ || Object.getPrototypeOf(AutoControlledComponent)).call.apply(_ref, [this].concat(args))), _this), _this.trySetState = function (maybeState, state) {
      var autoControlledProps = _this.constructor.autoControlledProps;

      if (process.env.NODE_ENV !== 'production') {
        var name = _this.constructor.name;
        // warn about failed attempts to setState for keys not listed in autoControlledProps

        var illegalKeys = (0, _difference3.default)((0, _keys3.default)(maybeState), autoControlledProps);
        if (!(0, _isEmpty3.default)(illegalKeys)) {
          console.error([name + ' called trySetState() with controlled props: "' + illegalKeys + '".', 'State will not be set.', 'Only props in static autoControlledProps will be set on state.'].join(' '));
        }
      }

      // pick auto controlled props
      // omit props from parent
      var newState = (0, _omit3.default)((0, _pick3.default)(maybeState, autoControlledProps), (0, _keys3.default)(_this.props));

      if (state) newState = _extends({}, newState, state);

      if (!(0, _isEmpty3.default)(newState)) _this.setState(newState);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AutoControlledComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (_get(AutoControlledComponent.prototype.__proto__ || Object.getPrototypeOf(AutoControlledComponent.prototype), 'componentWillMount', this)) _get(AutoControlledComponent.prototype.__proto__ || Object.getPrototypeOf(AutoControlledComponent.prototype), 'componentWillMount', this).call(this);
      var autoControlledProps = this.constructor.autoControlledProps;

      // Auto controlled props are copied to state.
      // Set initial state by copying auto controlled props to state.
      // Also look for the default prop for any auto controlled props (foo => defaultFoo)
      // so we can set initial values from defaults.

      this.state = (0, _transform3.default)(autoControlledProps, function (res, prop) {
        var defaultPropName = getDefaultPropName(prop);

        // try to set initial state in this order:
        //  - default props
        //  - then, regular props
        //  - then, `checked` defaults to false
        //  - then, `value` defaults to null
        // React doesn't allow changing from uncontrolled to controlled components
        // this is why we default checked/value if they are not present.
        if ((0, _has3.default)(_this2.props, defaultPropName)) {
          res[prop] = _this2.props[defaultPropName];
        } else if ((0, _has3.default)(_this2.props, prop)) {
          res[prop] = _this2.props[prop];
        } else if (prop === 'checked') {
          res[prop] = false;
        } else if (prop === 'value') {
          res[prop] = _this2.props.multiple ? [] : ''; // eslint-disable-line react/prop-types
        }

        if (process.env.NODE_ENV !== 'production') {
          var name = _this2.constructor.name;
          // prevent defaultFoo={} along side foo={}

          if (defaultPropName in _this2.props && prop in _this2.props) {
            console.error(name + ' prop "' + prop + '" is auto controlled. Specify either ' + defaultPropName + ' or ' + prop + ', but not both.');
          }
        }
      }, {});

      if (process.env.NODE_ENV !== 'production') {
        (function () {
          var _constructor = _this2.constructor;
          var defaultProps = _constructor.defaultProps;
          var name = _constructor.name;
          var propTypes = _constructor.propTypes;
          // require static autoControlledProps

          if (!autoControlledProps) {
            console.error('Auto controlled ' + name + ' must specify a static autoControlledProps array.');
          }

          // require propTypes
          (0, _each3.default)(autoControlledProps, function (prop) {
            var defaultProp = getDefaultPropName(prop);
            // regular prop
            if (!(0, _has3.default)(propTypes, defaultProp)) {
              console.error(name + ' is missing "' + defaultProp + '" propTypes validation for auto controlled prop "' + prop + '".');
            }
            // its default prop
            if (!(0, _has3.default)(propTypes, prop)) {
              console.error(name + ' is missing propTypes validation for auto controlled prop "' + prop + '".');
            }
          });

          // prevent autoControlledProps in defaultProps
          //
          // When setting state, auto controlled props values always win (so the parent can manage them).
          // It is not reasonable to decipher the difference between props from the parent and defaultProps.
          // Allowing defaultProps results in trySetState always deferring to the defaultProp value.
          // Auto controlled props also listed in defaultProps can never be updated.
          var illegalDefaults = (0, _intersection3.default)(autoControlledProps, (0, _keys3.default)(defaultProps));
          if (!(0, _isEmpty3.default)(illegalDefaults)) {
            console.error(['Do not set defaultProps for autoControlledProps,', 'use trySetState() in constructor() or componentWillMount() instead.', 'See ' + name + ' props: "' + illegalDefaults + '".'].join(' '));
          }

          // prevent listing defaultProps in autoControlledProps
          //
          // Default props are automatically handled.
          // Listing defaults in autoControlledProps would result in allowing defaultDefaultValue props.
          var illegalAutoControlled = (0, _filter3.default)(autoControlledProps, function (prop) {
            return prop.startsWith('default');
          });
          if (!(0, _isEmpty3.default)(illegalAutoControlled)) {
            console.error(['Do not add default props to autoControlledProps.', 'Default props are automatically handled.', 'See ' + name + ' autoControlledProps: "' + illegalAutoControlled + '".'].join(' '));
          }
        })();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (_get(AutoControlledComponent.prototype.__proto__ || Object.getPrototypeOf(AutoControlledComponent.prototype), 'componentWillReceiveProps', this)) _get(AutoControlledComponent.prototype.__proto__ || Object.getPrototypeOf(AutoControlledComponent.prototype), 'componentWillReceiveProps', this).call(this, nextProps);

      // props always win, update state with all auto controlled prop
      var newState = (0, _pick3.default)(nextProps, this.constructor.autoControlledProps);
      if (!(0, _isEmpty3.default)(newState)) this.setState(newState);
    }

    /**
     * Safely attempt to set state for props that might be controlled by the user.
     * Second argument is a state object that is always passed to setState.
     * @param {object} maybeState State that corresponds to controlled props.
     * @param {object} [state] Actual state, useful when you also need to setState.
     */

  }]);

  return AutoControlledComponent;
}(_react.Component);

exports.default = AutoControlledComponent;