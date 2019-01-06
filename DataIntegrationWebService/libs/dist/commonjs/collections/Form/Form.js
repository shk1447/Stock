'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _FormButton = require('./FormButton');

var _FormButton2 = _interopRequireDefault(_FormButton);

var _FormCheckbox = require('./FormCheckbox');

var _FormCheckbox2 = _interopRequireDefault(_FormCheckbox);

var _FormDropdown = require('./FormDropdown');

var _FormDropdown2 = _interopRequireDefault(_FormDropdown);

var _FormField = require('./FormField');

var _FormField2 = _interopRequireDefault(_FormField);

var _FormGroup = require('./FormGroup');

var _FormGroup2 = _interopRequireDefault(_FormGroup);

var _FormInput = require('./FormInput');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _FormRadio = require('./FormRadio');

var _FormRadio2 = _interopRequireDefault(_FormRadio);

var _FormSelect = require('./FormSelect');

var _FormSelect2 = _interopRequireDefault(_FormSelect);

var _FormTextArea = require('./FormTextArea');

var _FormTextArea2 = _interopRequireDefault(_FormTextArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _lib.makeDebugger)('form');

var getNodeName = function getNodeName(_ref) {
  var name = _ref.name;
  return name;
};
var debugSerializedResult = function debugSerializedResult() {
  return undefined;
};

if (process.NODE_ENV !== 'production') {
  // debug serialized values
  debugSerializedResult = function debugSerializedResult(json, name, node) {
    debug('serialized ' + JSON.stringify(_defineProperty({}, name, json[name])) + ' from:', node);
  };

  // warn about form nodes missing a "name"
  getNodeName = function getNodeName(node) {
    var name = node.name;

    if (!name) {
      var errorMessage = ['Encountered a form control node without a name attribute.', 'Each node in a group should have a name.', 'Otherwise, the node will serialize as { "undefined": <value> }.'].join(' ');
      console.error(errorMessage, node); // eslint-disable-line no-console
    }

    return name;
  };
}

function formSerializer(formNode) {
  debug('formSerializer()');
  var json = {};
  // handle empty formNode ref
  if (!formNode) return json;

  // ----------------------------------------
  // Checkboxes
  // Single: { name: value|bool        }
  // Group:  { name: [value|bool, ...] }

  (0, _each3.default)(formNode.querySelectorAll('input[type="checkbox"]'), function (node, index, arr) {
    var name = getNodeName(node);
    var checkboxesByName = (0, _filter3.default)(arr, { name: name });

    // single: (value|checked)
    if (checkboxesByName.length === 1) {
      json[name] = node.checked && node.value !== 'on' ? node.value : node.checked;
      debugSerializedResult(json, name, node);
      return;
    }

    // groups (checked): [value, ...]
    if (!Array.isArray(json[name])) json[name] = [];
    if (node.checked) json[name].push(node.value);
    debugSerializedResult(json, name, node);

    // in dev, warn about multiple checkboxes with a default browser value of "on"
    if (process.NODE_ENV !== 'production' && node.value === 'on') {
      var errorMessage = ["Encountered a checkbox in a group with the default browser value 'on'.", 'Each checkbox in a group should have a unique value.', "Otherwise, the checkbox value will serialize as ['on', ...]."].join(' ');
      console.error(errorMessage, node, formNode); // eslint-disable-line no-console
    }
  });

  // ----------------------------------------
  // Radios
  // checked: { name: checked value }
  // none:    { name: null }

  (0, _each3.default)(formNode.querySelectorAll('input[type="radio"]'), function (node, index, arr) {
    var name = getNodeName(node);
    var checkedRadio = (0, _find3.default)(arr, { name: name, checked: true });

    if (checkedRadio) {
      json[name] = checkedRadio.value;
    } else {
      json[name] = null;
    }

    debugSerializedResult(json, name, node);

    // in dev, warn about radios with a default browser value of "on"
    if (process.NODE_ENV !== 'production' && node.value === 'on') {
      var errorMessage = ["Encountered a radio with the default browser value 'on'.", 'Each radio should have a unique value.', "Otherwise, the radio value will serialize as { [name]: 'on' }."].join(' ');
      console.error(errorMessage, node, formNode); // eslint-disable-line no-console
    }
  });

  // ----------------------------------------
  // Other inputs
  // { name: value }

  (0, _each3.default)(formNode.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])'), function (node) {
    var name = getNodeName(node);
    json[name] = node.value;
    debugSerializedResult(json, name, node);
  });

  // ----------------------------------------
  // Other inputs and text areas
  // { name: value }

  (0, _each3.default)(formNode.querySelectorAll('textarea'), function (node) {
    var name = getNodeName(node);
    json[name] = node.value;
    debugSerializedResult(json, name, node);
  });

  // ----------------------------------------
  // Selects
  // single:   { name: value }
  // multiple: { name: [value, ...] }

  (0, _each3.default)(formNode.querySelectorAll('select'), function (node) {
    var name = getNodeName(node);

    if (node.multiple) {
      json[name] = (0, _map3.default)((0, _filter3.default)(node.querySelectorAll('option'), 'selected'), 'value');
    } else {
      json[name] = node.value;
    }

    debugSerializedResult(json, name, node);
  });

  return json;
}

