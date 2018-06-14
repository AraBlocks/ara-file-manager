'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = undefined;

var _utils = require('./index.js');

var _id = require('./id');

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _md5Hex = require('md5-hex');

var _md5Hex2 = _interopRequireDefault(_md5Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleSheetCache = {};
var kCSSStyleElement = document.createElement('style');
var kCSSStyleElementID = (0, _id.id)();
var kPrefixSeed = (0, _id.id)();

/**
 * Takes string of css and creates style attribute
 * and appends to head of DOM
 *
 * @public
 * @const
 * @param {String} src CSS source string
 * @return {String} CSS class name
 */

var css = exports.css = function css(src) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var style = kCSSStyleElement;

  if (Array.isArray(src)) {
    // template string
    if (src.raw) {
      src = (0, _utils.joinTemplateStringInterpolants)(src, args);
    } else {
      src = src.join('');
    }
  } else {
    src = String(src);
  }

  // generate a a unique `className` for this css source
  // based on the source string input
  var className = kPrefixSeed + (0, _md5Hex2.default)(src);

  // return className if already cached
  if (styleSheetCache[className]) {
    return className;
  }

  styleSheetCache[className] = src;

  // strip potential utf-8 bom if css was read from a file
  // from https://github.com/substack/insert-css/blob/master/index.js#L39
  if (0xfeff == src.charCodeAt(0)) {
    src = src.substr(1, src.length);
  }

  src = src.replace(/:host/g, '.' + className);
  src = src.replace(/^\s+(\.[a-z])+/g, '$1');
  src = src.replace(/^\s+[a-z]+/g, '\s\s');
  src += '\n';

  // actually add the stylesheet
  if (style.styleSheet) {
    style.styleSheet.cssText += src;
  } else if ('textContent' in style) {
    style.textContent += src;
  } else {
    style.innerHTML += src;
  }

  style.setAttribute('type', 'text/css');
  style.setAttribute('id', kCSSStyleElementID);
  (0, _domready2.default)(function () {
    return document.head.appendChild(style);
  });
  return className;
};
