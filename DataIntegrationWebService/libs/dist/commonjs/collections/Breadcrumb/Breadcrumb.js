'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _BreadcrumbDivider = require('./BreadcrumbDivider');

var _BreadcrumbDivider2 = _interopRequireDefault(_BreadcrumbDivider);

var _BreadcrumbSection = require('./BreadcrumbSection');

var _BreadcrumbSection2 = _interopRequireDefault(_BreadcrumbSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * A breadcrumb is used to show hierarchy between content.
 */
function Breadcrumb(props) {
  var children = props.children;
  var className = props.className;
  var divider = props.divider;
  var icon = props.icon;
  var size = props.size;
  var sections = props.sections;

  var rest = (0, _lib.getUnhandledProps)(Breadcrumb, props);
  var classes = (0, _classnames2.default)('ui', className, size, 'breadcrumb');
  var ElementType = (0, _lib.getElementType)(Breadcrumb, props);

  if (!sections) return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );

  var dividerJSX = _react2.default.createElement(
    _BreadcrumbDivider2.default,
    { icon: icon },
    divider
  );
  var sectionsJSX = [];

  sections.forEach(function (_ref, index) {
    var text = _ref.text;
    var key = _ref.key;

    var restSection = _objectWithoutProperties(_ref, ['text', 'key']);

    var finalKey = key || text;
    var dividerKey = finalKey + '-divider';

    sectionsJSX.push(_react2.default.createElement(
      _BreadcrumbSection2.default,
      _extends({}, restSection, { key: finalKey }),
      text
    ));

    if (index !== sections.length - 1) {
      sectionsJSX.push(_react2.default.cloneElement(dividerJSX, { key: dividerKey }));
    }
  });

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    sectionsJSX
  );
}

Breadcrumb._meta = {
  name: 'Breadcrumb',
  type: _lib.META.TYPES.COLLECTION,
  props: {
    size: (0, _without3.default)(_lib.SUI.SIZES, 'medium')
  }
};

Breadcrumb.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content of the Breadcrumb */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['sections', 'icon', 'divider']), _react.PropTypes.node]),

  /** Classes that will be added to the Breadcrumb className. */
  className: _react.PropTypes.string,

  /** For use with the sections prop. Primary content of the Breadcrumb.Divider. */
  divider: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['icon']), _react.PropTypes.string]),

  /** For use with the sections prop. Render as an `Icon` component with `divider` class instead of a `div` in
   *  Breadcrumb.Divider. */
  icon: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['divider']), _react.PropTypes.node]),

  /** Array of props for Breadcrumb.Section. */
  sections: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _react2.default.PropTypes.array]),

  /** Size of Breadcrumb */
  size: _react.PropTypes.oneOf(Breadcrumb._meta.props.size)
};

Breadcrumb.Divider = _BreadcrumbDivider2.default;
Breadcrumb.Section = _BreadcrumbSection2.default;

exports.default = Breadcrumb;