'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compact2 = require('lodash/compact');

var _compact3 = _interopRequireDefault(_compact2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _every2 = require('lodash/every');

var _every3 = _interopRequireDefault(_every2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _findIndex2 = require('lodash/findIndex');

var _findIndex3 = _interopRequireDefault(_findIndex2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _escapeRegExp2 = require('lodash/escapeRegExp');

var _escapeRegExp3 = _interopRequireDefault(_escapeRegExp2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _dropRight2 = require('lodash/dropRight');

var _dropRight3 = _interopRequireDefault(_dropRight2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _get3 = require('lodash/get');

var _get4 = _interopRequireDefault(_get3);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _factories = require('../../factories');

var _elements = require('../../elements');

var _DropdownDivider = require('./DropdownDivider');

var _DropdownDivider2 = _interopRequireDefault(_DropdownDivider);

var _DropdownItem = require('./DropdownItem');

var _DropdownItem2 = _interopRequireDefault(_DropdownItem);

var _DropdownHeader = require('./DropdownHeader');

var _DropdownHeader2 = _interopRequireDefault(_DropdownHeader);

var _DropdownMenu = require('./DropdownMenu');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _lib.makeDebugger)('dropdown');

var _meta = {
  name: 'Dropdown',
  type: _lib.META.TYPES.MODULE,
  props: {
    pointing: ['left', 'right', 'top', 'top left', 'top right', 'bottom', 'bottom left', 'bottom right'],
    additionPosition: ['top', 'bottom']
  }
};

/**
 * A dropdown allows a user to select a value from a series of options.
 * @see Form
 * @see Select
 */

var Dropdown = function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Dropdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (e, value) {
      debug('onChange()');
      debug(value);
      var onChange = _this.props.onChange;

      if (onChange) onChange(e, value);
    }, _this.closeOnEscape = function (e) {
      if (_lib.keyboardKey.getCode(e) !== _lib.keyboardKey.Escape) return;
      e.preventDefault();
      _this.close();
    }, _this.moveSelectionOnKeyDown = function (e) {
      debug('moveSelectionOnKeyDown()');
      debug(_lib.keyboardKey.getName(e));
      switch (_lib.keyboardKey.getCode(e)) {
        case _lib.keyboardKey.ArrowDown:
          e.preventDefault();
          _this.moveSelectionBy(1);
          break;
        case _lib.keyboardKey.ArrowUp:
          e.preventDefault();
          _this.moveSelectionBy(-1);
          break;
        default:
          break;
      }
    }, _this.openOnSpace = function (e) {
      debug('openOnSpace()');
      if (_lib.keyboardKey.getCode(e) !== _lib.keyboardKey.Spacebar) return;
      if (_this.state.open) return;
      e.preventDefault();
      _this.trySetState({ open: true });
    }, _this.openOnArrow = function (e) {
      var code = _lib.keyboardKey.getCode(e);
      debug('openOnArrow()');
      if (!(0, _includes3.default)([_lib.keyboardKey.ArrowDown, _lib.keyboardKey.ArrowUp], code)) return;
      if (_this.state.open) return;
      e.preventDefault();
      _this.trySetState({ open: true });
    }, _this.selectHighlightedItem = function (e) {
      var open = _this.state.open;
      var _this$props = _this.props;
      var multiple = _this$props.multiple;
      var onAddItem = _this$props.onAddItem;
      var options = _this$props.options;

      var value = (0, _get4.default)(_this.getSelectedItem(), 'value');

      // prevent selecting null if there was no selected item value
      // prevent selecting duplicate items when the dropdown is closed
      if (!value || !open) return;

      // notify the onAddItem prop if this is a new value
      if (onAddItem && !(0, _some3.default)(options, { text: value })) onAddItem(value);

      // notify the onChange prop that the user is trying to change value
      if (multiple) {
        // state value may be undefined
        var newValue = (0, _union3.default)(_this.state.value, [value]);
        _this.setValue(newValue);
        _this.onChange(e, newValue);
      } else {
        _this.setValue(value);
        _this.onChange(e, value);
        _this.close();
      }
    }, _this.selectItemOnEnter = function (e) {
      debug('selectItemOnEnter()');
      debug(_lib.keyboardKey.getName(e));
      if (_lib.keyboardKey.getCode(e) !== _lib.keyboardKey.Enter) return;
      e.preventDefault();

      _this.selectHighlightedItem(e);
    }, _this.removeItemOnBackspace = function (e) {
      debug('removeItemOnBackspace()');
      debug(_lib.keyboardKey.getName(e));
      if (_lib.keyboardKey.getCode(e) !== _lib.keyboardKey.Backspace) return;

      var _this$props2 = _this.props;
      var multiple = _this$props2.multiple;
      var search = _this$props2.search;
      var _this$state = _this.state;
      var searchQuery = _this$state.searchQuery;
      var value = _this$state.value;


      if (searchQuery || !search || !multiple || (0, _isEmpty3.default)(value)) return;

      e.preventDefault();

      // remove most recent value
      var newValue = (0, _dropRight3.default)(value);

      _this.setValue(newValue);
      _this.onChange(e, newValue);
    }, _this.closeOnDocumentClick = function (e) {
      debug('closeOnDocumentClick()');
      debug(e);
      _this.close();
    }, _this.handleMouseDown = function (e) {
      debug('handleMouseDown()');
      var onMouseDown = _this.props.onMouseDown;

      if (onMouseDown) onMouseDown(e);
      _this.isMouseDown = true;
      document.addEventListener('mouseup', _this.handleDocumentMouseUp);
    }, _this.handleDocumentMouseUp = function () {
      debug('handleDocumentMouseUp()');
      _this.isMouseDown = false;
      document.removeEventListener('mouseup', _this.handleDocumentMouseUp);
    }, _this.handleClick = function (e) {
      debug('handleClick()', e);
      var onClick = _this.props.onClick;

      if (onClick) onClick(e);
      // prevent closeOnDocumentClick()
      e.stopPropagation();
      _this.toggle();
    }, _this.handleItemClick = function (e, value) {
      debug('handleItemClick()');
      debug(value);
      var _this$props3 = _this.props;
      var multiple = _this$props3.multiple;
      var onAddItem = _this$props3.onAddItem;
      var options = _this$props3.options;

      var item = _this.getItemByValue(value) || {};

      // prevent toggle() in handleClick()
      e.stopPropagation();
      // prevent closeOnDocumentClick() if multiple or item is disabled
      if (multiple || item.disabled) {
        e.nativeEvent.stopImmediatePropagation();
      }

      if (item.disabled) return;

      // notify the onAddItem prop if this is a new value
      if (onAddItem && !(0, _some3.default)(options, { value: value })) onAddItem(value);

      // notify the onChange prop that the user is trying to change value
      if (multiple) {
        var newValue = (0, _union3.default)(_this.state.value, [value]);
        _this.setValue(newValue);
        _this.onChange(e, newValue);
      } else {
        _this.setValue(value);
        _this.onChange(e, value);
        _this.close();
      }
    }, _this.handleFocus = function (e) {
      debug('handleFocus()');
      var onFocus = _this.props.onFocus;

      if (onFocus) onFocus(e);
      _this.setState({ focus: true });
    }, _this.handleBlur = function (e) {
      debug('handleBlur()');
      var _this$props4 = _this.props;
      var multiple = _this$props4.multiple;
      var onBlur = _this$props4.onBlur;
      var selectOnBlur = _this$props4.selectOnBlur;
      // do not "blur" when the mouse is down inside of the Dropdown

      if (_this.isMouseDown) return;
      if (onBlur) onBlur(e);
      if (selectOnBlur && !multiple) _this.selectHighlightedItem(e);
      _this.setState({ focus: false });
    }, _this.handleSearchChange = function (e) {
      debug('handleSearchChange()');
      debug(e.target.value);
      // prevent propagating to this.props.onChange()
      e.stopPropagation();
      var _this$props5 = _this.props;
      var search = _this$props5.search;
      var onSearchChange = _this$props5.onSearchChange;
      var open = _this.state.open;

      var newQuery = e.target.value;

      if (onSearchChange) onSearchChange(e, newQuery);

      // open search dropdown on search query
      if (search && newQuery && !open) _this.open();

      _this.setState({
        selectedIndex: _this.getEnabledIndices()[0],
        searchQuery: newQuery
      });
    }, _this.getMenuOptions = function () {
      var value = arguments.length <= 0 || arguments[0] === undefined ? _this.state.value : arguments[0];
      var _this$props6 = _this.props;
      var multiple = _this$props6.multiple;
      var search = _this$props6.search;
      var allowAdditions = _this$props6.allowAdditions;
      var additionPosition = _this$props6.additionPosition;
      var additionLabel = _this$props6.additionLabel;
      var options = _this$props6.options;
      var searchQuery = _this.state.searchQuery;


      var filteredOptions = options;

      // filter out active options
      if (multiple) {
        filteredOptions = (0, _filter3.default)(filteredOptions, function (opt) {
          return !(0, _includes3.default)(value, opt.value);
        });
      }

      // filter by search query
      if (search && searchQuery) {
        if ((0, _isFunction3.default)(search)) {
          filteredOptions = search(filteredOptions, searchQuery);
        } else {
          (function () {
            var re = new RegExp((0, _escapeRegExp3.default)(searchQuery), 'i');
            filteredOptions = (0, _filter3.default)(filteredOptions, function (opt) {
              return re.test(opt.text);
            });
          })();
        }
      }

      // insert the "add" item
      if (allowAdditions && search && searchQuery && !(0, _some3.default)(filteredOptions, { text: searchQuery })) {
        var addItem = {
          text: additionLabel ? additionLabel + ' ' + searchQuery : searchQuery,
          value: searchQuery
        };
        if (additionPosition === 'top') filteredOptions.unshift(addItem);else filteredOptions.push(addItem);
      }

      return filteredOptions;
    }, _this.getSelectedItem = function () {
      var selectedIndex = _this.state.selectedIndex;

      var options = _this.getMenuOptions();

      return (0, _get4.default)(options, '[' + selectedIndex + ']');
    }, _this.getEnabledIndices = function (givenOptions) {
      var options = givenOptions || _this.getMenuOptions();

      return (0, _reduce3.default)(options, function (memo, item, index) {
        if (!item.disabled) memo.push(index);
        return memo;
      }, []);
    }, _this.getItemByValue = function (value) {
      var options = _this.props.options;

      return (0, _find3.default)(options, { value: value });
    }, _this.getMenuItemIndexByValue = function (value) {
      var options = _this.getMenuOptions();

      return (0, _findIndex3.default)(options, ['value', value]);
    }, _this.setValue = function (value) {
      debug('setValue()');
      debug('value', value);
      var multiple = _this.props.multiple;
      var selectedIndex = _this.state.selectedIndex;

      var options = _this.getMenuOptions(value);
      var enabledIndicies = _this.getEnabledIndices(options);
      var newState = {
        searchQuery: ''
      };

      // update the selected index
      if (!selectedIndex) {
        var firstIndex = enabledIndicies[0];

        // Select the currently active item, if none, use the first item.
        // Multiple selects remove active items from the list,
        // their initial selected index should be 0.
        newState.selectedIndex = multiple ? firstIndex : _this.getMenuItemIndexByValue(value || (0, _get4.default)(options, '[' + firstIndex + '].value'));
      } else if (multiple) {
        // multiple selects remove options from the menu as they are made active
        // keep the selected index within range of the remaining items
        if (selectedIndex >= options.length - 1) {
          newState.selectedIndex = enabledIndicies[enabledIndicies.length - 1];
        }
      } else {
        var activeIndex = _this.getMenuItemIndexByValue(value);

        // regular selects can only have one active item
        // set the selected index to the currently active item
        newState.selectedIndex = (0, _includes3.default)(enabledIndicies, activeIndex) ? activeIndex : undefined;
      }

      _this.trySetState({ value: value }, newState);
    }, _this.handleLabelRemove = function (e, labelProps) {
      debug('handleLabelRemove()');
      // prevent focusing search input on click
      e.stopPropagation();
      var value = _this.state.value;

      var newValue = (0, _without3.default)(value, labelProps.value);
      debug('label props:', labelProps);
      debug('current value:', value);
      debug('remove value:', labelProps.value);
      debug('new value:', newValue);

      _this.setValue(newValue);
      _this.onChange(e, newValue);
    }, _this.moveSelectionBy = function (offset) {
      var startIndex = arguments.length <= 1 || arguments[1] === undefined ? _this.state.selectedIndex : arguments[1];

      debug('moveSelectionBy()');
      debug('offset: ' + offset);

      var options = _this.getMenuOptions();
      var lastIndex = options.length - 1;

      // Prevent infinite loop
      if ((0, _every3.default)(options, 'disabled')) return;

      // next is after last, wrap to beginning
      // next is before first, wrap to end
      var nextIndex = startIndex + offset;
      if (nextIndex > lastIndex) nextIndex = 0;else if (nextIndex < 0) nextIndex = lastIndex;

      if (options[nextIndex].disabled) return _this.moveSelectionBy(offset, nextIndex);

      _this.setState({ selectedIndex: nextIndex });
      _this.scrollSelectedItemIntoView();
    }, _this.scrollSelectedItemIntoView = function () {
      debug('scrollSelectedItemIntoView()');
      var menu = document.querySelector('.ui.dropdown.active.visible .menu.visible');
      var item = menu.querySelector('.item.selected');
      debug('menu: ' + menu);
      debug('item: ' + item);
      var isOutOfUpperView = item.offsetTop < menu.scrollTop;
      var isOutOfLowerView = item.offsetTop + item.clientHeight > menu.scrollTop + menu.clientHeight;

      if (isOutOfUpperView || isOutOfLowerView) {
        menu.scrollTop = item.offsetTop;
      }
    }, _this.open = function () {
      debug('open()');
      var search = _this.props.search;

      if (search) _this._search.focus();

      _this.trySetState({ open: true });
    }, _this.close = function () {
      debug('close()');
      _this.trySetState({ open: false });
    }, _this.toggle = function () {
      return _this.state.open ? _this.close() : _this.open();
    }, _this.renderText = function () {
      var _this$props7 = _this.props;
      var multiple = _this$props7.multiple;
      var placeholder = _this$props7.placeholder;
      var search = _this$props7.search;
      var text = _this$props7.text;
      var _this$state2 = _this.state;
      var searchQuery = _this$state2.searchQuery;
      var value = _this$state2.value;
      var open = _this$state2.open;

      var hasValue = multiple ? !(0, _isEmpty3.default)(value) : !!value;

      var classes = (0, _classnames2.default)(placeholder && !hasValue && 'default', 'text', search && searchQuery && 'filtered');
      var _text = placeholder;
      if (searchQuery) {
        _text = null;
      } else if (text) {
        _text = text;
      } else if (open && !multiple) {
        _text = (0, _get4.default)(_this.getSelectedItem(), 'text');
      } else if (hasValue) {
        _text = (0, _get4.default)(_this.getItemByValue(value), 'text');
      }

      return _react2.default.createElement(
        'div',
        { className: classes },
        _text
      );
    }, _this.renderHiddenInput = function () {
      debug('renderHiddenInput()');
      var value = _this.state.value;
      var _this$props8 = _this.props;
      var multiple = _this$props8.multiple;
      var name = _this$props8.name;
      var options = _this$props8.options;
      var selection = _this$props8.selection;

      debug('name:      ' + name);
      debug('selection: ' + selection);
      debug('value:     ' + value);
      if (!selection) return null;

      return _react2.default.createElement(
        'select',
        { type: 'hidden', name: name, value: value, multiple: multiple },
        (0, _map3.default)(options, function (option) {
          return _react2.default.createElement(
            'option',
            { key: option.value, value: option.value },
            option.text
          );
        })
      );
    }, _this.renderSearchInput = function () {
      var _this$props9 = _this.props;
      var search = _this$props9.search;
      var name = _this$props9.name;
      var searchQuery = _this.state.searchQuery;


      if (!search) return null;

      // resize the search input, temporarily show the sizer so we can measure it
      var searchWidth = void 0;
      if (_this._sizer && searchQuery) {
        _this._sizer.style.display = 'inline';
        _this._sizer.textContent = searchQuery;
        searchWidth = Math.ceil(_this._sizer.getBoundingClientRect().width);
        _this._sizer.style.removeProperty('display');
      }

      return _react2.default.createElement('input', {
        value: searchQuery,
        onChange: _this.handleSearchChange,
        className: 'search',
        name: [name, 'search'].join('-'),
        autoComplete: 'off',
        tabIndex: '0',
        style: { width: searchWidth },
        ref: function ref(c) {
          return _this._search = c;
        }
      });
    }, _this.renderSearchSizer = function () {
      var _this$props10 = _this.props;
      var search = _this$props10.search;
      var multiple = _this$props10.multiple;


      if (!(search && multiple)) return null;

      return _react2.default.createElement('span', { className: 'sizer', ref: function ref(c) {
          return _this._sizer = c;
        } });
    }, _this.renderLabels = function () {
      debug('renderLabels()');
      var multiple = _this.props.multiple;
      var value = _this.state.value;

      if (!multiple || (0, _isEmpty3.default)(value)) {
        return;
      }
      var selectedItems = (0, _map3.default)(value, _this.getItemByValue);
      debug('selectedItems', selectedItems);

      // if no item could be found for a given state value the selected item will be undefined
      // compact the selectedItems so we only have actual objects left
      return (0, _map3.default)((0, _compact3.default)(selectedItems), function (item) {
        return _react2.default.createElement(_elements.Label, {
          key: item.value,
          as: 'a',
          content: item.text,
          value: item.value,
          onRemove: _this.handleLabelRemove
        });
      });
    }, _this.renderOptions = function () {
      var _this$props11 = _this.props;
      var multiple = _this$props11.multiple;
      var search = _this$props11.search;
      var noResultsMessage = _this$props11.noResultsMessage;
      var _this$state3 = _this.state;
      var selectedIndex = _this$state3.selectedIndex;
      var value = _this$state3.value;

      var options = _this.getMenuOptions();

      if (search && (0, _isEmpty3.default)(options)) {
        return _react2.default.createElement(
          'div',
          { className: 'message' },
          noResultsMessage
        );
      }

      var isActive = multiple ? function (optValue) {
        return (0, _includes3.default)(value, optValue);
      } : function (optValue) {
        return optValue === value;
      };

      return (0, _map3.default)(options, function (opt, i) {
        return _react2.default.createElement(_DropdownItem2.default, _extends({
          key: opt.value + '-' + i,
          active: isActive(opt.value),
          onClick: _this.handleItemClick,
          selected: selectedIndex === i
        }, opt, {
          // Needed for handling click events on disabled items
          style: _extends({}, opt.style, { pointerEvents: 'all' })
        }));
      });
    }, _this.renderMenu = function () {
      var _this$props12 = _this.props;
      var children = _this$props12.children;
      var header = _this$props12.header;
      var open = _this.state.open;

      var menuClasses = open ? 'visible' : '';

      // single menu child
      if (children) {
        var menuChild = _react.Children.only(children);
        var className = (0, _classnames2.default)(menuClasses, menuChild.props.className);

        return (0, _react.cloneElement)(menuChild, { className: className });
      }

      return _react2.default.createElement(
        _DropdownMenu2.default,
        { className: menuClasses },
        header && _react2.default.createElement(_DropdownHeader2.default, { content: header }),
        _this.renderOptions()
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Dropdown, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (_get2(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), 'componentWillMount', this)) _get2(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), 'componentWillMount', this).call(this);
      debug('componentWillMount()');
      var _state = this.state;
      var open = _state.open;
      var value = _state.value;


      this.setValue(value);
      if (open) this.open();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _isEqual3.default)(nextProps, this.props) || !(0, _isEqual3.default)(nextState, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      _get2(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
      debug('componentWillReceiveProps()');
      // TODO objectDiff still runs in prod, stop it
      debug('to props:', (0, _lib.objectDiff)(this.props, nextProps));

      /* eslint-disable no-console */
      if (process.env.NODE_ENV !== 'production') {
        // in development, validate value type matches dropdown type
        var isNextValueArray = Array.isArray(nextProps.value);
        var hasValue = (0, _has3.default)(nextProps, 'value');

        if (hasValue && nextProps.multiple && !isNextValueArray) {
          console.error('Dropdown `value` must be an array when `multiple` is set.' + (' Received type: `' + Object.prototype.toString.call(nextProps.value) + '`.'));
        } else if (hasValue && !nextProps.multiple && isNextValueArray) {
          console.error('Dropdown `value` must not be an array when `multiple` is not set.' + ' Either set `multiple={true}` or use a string or number value.');
        }
      }
      /* eslint-enable no-console */

      if (!(0, _isEqual3.default)(nextProps.value, this.props.value)) {
        debug('value changed, setting', nextProps.value);
        this.setValue(nextProps.value);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // eslint-disable-line complexity
      debug('componentDidUpdate()');
      // TODO objectDiff still runs in prod, stop it
      debug('to state:', (0, _lib.objectDiff)(prevState, this.state));

      // focused / blurred
      if (!prevState.focus && this.state.focus) {
        debug('dropdown focused');
        if (!this.isMouseDown) {
          debug('mouse is not down, opening');
          this.open();
        }
        if (!this.state.open) {
          document.addEventListener('keydown', this.openOnArrow);
          document.addEventListener('keydown', this.openOnSpace);
        } else {
          document.addEventListener('keydown', this.moveSelectionOnKeyDown);
          document.addEventListener('keydown', this.selectItemOnEnter);
          document.addEventListener('keydown', this.removeItemOnBackspace);
        }
      } else if (prevState.focus && !this.state.focus) {
        debug('dropdown blurred');
        if (!this.isMouseDown) {
          debug('mouse is not down, closing');
          this.close();
        }
        document.removeEventListener('keydown', this.openOnArrow);
        document.removeEventListener('keydown', this.openOnSpace);
        document.removeEventListener('keydown', this.moveSelectionOnKeyDown);
        document.removeEventListener('keydown', this.selectItemOnEnter);
        document.removeEventListener('keydown', this.removeItemOnBackspace);
      }

      // opened / closed
      if (!prevState.open && this.state.open) {
        debug('dropdown opened');
        this.open();
        document.addEventListener('keydown', this.closeOnEscape);
        document.addEventListener('keydown', this.moveSelectionOnKeyDown);
        document.addEventListener('keydown', this.selectItemOnEnter);
        document.addEventListener('keydown', this.removeItemOnBackspace);
        document.addEventListener('click', this.closeOnDocumentClick);
        document.removeEventListener('keydown', this.openOnArrow);
        document.removeEventListener('keydown', this.openOnSpace);
      } else if (prevState.open && !this.state.open) {
        debug('dropdown closed');
        this.close();
        document.removeEventListener('keydown', this.closeOnEscape);
        document.removeEventListener('keydown', this.moveSelectionOnKeyDown);
        document.removeEventListener('keydown', this.selectItemOnEnter);
        document.removeEventListener('keydown', this.removeItemOnBackspace);
        document.removeEventListener('click', this.closeOnDocumentClick);
        if (prevState.focus && this.state.focus) {
          document.addEventListener('keydown', this.openOnArrow);
          document.addEventListener('keydown', this.openOnSpace);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug('componentWillUnmount()');
      document.removeEventListener('keydown', this.openOnArrow);
      document.removeEventListener('keydown', this.openOnSpace);
      document.removeEventListener('keydown', this.moveSelectionOnKeyDown);
      document.removeEventListener('keydown', this.selectItemOnEnter);
      document.removeEventListener('keydown', this.removeItemOnBackspace);
      document.removeEventListener('keydown', this.closeOnEscape);
      document.removeEventListener('click', this.closeOnDocumentClick);
    }

    // ----------------------------------------
    // Document Event Handlers
    // ----------------------------------------

    // onChange needs to receive a value
    // can't rely on props.value if we are controlled


    // ----------------------------------------
    // Component Event Handlers
    // ----------------------------------------

    // ----------------------------------------
    // Getters
    // ----------------------------------------

    // There are times when we need to calculate the options based on a value
    // that hasn't yet been persisted to state.


    // ----------------------------------------
    // Setters
    // ----------------------------------------

    // ----------------------------------------
    // Behavior
    // ----------------------------------------

    // ----------------------------------------
    // Render
    // ----------------------------------------

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      debug('render()');
      debug('props', this.props);
      debug('state', this.state);
      var open = this.state.open;
      var _props = this.props;
      var button = _props.button;
      var className = _props.className;
      var compact = _props.compact;
      var fluid = _props.fluid;
      var floating = _props.floating;
      var icon = _props.icon;
      var inline = _props.inline;
      var labeled = _props.labeled;
      var linkItem = _props.linkItem;
      var multiple = _props.multiple;
      var pointing = _props.pointing;
      var search = _props.search;
      var selection = _props.selection;
      var simple = _props.simple;
      var loading = _props.loading;
      var error = _props.error;
      var disabled = _props.disabled;
      var scrolling = _props.scrolling;
      var trigger = _props.trigger;

      // Classes

      var classes = (0, _classnames2.default)('ui', open && 'active visible', (0, _lib.useKeyOnly)(disabled, 'disabled'), (0, _lib.useKeyOnly)(error, 'error'), (0, _lib.useKeyOnly)(loading, 'loading'), (0, _lib.useKeyOnly)(button, 'button'), (0, _lib.useKeyOnly)(compact, 'compact'), (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(floating, 'floating'), (0, _lib.useKeyOnly)(inline, 'inline'),
      // TODO: consider augmentation to render Dropdowns as Button/Menu, solves icon/link item issues
      // https://github.com/TechnologyAdvice/stardust/issues/401#issuecomment-240487229
      // TODO: the icon class is only required when a dropdown is a button
      // useKeyOnly(icon, 'icon'),
      (0, _lib.useKeyOnly)(labeled, 'labeled'),
      // TODO: linkItem is required only when Menu child, add dynamically
      (0, _lib.useKeyOnly)(linkItem, 'link item'), (0, _lib.useKeyOnly)(multiple, 'multiple'), (0, _lib.useKeyOnly)(search, 'search'), (0, _lib.useKeyOnly)(selection, 'selection'), (0, _lib.useKeyOnly)(simple, 'simple'), (0, _lib.useKeyOnly)(scrolling, 'scrolling'), (0, _lib.useKeyOrValueAndKey)(pointing, 'pointing'), className, 'dropdown');

      var rest = (0, _lib.getUnhandledProps)(Dropdown, this.props);
      var ElementType = (0, _lib.getElementType)(Dropdown, this.props);

      return _react2.default.createElement(
        ElementType,
        _extends({}, rest, {
          className: classes,
          onBlur: this.handleBlur,
          onClick: this.handleClick,
          onMouseDown: this.handleMouseDown,
          onFocus: this.handleFocus,
          onChange: this.onChange,
          tabIndex: search ? undefined : 0,
          ref: function ref(c) {
            return _this2._dropdown = c;
          }
        }),
        this.renderHiddenInput(),
        this.renderLabels(),
        this.renderSearchInput(),
        this.renderSearchSizer(),
        trigger || this.renderText(),
        (0, _factories.createIcon)(icon),
        this.renderMenu()
      );
    }
  }]);

  return Dropdown;
}(_lib.AutoControlledComponent);

Dropdown.propTypes = {
  /** An element type to render as (string or function). */
  as: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  // ------------------------------------
  // Behavior
  // ------------------------------------
  /** Add an icon by name or as a component. */
  icon: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string]),

  /** Array of Dropdown.Item props e.g. `{ text: '', value: '' }` */
  options: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _lib.customPropTypes.demand(['selection']), _react.PropTypes.arrayOf(_react.PropTypes.shape(_DropdownItem2.default.propTypes))]),

  /** Controls whether or not the dropdown menu is displayed. */
  open: _react.PropTypes.bool,

  /** Initial value of open. */
  defaultOpen: _react.PropTypes.bool,

  /** A Dropdown can contain a single <Dropdown.Menu /> child. */
  children: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['options', 'selection']), _lib.customPropTypes.demand(['text']), _lib.customPropTypes.givenProps({ children: _react.PropTypes.any.isRequired }, _react2.default.PropTypes.element.isRequired), _lib.customPropTypes.ofComponentTypes(['DropdownMenu'])]),

  /** Current value or value array if multiple. Creates a controlled component. */
  value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]))]),

  /** Initial value or value array if multiple. */
  defaultValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]))]),

  /** Placeholder text. */
  placeholder: _react.PropTypes.string,

  /** Name of the hidden input which holds the value. */
  name: _react.PropTypes.string,

  /** Custom element to trigger the menu to become visible. Takes place of 'text'. */
  trigger: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['selection', 'text']), _react.PropTypes.node]),

  /**
   * Allow user additions to the list of options (boolean).
   * Requires the use of `selection`, `options` and `search`.
   */
  allowAdditions: _lib.customPropTypes.every([_lib.customPropTypes.demand(['options', 'selection', 'search']), _react.PropTypes.bool]),

  /** Called with the new value added by the user. Use this to update the options list. */
  onAddItem: _react.PropTypes.func,

  /** Position of the `Add: ...` option in the dropdown list ('top' or 'bottom'). */
  additionPosition: _react.PropTypes.oneOf(_meta.props.additionPosition),

  /** Label prefixed to an option added by a user. */
  additionLabel: _react.PropTypes.string,

  /** Message to display when there are no results. */
  noResultsMessage: _react.PropTypes.string,

  /** Define whether the highlighted item should be selected on blur. */
  selectOnBlur: _react.PropTypes.bool,

  /** Make the dropdown options searchable by substring matching (default) or with a custom search function. */
  search: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func]),

  // ------------------------------------
  // Callbacks
  // ------------------------------------

  /** Called with the React Synthetic Event on Dropdown blur. */
  onBlur: _react.PropTypes.func,

  /** Called with the React Synthetic Event and current value on change. */
  onChange: _react.PropTypes.func,

  /** Called with the React Synthetic Event and current value on search input change. */
  onSearchChange: _react.PropTypes.func,

  /** Called with the React Synthetic Event on Dropdown click. */
  onClick: _react.PropTypes.func,

  /** Called with the React Synthetic Event on Dropdown focus. */
  onFocus: _react.PropTypes.func,

  /** Called with the React Synthetic Event on Dropdown mouse down. */
  onMouseDown: _react.PropTypes.func,

  // ------------------------------------
  // Style
  // ------------------------------------

  /** Format the Dropdown to appear as a button. */
  button: _react.PropTypes.bool,

  /** Additional classes added to the root element. */
  className: _react.PropTypes.string,

  /** Format the dropdown to only take up as much width as needed. */
  compact: _react.PropTypes.bool,

  /** Format the dropdown to only take up as much width as possible. */
  fluid: _react.PropTypes.bool,

  /** Display the menu as detached from the Dropdown. */
  floating: _react.PropTypes.bool,

  /** A dropdown menu can contain a header. */
  header: _react.PropTypes.node,

  inline: _react.PropTypes.bool,
  labeled: _react.PropTypes.bool,
  linkItem: _react.PropTypes.bool,

  /** Allow selecting multiple options. */
  multiple: _react.PropTypes.bool,

  /** Use a detached menu that is pointing to the Dropdown. */
  pointing: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(_meta.props.pointing)]),

  /** The text displayed in the dropdown, usually for the active item. */
  text: _react.PropTypes.string,

  // TODO 'searchInMenu' or 'search='in menu' or ???  How to handle this markup and functionality?

  /** Behave as an html select. */
  selection: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _lib.customPropTypes.demand(['options']), _react.PropTypes.bool]),
  simple: _react.PropTypes.bool,

  loading: _react.PropTypes.bool,
  error: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,

  scrolling: _react.PropTypes.bool
};
Dropdown.defaultProps = {
  icon: 'dropdown',
  additionLabel: 'Add:',
  noResultsMessage: 'No results found.',
  selectOnBlur: true
};
Dropdown.autoControlledProps = ['open', 'value'];
Dropdown._meta = _meta;
Dropdown.Divider = _DropdownDivider2.default;
Dropdown.Header = _DropdownHeader2.default;
Dropdown.Item = _DropdownItem2.default;
Dropdown.Menu = _DropdownMenu2.default;
exports.default = Dropdown;