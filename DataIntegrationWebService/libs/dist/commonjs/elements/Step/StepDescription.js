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

function StepDescription(props) {
  var className = props.className;
  var children = props.children;
  var description = props.description;

  var classes = (0, _classnames2.default)(className, 'description');
  var rest = (0, _lib.getUnhandledProps)(StepDescription, props);
  var ElementType = (0, _lib.getElementType)(StepDescription, props);

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || description
  );
}

StepDescription._meta = {
  name: 'StepDescription',
  parent: 'Step',
  type: _lib.META.TYPES.ELEMENT
};

StepDescription.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Classes that will be added to the StepDescription className. */
  className: _react.PropTypes.string,

  /** Primary content of the StepDescription. Mutually exclusive with description prop. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description']), _react.PropTypes.node]),

  /** Primary content of the StepDescription. Mutually exclusive with children. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

exports.default = StepDescription;