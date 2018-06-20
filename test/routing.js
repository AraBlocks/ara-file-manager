'use strict'

const Application = require('spectron').Application
const test = require('ava')
const electronPath = require('electron')
const path = require('path')

test.beforeEach(t => {
  t.context.app = new Application({
    path: electronPath,
    args: ['boot/main.js']
  })

  return t.context.app.start()
})

test('Routing from home to confirm view', async t => {
  let text
  let url
  const app = t.context.app
  await app.client.waitUntilWindowLoaded()

  url = await app.client.getUrl()
  t.is(!url.includes('#'), true, 'Should be at home view upon app initiation')

  require('../mockDapp')
  await new Promise(resolve => setTimeout(resolve, 1000))
  url = await app.client.getUrl()
  t.is(url.includes('confirm'), true, 'Should be at confirm view when socket is pinged')

  return t.context.app.stop()
})