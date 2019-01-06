'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is an abstract component
// it is only used by the user to configure a Table
var TableColumn = function TableColumn() {
  return _react2.default.createElement('noscript', null);
};

TableColumn.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /**
   * A function that returns the cell contents.
   * Receives the row data as its only argument.
   */
  cellRenderer: _react.PropTypes.func,

  /** Additional classes */
  className: _react.PropTypes.string,

  /** The table data key that this column should render */
  dataKey: _react.PropTypes.string,

  /**
   * A function that returns the header contents.
   * Receives the row data as its only argument.
   */
  headerRenderer: _react.PropTypes.func
};

TableColumn._meta = {
  name: 'TableColumn',
  type: _lib.META.TYPES.COLLECTION,
  parent: 'Table'
};

exports.default = TableColumn;