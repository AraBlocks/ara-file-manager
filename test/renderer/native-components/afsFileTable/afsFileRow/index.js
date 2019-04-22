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
  await new Promise(_ => setTimeout(_, 10000))
  return await t.context.app.stop()
})

test('Should render n table rows', async (t) => {
  t.true((await t.context.app.client.$$('tr')).length === 2)
})

test('fileRowClicked shouldnt fire when isFile === true', async (t) => {
  await t.context.app.client.click('//tr[1]')
  const count = await t.context.app.client.$('#counter').getText()
  t.true(count == 0)
})

test('fileRowClicked should fire when isFile === false', async (t) => {
  await t.context.app.client.click('//tr[2]')
  const count = await t.context.app.client.$('#counter').getText()
  t.true(count == 1)
})

test('should render file image when isFile === true', async (t) => {
  const { value: { ELEMENT } } = await (t.context.app.client.$('//img[contains(@src, "file")]'))
  t.true(ELEMENT === (await t.context.app.client.$$('img'))[0].value.ELEMENT)
})

test('Should render folder image when isFile === false', async (t) => {
  const { value: { ELEMENT } } = await (t.context.app.client.$('//img[contains(@src, "folder")]'))
  t.true(ELEMENT === (await t.context.app.client.$$('img'))[1].value.ELEMENT)
})

test('Should render size', async (t) => {
  const text = await t.context.app.client.$('//td[3]').getText()
  t.true(text === '2.93 KB')
})

test('Should render file type', async (t) => {
  const text = await t.context.app.client.$('//td[2]').getText()
  t.true(text.includes('JPEG'))
})

test('Should render file name', async (t) => {
  const text = await t.context.app.client.$('//td[1]').getText()
  t.true(text.includes('foo'))
})