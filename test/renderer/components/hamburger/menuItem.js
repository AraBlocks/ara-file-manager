const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const MenuItem = require('../../../../browser/components/hamburger/menuItem')

let root = document.getElementById('root')

let menuItem
let counter
test.beforeEach(t => {
  menuItem = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render children properly', t => {
  menuItem = new MenuItem({ children: 'foo' })
  root.appendChild(menuItem.render())
  t.true(root.firstChild.textContent.trim() === 'foo')
})

test('Should fire onclick', t => {
  menuItem = new MenuItem({ onclick: () => counter++ })
  root.appendChild(menuItem.render())
  root.firstChild.click()
  t.true(counter === 1)
})

test('Should render onclickText', t => {
  menuItem = new MenuItem({ onclickText: 'foo' })
  root.appendChild(menuItem.render())
  t.true(root.firstChild.textContent.trim() === '')
  root.firstChild.click()
  t.true(root.firstChild.textContent.trim() === 'foo')
})