const { Application } = require('spectron')
const electronPath = require('electron')
const path = require('path')

const test = require('ava')

test.beforeEach(async (t) => {
  t.context.app = new Application({
    path: electronPath,
    args: [path.join(__dirname, 'main.js')]
  })
  return await t.context.app.start()
})

test.afterEach(async (t) => {
  return await t.context.app.stop()
})

test('Should render an input', async (t) => {
  t.truthy((await t.context.app.client.$('input')).value)
})