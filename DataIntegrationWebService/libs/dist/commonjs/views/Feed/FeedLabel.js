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

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeedLabel(props) {
  var children = props.children;
  var className = props.className;
  var icon = props.icon;
  var image = props.image;

  var classes = (0, _classnames2.default)(className, 'label');
  var rest = (0, _lib.getUnhandledProps)(FeedLabel, props);
  var ElementType = (0, _lib.getElementType)(FeedLabel, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children,
    (0, _factories.createIcon)(icon),
    (0, _factories.createImg)(image)
  );
}

FeedLabel._meta = {
  name: 'FeedLabel',
  parent: 'Feed',
  type: _lib.META.TYPES.VIEW
};

FeedLabel.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the FeedLabel. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['icon', 'image']), _react.PropTypes.node]),

  /** Classes that will be added to the FeedLabel className. */
  className: _react.PropTypes.string,

  /** An event can contain icon label. */
  icon: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'image']), _react.PropTypes.node]),

  /** An event can contain image label. */
  image: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children', 'icon']), _react.PropTypes.node])
};

exports.default = FeedLabel;