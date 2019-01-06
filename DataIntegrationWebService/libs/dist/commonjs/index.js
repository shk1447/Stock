'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Heads Up!
//
// Do not replace this with `export * from '...'` syntax.
// We need to export an object here for browser builds.
// Otherwise, we end up with every component on the window.


var _addons = require('./addons');

var addons = _interopRequireWildcard(_addons);

var _collections = require('./collections');

var collections = _interopRequireWildcard(_collections);

var _elements = require('./elements');

var elements = _interopRequireWildcard(_elements);

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

var _views = require('./views');

var views = _interopRequireWildcard(_views);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = _extends({}, addons, collections, elements, modules, views);