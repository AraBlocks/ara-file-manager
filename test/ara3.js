'use strict'

const Ara3 = require('../lib/ethereum/ara3')
const { privateKey, publicAddress } = require('../lib/ethereum/account')
const test = require('ava')

let ara3
test.beforeEach(t => {
  ara3 = new Ara3({ privateKey, publicAddress})
});

test('makePurchase method', async t => {
  const tx = await ara3.makePurchase('5')
  t.is(typeof tx, 'object', 'Call to makepurchase should return object')
})