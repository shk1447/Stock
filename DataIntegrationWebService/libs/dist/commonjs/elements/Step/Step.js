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

var _StepContent = require('./StepContent');

var _StepContent2 = _interopRequireDefault(_StepContent);

var _StepDescription = require('./StepDescription');

var _StepDescription2 = _interopRequireDefault(_StepDescription);

var _StepGroup = require('./StepGroup');

var _StepGroup2 = _interopRequireDefault(_StepGroup);

var _StepTitle = require('./StepTitle');

var _StepTitle2 = _interopRequireDefault(_StepTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A step shows the completion status of an activity in a series of activities.
 */
function Step(props) {
  var active = props.active;
  var className = props.className;
  var children = props.children;
  var completed = props.completed;
  var description = props.description;
  var disabled = props.disabled;
  var icon = props.icon;
  var href = props.href;
  var link = props.link;
  var onClick = props.onClick;
  var title = props.title;

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(active, 'active'), (0, _lib.useKeyOnly)(completed, 'completed'), (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useKeyOnly)(link, 'link'), className, 'step');
  var rest = (0, _lib.getUnhandledProps)(Step, props);

  var handleClick = function handleClick(e) {
    if (onClick) onClick(e);
  };
  var ElementType = (0, _lib.getElementType)(Step, props, function () {
    if (onClick) return 'a';
  });

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, {
      className: classes,
      href: href,
      onClick: handleClick
    }),
    !children && (0, _factories.createIcon)(icon),
    children || _react2.default.createElement(_StepContent2.default, { description: description, title: title })
  );
}

Step._meta = {
  name: 'Step',
  type: _lib.META.TYPES.ELEMENT
};

Step.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** A step can be highlighted as active. */
  active: _react.PropTypes.bool,

  /** Classes that will be added to the Step className. */
  className: _react.PropTypes.string,

  /** Primary content of the Step. Mutually exclusive with description and title props. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['description', 'title']), _react.PropTypes.node]),

  /** A step can show that a user has completed it. */
  completed: _react.PropTypes.bool,

  /** Shorthand prop for StepDescription. Mutually exclusive with children. */
  description: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** Show that the Loader is inactive. */
  disabled: _react.PropTypes.bool,

  /** A step can contain an icon. */
  icon: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node]),

  /** A step can be link. */
  link: _react.PropTypes.bool,

  /** Render as an `a` tag instead of a `div` and adds the href attribute. */
  href: _react.PropTypes.string,

  /** Render as an `a` tag instead of a `div` and called with event on Step click. */
  onClick: _react.PropTypes.func,

  /** A step can show a ordered sequence of steps. Passed from StepGroup. */
  ordered: _react.PropTypes.bool,

  /** Shorthand prop for StepTitle. Mutually exclusive with children. */
  title: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

Step.Content = _StepContent2.default;
Step.Description = _StepDescription2.default;
Step.Group = _StepGroup2.default;
Step.Title = _StepTitle2.default;

exports.default = Step;