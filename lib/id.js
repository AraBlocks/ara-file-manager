const { sha1 } = require('hash.js')
const isDev = require('electron-is-dev')

function hex(x) { return x.toString('16') }
function cache(x, seed) { return cache[x+seed] }
function lookup(y) { return lookup[y] || y }

/**
 */
function create(x, seed = 0) {
  if (null == x) { return create(Math.random().toString().slice(2)) }
  if (cache(x, seed)) { return cache(x, seed) }
  const y = isDev ? x : Buffer.from(sha1().update(x).digest()).toString('hex')
  debug("id(x=%j) = %j (seed=%j)", x, y, seed)
  lookup[y] = x
  return (cache[x+seed] = y)
}

module.exports = Object.assign(create, {
  create,
  lookup,
  cache,
  id: create, // alias
})