/**
 * A Form displays a set of related user input fields in a structured way.
 * @see Button
 * @see Checkbox
 * @see Dropdown
 * @see Input
 * @see Message
 * @see Radio
 * @see Select
 * @see TextArea
 */
function Form(props) {
  var className = props.className;
  var children = props.children;
  var error = props.error;
  var loading = props.loading;
  var onSubmit = props.onSubmit;
  var size = props.size;
  var success = props.success;
  var warning = props.warning;
  var widths = props.widths;

  var classes = (0, _classnames2.default)('ui', size, (0, _lib.useKeyOnly)(loading, 'loading'), (0, _lib.useKeyOnly)(success, 'success'), (0, _lib.useKeyOnly)(error, 'error'), (0, _lib.useKeyOnly)(warning, 'warning'), (0, _lib.useWidthProp)(widths, null, true), 'form', className);
  var rest = (0, _lib.getUnhandledProps)(Form, props);
  var ElementType = (0, _lib.getElementType)(Form, props);
  var _form = void 0;

  var handleSubmit = function handleSubmit(e) {
    if (onSubmit) onSubmit(e, props.serializer(_form));
  };

  return _react2.default.createElement(
    ElementType,
    _extends({}, rest, {
      className: classes,
      onSubmit: handleSubmit,
      ref: function ref(c) {
        return _form = _form || c;
      }
    }),
    children
  );
}

Form.Field = _FormField2.default;
Form.Button = _FormButton2.default;
Form.Checkbox = _FormCheckbox2.default;
Form.Dropdown = _FormDropdown2.default;
Form.Group = _FormGroup2.default;
Form.Input = _FormInput2.default;
Form.Radio = _FormRadio2.default;
Form.Select = _FormSelect2.default;
Form.TextArea = _FormTextArea2.default;

Form._meta = {
  name: 'Form',
  type: _lib.META.TYPES.COLLECTION,
  props: {
    widths: ['equal'],
    size: (0, _without3.default)(_lib.SUI.SIZES, 'medium')
  }
};

Form.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /** Primary content */
  children: _react.PropTypes.node,

  /** Additional classes */
  className: _react.PropTypes.string,

  /** Automatically show a loading indicator */
  loading: _react.PropTypes.bool,

  /** Automatically show any success Message children */
  success: _react.PropTypes.bool,

  /** Automatically show any error Message children */
  error: _react.PropTypes.bool,

  /** Automatically show any warning Message children */
  warning: _react.PropTypes.bool,

  /** A form can vary in size */
  size: _react.PropTypes.oneOf(Form._meta.props.size),

  /** Forms can automatically divide fields to be equal width */
  widths: _react.PropTypes.oneOf(Form._meta.props.widths),

  /** Called onSubmit with the form node that returns the serialized form object */
  serializer: _react.PropTypes.func,

  /** Called with (event, jsonSerializedForm) on submit */
  onSubmit: _react.PropTypes.func
};

Form.defaultProps = {
  as: 'form',
  serializer: formSerializer
};

exports.default = Form;