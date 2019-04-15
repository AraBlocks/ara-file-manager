const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Menu = require('../../../../browser/components/hamburger/menu')

let root = document.getElementById('root')

let menu
let counter
test.beforeEach(t => {
  menu = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render correct numbers of menu items', t => {
  menu = new Menu({ items: ['foo', 'bar'] })
  root.appendChild(menu.render())
  t.true(document.getElementsByClassName('MenuItem-container').length === 2)
})

test('click event should fire toggleCB', t => {
  menu = new Menu({ toggleCB: () => counter++ })
  root.appendChild(menu.render())
  root.firstChild.click()
  t.true(counter === 1)
})

test('click event should display menu', t => {
  menu = new Menu
  root.appendChild(menu.render())
  t.true(window.getComputedStyle(document.getElementsByClassName('Menu-menu')[0]).display === 'none')
  root.firstChild.click()
  t.false(window.getComputedStyle(document.getElementsByClassName('Menu-menu')[0]).display === 'none')
})

test('mouseleave event should set display to none', t => {
  menu = new Menu
  root.appendChild(menu.render())
  root.firstChild.click()
  const [menuMenu] = document.getElementsByClassName('Menu-menu')
  t.false(window.getComputedStyle(menuMenu).display === 'none')
  root.firstChild.dispatchEvent(new window.Event('mouseleave'))
  t.true(window.getComputedStyle(menuMenu).display === 'none')
})

test('Should update items', t => {
  menu = new Menu({ items: ['foo', 'bar'] })
  root.appendChild(menu.render())
  menu.render({ items: ['foobar'] })
  t.true(document.getElementsByClassName('MenuItem-container').length === 1)
})
