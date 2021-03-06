'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _times2 = require('lodash/times');

var _times3 = _interopRequireDefault(_times2);

var _invoke2 = require('lodash/invoke');

var _invoke3 = _interopRequireDefault(_invoke2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _meta = {
  name: 'Rating',
  type: _lib.META.TYPES.MODULE,
  props: {
    clearable: ['auto'],
    icon: ['star', 'heart'],
    size: (0, _without3.default)(_lib.SUI.SIZES, 'medium', 'big')
  }
};

var Rating = function (_Component) {
  _inherits(Rating, _Component);

  function Rating() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Rating);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Rating.__proto__ || Object.getPrototypeOf(Rating)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Rating, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var disabled = _props.disabled;
      var icon = _props.icon;
      var size = _props.size;
      var _state = this.state;
      var selectedIndex = _state.selectedIndex;
      var isSelecting = _state.isSelecting;


      var classes = (0, _classnames2.default)('ui', size, icon, disabled && 'disabled', isSelecting && !disabled && selectedIndex >= 0 && 'selected', 'rating', className);

      var rest = (0, _lib.getUnhandledProps)(Rating, this.props);
      var ElementType = (0, _lib.getElementType)(Rating, this.props);

      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes, onMouseLeave: this.handleMouseLeave }),
        this.renderIcons()
      );
    }
  }]);

  return Rating;
}(_lib.AutoControlledComponent);

Rating.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Additional className. */
  className: _react.PropTypes.string,

  /**
   * You can clear the rating by clicking on the current start rating.
   * By default a rating will be only clearable if there is 1 icon.
   * Setting to `true`/`false` will allow or disallow a user to clear their rating.
   */
  clearable: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(_meta.props.clearable), _react.PropTypes.bool]),

  /** A rating can use a set of star or heart icons. */
  icon: _react.PropTypes.oneOf(_meta.props.icon),

  /** The total number of icons. */
  maxRating: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  /** The current number of active icons. */
  rating: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  /** The initial rating value. */
  defaultRating: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  /** A progress bar can vary in size. */
  size: _react.PropTypes.oneOf(_meta.props.size),

  /** You can disable or enable interactive rating.  Makes a read-only rating. */
  disabled: _react.PropTypes.bool,

  /** Called with (event, { rating, maxRating }) after user selects a new rating. */
  onRate: _react.PropTypes.func
};
Rating.defaultProps = {
  clearable: 'auto',
  maxRating: 1
};
Rating._meta = _meta;
Rating.autoControlledProps = ['rating'];

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.handleMouseLeave = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _invoke3.default.apply(undefined, [_this2.props, 'onMouseLeave'].concat(args));

    if (_this2.props.disabled) return;

    _this2.setState({ selectedIndex: -1, isSelecting: false });
  };

  this.handleIconMouseEnter = function (index) {
    if (_this2.props.disabled) return;

    _this2.setState({ selectedIndex: index, isSelecting: true });
  };

  this.handleIconClick = function (e, index) {
    var _props2 = _this2.props;
    var clearable = _props2.clearable;
    var disabled = _props2.disabled;
    var maxRating = _props2.maxRating;
    var onRate = _props2.onRate;
    var rating = _this2.state.rating;

    if (disabled) return;

    // default newRating is the clicked icon
    // allow toggling a binary rating
    // allow clearing ratings
    var newRating = index + 1;
    if (clearable === 'auto' && maxRating === 1) {
      newRating = +!rating;
    } else if (clearable === true && newRating === rating) {
      newRating = 0;
    }

    // set rating
    _this2.trySetState({ rating: newRating }, { isSelecting: false });
    if (onRate) onRate(e, { rating: newRating, maxRating: maxRating });
  };

  this.renderIcons = function () {
    var maxRating = _this2.props.maxRating;
    var _state2 = _this2.state;
    var rating = _state2.rating;
    var selectedIndex = _state2.selectedIndex;
    var isSelecting = _state2.isSelecting;


    return (0, _times3.default)(maxRating, function (i) {
      var classes = (0, _classnames2.default)(selectedIndex >= i && isSelecting && 'selected', rating >= i + 1 && 'active', 'icon');
      return _react2.default.createElement('i', {
        key: i,
        className: classes,
        onClick: function onClick(e) {
          return _this2.handleIconClick(e, i);
        },
        onMouseEnter: function onMouseEnter() {
          return _this2.handleIconMouseEnter(i);
        }
      });
    });
  };
};

exports.default = Rating;