'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _elements = require('../../elements');

var _modules = require('../../modules');

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Confirm modal gives the user a choice to confirm or cancel an action
 * @see Modal
 */
function Confirm(props) {
  var active = props.active;
  var cancelButton = props.cancelButton;
  var confirmButton = props.confirmButton;
  var header = props.header;
  var content = props.content;
  var onConfirm = props.onConfirm;
  var onCancel = props.onCancel;

  var rest = (0, _lib.getUnhandledProps)(Confirm, props);

  return _react2.default.createElement(
    _modules.Modal,
    _extends({ active: active, size: 'small', onHide: onCancel }, rest),
    header && _react2.default.createElement(
      _modules.Modal.Header,
      null,
      header
    ),
    content && _react2.default.createElement(
      _modules.Modal.Content,
      null,
      content
    ),
    _react2.default.createElement(
      _modules.Modal.Actions,
      null,
      _react2.default.createElement(
        _elements.Button,
        { onClick: onCancel },
        cancelButton
      ),
      _react2.default.createElement(
        _elements.Button,
        { primary: true, onClick: onConfirm },
        confirmButton
      )
    )
  );
}

Confirm._meta = {
  name: 'Confirm',
  type: _lib.META.TYPES.ADDON
};

Confirm.propTypes = {
  /** Whether or not the modal is visible */
  active: _react.PropTypes.bool,

  /** The cancel button text */
  cancelButton: _react.PropTypes.string,

  /** The OK button text */
  confirmButton: _react.PropTypes.string,

  /** The ModalHeader text */
  header: _react.PropTypes.string,

  /** The ModalContent text. Mutually exclusive with children. */
  content: _react.PropTypes.string,

  /** Called when the OK button is clicked */
  onConfirm: _react.PropTypes.func,

  /** Called when the Cancel button is clicked */
  onCancel: _react.PropTypes.func
};

Confirm.defaultProps = {
  cancelButton: 'Cancel',
  confirmButton: 'OK',
  content: 'Are you sure?'
};

exports.default = Confirm;