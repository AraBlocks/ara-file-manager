'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var kDefaultIDSeed = exports.kDefaultIDSeed = 0xf;
var kDefaultIDPrefix = exports.kDefaultIDPrefix = 'ls-';

/**
 * Generates a random string suitable for usage as
 * a component ID.
 *
 * @public
 * @param {Number} seed
 * @param {String} prefix
 * @return {String}
 */

var id = exports.id = function id(seed, prefix) {
  var hex = function hex(b) {
    return b.toString('16');
  };
  var buf = [];

  if (null == seed) {
    seed = kDefaultIDSeed;
  }

  if (null == prefix) {
    prefix = kDefaultIDPrefix;
  }

  seed = parseInt(seed);
  prefix = String(prefix);

  buf.push(prefix);
  buf.push(hex(seed * Math.random() << 0xf));
  buf.push(hex(seed * Math.random() & 0xff));
  return buf.join('');
}