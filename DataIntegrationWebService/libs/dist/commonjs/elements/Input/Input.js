'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _elements = require('../../elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inputPropNames = [
// React
'selected', 'defaultValue', 'defaultChecked',

// HTML
'accept', 'alt', 'autoComplete', 'autoFocus', 'checked', 'dirname', 'disabled', 'form', 'height', 'list', 'max', 'maxLength', 'min', 'multiple', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'src', 'step', 'type', 'value', 'width'];

/**
 * An Input is a field used to elicit a response from a user
 * @see Form
 */

var Input = function (_Component) {
  _inherits(Input, _Component);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));
  }

  _createClass(Input, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;
      var icon = _props.icon;
      var input = _props.input;
      var type = _props.type;
      // Semantic supports actions and labels on either side of an input.
      // The element must be on the same side as the indicated class.
      // We first determine the left/right classes for each type of child,
      //   then we extract the children and place them on the correct side
      //   of the input.

      var isLeftAction = (0, _includes3.default)(className, 'left action');
      var isRightAction = !isLeftAction && (0, _includes3.default)(className, 'action');
      var isRightLabeled = (0, _includes3.default)(className, 'right labeled');
      var isLeftLabeled = !isRightLabeled && (0, _includes3.default)(className, 'labeled');

      var labelChildren = [];
      var actionChildren = [];

      _react.Children.forEach(children, function (child) {
        var isAction = (0, _includes3.default)(['Button', 'Dropdown', 'Select'], child.type._meta.name);
        var isLabel = child.type._meta.name === 'Label';

        if (isAction) {
          actionChildren.push(child);
        } else if (isLabel) {
          labelChildren.push(child);
        }
      });

      var classes = (0, _classnames2.default)('ui', className, 'input');
      var unhandledProps = (0, _lib.getUnhandledProps)(Input, this.props);
      var inputProps = (0, _pick3.default)(unhandledProps, inputPropNames);
      var rest = (0, _omit3.default)(unhandledProps, inputPropNames);
      var ElementType = (0, _lib.getElementType)(Input, this.props);
      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes }),
        isLeftLabeled && labelChildren,
        isLeftAction && actionChildren,
        _react2.default.createElement('input', _extends({}, inputProps, input, { type: type })),
        icon && _react2.default.createElement(_elements.Icon, { name: icon }),
        isRightLabeled && labelChildren,
        isRightAction && actionChildren
      );
    }
  }]);

  return Input;
}(_react.Component);

Input.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  children: _react.PropTypes.node,
  className: _react.PropTypes.string,
  icon: _react.PropTypes.string,
  input: _react.PropTypes.object,
  type: _react.PropTypes.string
};
Input.defaultProps = {
  type: 'text'
};
Input._meta = {
  name: 'Input',
  type: _lib.META.TYPES.ELEMENT
};
exports.default = Input;