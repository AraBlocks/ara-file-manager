const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const html = require('nanohtml')

const TabItem = require('../../../browser/components/tabItem')

let root = document.getElementById('root')

let tabItem
let counter
test.beforeEach(t => {
  tabItem = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render children', t => {
  const tabItem = new TabItem({ children: html`<div class="foo"></div>`})
  root.appendChild(tabItem.render())
  t.truthy(document.getElementsByClassName('foo')[0])
})

test('Should fire onclick', t => {
  const tabItem = new TabItem({ selectTab: () => counter++ })
  root.appendChild(tabItem.render())
  root.firstChild.click()
  t.true(counter === 1)
})

