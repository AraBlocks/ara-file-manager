;

/**
 * Module dependencies.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isArray = Array.isArray;

/**
 * Flattens a nested array x.
 *
 * @public
 * @function
 * @param {Array<...Mixed>} x
 * @return {Array}
 */

var flatten = exports.flatten = function flatten(x) {
  return x.reduce(function (a, b) {
    return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
  }, []);
};

/**
 * Promisify a callback with given resolve
 * and reject functions.
 *
 * @public
 * @function
 * @param {Function} resolve
 * @param {Function} reject
 */

var promisify = exports.promisify = function promisify(resolve, reject) {
  return function (err, res) {
    err ? reject(err) : resolve(res);
  };
};

/**
 * Joins a template string parts array with indexed interpolants.
 *
 * @public
 * @param {Array<String>} parts
 * @param {Array<Mixed>} interpolants
 * @return {String}
 */

var joinTemplateStringInterpolants = exports.joinTemplateStringInterpolants = function joinTemplateStringInterpolants(parts, interpolants) {
  var buf = [];

  if (false == (Array.isArray(parts) || Array.isArray(interpolants))) {
    return '';
  }

  for (var i = 0; i < parts.length; ++i) {
    if (interpolants[i - 1]) {
      buf.push(interpolants[i - 1]);
    }
    buf.push(parts[i]);
  }
  return buf.join('');
};