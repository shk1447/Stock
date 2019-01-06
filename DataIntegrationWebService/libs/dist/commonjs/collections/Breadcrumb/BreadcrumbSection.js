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

/**
 * A section sub-component for Breadcrumb component.
 */
function BreadcrumbSection(props) {
  var active = props.active;
  var children = props.children;
  var className = props.className;
  var href = props.href;
  var link = props.link;
  var onClick = props.onClick;

  var classes = (0, _classnames2.default)((0, _lib.useKeyOnly)(active, 'active'), className, 'section');
  var rest = (0, _lib.getUnhandledProps)(BreadcrumbSection, props);
  var ElementType = (0, _lib.getElementType)(BreadcrumbSection, props, function () {
    if (link || onClick) return 'a';
  });

  var handleClick = function handleClick(e) {
    if (onClick) onClick(e);
  };

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes, href: href, onClick: handleClick }),
    children
  );
}

BreadcrumbSection._meta = {
  name: 'BreadcrumbSection',
  type: _lib.META.TYPES.COLLECTION,
  parent: 'Breadcrumb'
};

BreadcrumbSection.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Style as the currently active section. */
  active: _react.PropTypes.bool,

  /** Primary content of the Breadcrumb.Section. */
  children: _react.PropTypes.node,

  /** Classes that will be added to the BreadcrumbSection className. */
  className: _react.PropTypes.string,

  /** Render as an `a` tag instead of a `div`. */
  link: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['href']), _react.PropTypes.bool]),

  /** Render as an `a` tag instead of a `div` and adds the href attribute. */
  href: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['link']), _react.PropTypes.string]),

  /** Render as an `a` tag instead of a `div` and called with event on Section click. */
  onClick: _react.PropTypes.func
};

exports.default = BreadcrumbSection;