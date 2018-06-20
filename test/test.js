'use strict'

const Application = require('spectron').Application
const test = require('ava')
const electronPath = require('electron')
const path = require('path')

test.beforeEach(t => {
  t.context.app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..', 'boot', 'main.js')]
  })

  return t.context.app.start()
})

test('Routing from home to confirm view', async t => {
  let text
  const app = t.context.app
  await app.client.waitUntilWindowLoaded()
  text = await app.client.getHTML('div')
  t.is(text[0].includes('Welcome to ARA Mananger'), true, 'Should be at home view upon app initiation')

  require('../mockDapp')
  text = await app.client.getHTML('table')
  t.is(!!text, true, 'Should be at confirm view when socket pinged')

  const url = await app.client.getUrl()
  t.log(url)
  return t.context.app.stop()
})