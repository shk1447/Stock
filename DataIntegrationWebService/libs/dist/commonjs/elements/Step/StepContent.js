'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

var _StepDescription = require('./StepDescription');

var _StepDescription2 = _interopRequireDefault(_StepDescription);

var _StepTitle = require('./StepTitle');

var _StepTitle2 = _interopRequireDefault(_StepTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepContent(props) {
  var className = props.className;
  var children = props.children;
  var description = props.description;
  var title = props.title;

  var classes = (0, _classnames2.default)(className, 'content');
  var rest = (0, _lib.getUnhandledProps)(StepContent, props);
  var ElementType = (0, _lib.getElementType)(StepContent, props);

  if (children) {
    return _react2.default.createElement(
      'div',
      _extends({}, rest, { className: classes }),
      children
    );
  }

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    title && _react2.default.createElement(_StepTitle2.default, { title: title }),
    description && _react2.default.createElement(_StepDescription2.default, { description: description })
  );
}

StepContent._meta = {
  name: 'StepContent',
  parent: 'Step',
  type: _lib.META.TYPES.ELEMENT
};

StepContent.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Classes that will be added to the StepContent className. */
  className: _react.PropTypes.string,

  /** Primary content of StepContent. Mutually exclusive with description and title props. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description', 'title']), _react.PropTypes.node]),

  /** Primary content of the StepDescription. Mutually exclusive with children. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Primary content of the StepTitle. Mutually exclusive with children. */
  title: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

exports.default = StepContent;