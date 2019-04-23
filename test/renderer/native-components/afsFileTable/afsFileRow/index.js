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

test('afsFileRow', async (t) => {
  // Should render n table rows
  t.true((await t.context.app.client.$$('tr')).length === 2)

  // fileRowClicked shouldnt fire when isFile === true
  await t.context.app.client.click('//tr[1]')
  t.true(await t.context.app.client.$('#counter').getText() == 0)

  // fileRowClicked should fire when isFile === false
  await t.context.app.client.click('//tr[2]')
  t.true(await t.context.app.client.$('#counter').getText() == 1)

  // Should render file image when isFile === true
  let { value: { ELEMENT } } = await (t.context.app.client.$('//img[contains(@src, "file")]'))
  t.true(ELEMENT === (await t.context.app.client.$$('img'))[0].value.ELEMENT);

  // Should render folder image when isFile === false
  ({ value: { ELEMENT } } = await (t.context.app.client.$('//img[contains(@src, "folder")]')))
  t.true(ELEMENT === (await t.context.app.client.$$('img'))[1].value.ELEMENT)

  // Should render size
  t.true(await t.context.app.client.$('//td[3]').getText() === '2.93 KB')

  // Should render file type
  t.true((await t.context.app.client.$('//td[2]').getText()).includes('JPEG'))

  // Should render file name
  t.true((await t.context.app.client.$('//td[1]').getText()).includes('foo'))
})