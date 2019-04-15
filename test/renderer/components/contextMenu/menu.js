const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Menu = require('../../../../browser/components/contextMenu/menu')

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

test('mouseleave event should fire closeContextMenu', t => {
  menu = new Menu({ closeContextMenu: () => counter++ })
  root.appendChild(menu.render())
  const mouseLeaveEvent = new window.Event('mouseleave')
  root.firstChild.dispatchEvent(mouseLeaveEvent)
  t.true(counter === 1)
})

test('Should be rendered when visibility === true', t => {
  menu = new Menu()
  root.appendChild(menu.render())
  t.true(window.getComputedStyle(document.getElementsByClassName('ContextMenu-container')[0]).display === 'none')
  menu.render({ visible: true })
  t.false(window.getComputedStyle(document.getElementsByClassName('ContextMenu-container')[0]).display === 'none')
})

test('Should update items', t => {
  menu = new Menu({ items: ['foo', 'bar'] })
  root.appendChild(menu.render())
  menu.render({ items: ['foobar'] })
  t.true(document.getElementsByClassName('MenuItem-container').length === 1)
})
