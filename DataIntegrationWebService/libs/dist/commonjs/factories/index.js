'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLabel = exports.createImg = exports.createImage = exports.createIcon = undefined;

var _createFactory = require('./createFactory');

var _createFactory2 = _interopRequireDefault(_createFactory);

var _Icon = require('../elements/Icon/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Image = require('../elements/Image/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Label = require('../elements/Label/Label');

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an Icon element from an icon name, ReactElement, or props object.
 * @type {function}
 * @param {string|ReactElement|object} val The value to render.
 * @param {object} [props = {}] Optional additional props.
 * @returns {ReactElement|undefined}
 */
var createIcon = exports.createIcon = (0, _createFactory2.default)(_Icon2.default, function (value) {
  return { name: value };
});

/**
 * Returns an Image element from an img src, ReactElement, or props object.
 * @type {function}
 * @param {string|ReactElement|object} val The value to render.
 * @param {object} [props = {}] Optional additional props.
 * @returns {ReactElement|undefined}
 */
var createImage = exports.createImage = (0, _createFactory2.default)(_Image2.default, function (value) {
  return { src: value };
});

/**
 * Returns an img element from an img src, ReactElement, or props object.
 * @type {function}
 * @param {string|ReactElement|object} val The value to render.
 * @param {object} [props = {}] Optional additional props.
 * @returns {ReactElement|undefined}
 */
var createImg = exports.createImg = (0, _createFactory2.default)('img', function (value) {
  return { src: value };
});

/**
 * Returns a Label element from label text, ReactElement, or props object.
 * @type {function}
 * @param {string|ReactElement|object} val The value to render.
 * @param {object} [props = {}] Optional additional props.
 * @returns {ReactElement|undefined}
 */
var createLabel = exports.createLabel = (0, _createFactory2.default)(_Label2.default, function (value) {
  return { content: value };
});