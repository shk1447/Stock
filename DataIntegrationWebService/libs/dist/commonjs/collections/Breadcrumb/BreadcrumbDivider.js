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

/**
 * A divider sub-component for Breadcrumb component.
 */
function BreadcrumbDivider(props) {
  var children = props.children;
  var icon = props.icon;
  var className = props.className;

  var rest = (0, _lib.getUnhandledProps)(BreadcrumbDivider, props);
  var classes = (0, _classnames2.default)(className, 'divider');
  var ElementType = (0, _lib.getElementType)(BreadcrumbDivider, props);

  if (icon) return (0, _factories.createIcon)(icon, _extends({}, rest, { className: classes }));

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children || '/'
  );
}

BreadcrumbDivider._meta = {
  name: 'BreadcrumbDivider',
  type: _lib.META.TYPES.COLLECTION,
  parent: 'Breadcrumb'
};

BreadcrumbDivider.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the Breadcrumb.Divider. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['icon']), _react.PropTypes.node]),

  /** Classes that will be added to the BreadcrumbDivider className. */
  className: _react.PropTypes.string,

  /** Render as an `Icon` component with `divider` class instead of a `div`. */
  icon: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react.PropTypes.node])
};

exports.default = BreadcrumbDivider;