'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _startCase2 = require('lodash/startCase');

var _startCase3 = _interopRequireDefault(_startCase2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lib = require('../../lib');

var _TableColumn = require('./TableColumn');

var _TableColumn2 = _interopRequireDefault(_TableColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table(props, context) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props, context));

    _this._isSelectable = function () {
      return (0, _includes3.default)(_this.props.className, 'selectable');
    };

    _this.state = {
      selectedRows: _this.props.defaultSelectedRows || []
    };
    return _this;
  }

  _createClass(Table, [{
    key: '_isRowSelected',
    value: function _isRowSelected(index) {
      return (0, _includes3.default)(this.state.selectedRows, index);
    }
  }, {
    key: '_unselectRow',
    value: function _unselectRow(index) {
      if (!this._isSelectable()) return;
      this.setState({
        selectedRows: (0, _without3.default)(this.state.selectedRows, index)
      });
    }
  }, {
    key: '_selectRow',
    value: function _selectRow(index) {
      if (!this._isSelectable()) return;
      this.setState({ selectedRows: [index] });
    }
  }, {
    key: '_unselectAllRows',
    value: function _unselectAllRows() {
      if (!this._isSelectable()) return;
      this.setState({ selectedRows: [] });
    }
  }, {
    key: '_toggleSelectRow',
    value: function _toggleSelectRow(index) {
      if (this._isRowSelected(index)) {
        this._unselectRow(index);
      } else {
        this._selectRow(index);
      }
    }
  }, {
    key: '_handleSelectRow',
    value: function _handleSelectRow(rowItem, rowIndex) {
      this._toggleSelectRow(rowIndex);
      if (this.props.onSelectRow) this.props.onSelectRow(rowItem, rowIndex);
    }
  }, {
    key: '_handleSortHeaderChange',
    value: function _handleSortHeaderChange(key, direction) {
      var onSortChange = this.props.onSortChange;

      if (onSortChange) {
        this._unselectAllRows();
        onSortChange(key, direction);
      }
    }
  }, {
    key: '_getHeaders',
    value: function _getHeaders() {
      var _this2 = this;

      var _props = this.props;
      var children = _props.children;
      var data = _props.data;
      var sort = _props.sort;


      return _react.Children.map(children, function (column) {
        var _column$props = column.props;
        var dataKey = _column$props.dataKey;
        var headerRenderer = _column$props.headerRenderer;

        var content = headerRenderer ? headerRenderer(data[0]) : (0, _startCase3.default)(dataKey);
        var isSorted = sort.key === dataKey;
        var onClick = function onClick() {
          return _this2._handleSortHeaderChange(dataKey, sort.direction === 'ascending' ? 'descending' : 'ascending');
        };
        var classes = (0, _classnames2.default)({
          sorted: isSorted,
          ascending: isSorted && sort.direction === 'ascending',
          descending: isSorted && sort.direction === 'descending'
        });

        return _react2.default.createElement(
          'th',
          { className: classes, key: dataKey, onClick: onClick },
          content
        );
      });
    }
  }, {
    key: '_getCells',
    value: function _getCells(dataItem, rowIndex) {
      return _react.Children.map(this.props.children, function (column) {
        var content = void 0;
        if (column.props.cellRenderer) {
          content = column.props.cellRenderer(dataItem);
        } else {
          var itemContents = dataItem[column.props.dataKey];
          content = Table.getSafeCellContents(itemContents);
        }

        return _react2.default.createElement(
          'td',
          { key: rowIndex + column.props.dataKey },
          content
        );
      });
    }
  }, {
    key: '_getRows',
    value: function _getRows() {
      var _this3 = this;

      return (0, _map3.default)(this.props.data, function (dataItem, rowIndex) {
        var cells = _this3._getCells(dataItem, rowIndex);
        var classes = (0, _classnames2.default)({
          active: _this3._isRowSelected(rowIndex)
        });
        var onClick = function onClick() {
          return _this3._handleSelectRow(dataItem, rowIndex);
        };

        return _react2.default.createElement(
          'tr',
          { className: classes, key: rowIndex, onClick: onClick },
          cells
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var onSelectRow = _props2.onSelectRow;
      var onSortChange = _props2.onSortChange;
      var defaultSelectedRows = _props2.defaultSelectedRows;

      var classes = (0, _classnames2.default)('ui', { selectable: !!onSelectRow || !!defaultSelectedRows }, { sortable: !!onSortChange }, this.props.className, 'table');

      var rest = (0, _lib.getUnhandledProps)(Table, this.props);
      var ElementType = (0, _lib.getElementType)(Table, this.props);

      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, { className: classes }),
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            this._getHeaders()
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          this._getRows()
        )
      );
    }
  }], [{
    key: 'getSafeCellContents',
    value: function getSafeCellContents(content) {
      // React cannot render objects, stringify them instead
      return (0, _isObject3.default)(content) ? JSON.stringify(content) : content;
    }
  }]);

  return Table;
}(_react.Component);

Table.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  children: _lib.customPropTypes.ofComponentTypes(['TableColumn']),
  className: _react.PropTypes.string,
  data: _react.PropTypes.array,
  defaultSelectedRows: _react.PropTypes.arrayOf(_react.PropTypes.number),
  onSelectRow: _react.PropTypes.func,
  onSortChange: _react.PropTypes.func,
  sort: _react.PropTypes.shape({
    key: _react.PropTypes.string,
    direction: _react.PropTypes.oneOf(['descending', 'ascending'])
  })
};
Table.defaultProps = {
  as: 'table',
  sort: {
    key: null,
    direction: 'descending'
  }
};
Table.Column = _TableColumn2.default;
Table._meta = {
  name: 'Table',
  type: _lib.META.TYPES.COLLECTION
};
exports.default = Table;