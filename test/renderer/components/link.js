const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Link = require('../../../browser/components/link')

let root = document.getElementById('root')

let link
let counter
test.beforeEach(t => {
  link = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render children properly', t => {
  link = new Link({ children: 'foo' })
  root.appendChild(link.render())
  t.true(root.firstChild.textContent.trim() === 'foo')
})

test('Should fire onclick', t => {
  link = new Link({ onclick: () => counter++ })
  root.appendChild(link.render())
  root.firstChild.click()
  t.true(counter === 1)
})

test('Should fire mouseout', t => {
  link = new Link({ onmouseout: () => counter++ })
  root.appendChild(link.render())
  const mouseoutEvent = new window.Event('mouseout')
  root.firstChild.dispatchEvent(mouseoutEvent)
  t.true(counter === 1)
})

test('Should fire mouseover', t => {
  link = new Link({ onmouseover: () => counter++ })
  root.appendChild(link.render())
  const mouseoverEvent = new window.Event('mouseover')
  root.firstChild.dispatchEvent(mouseoverEvent)
  t.true(counter === 1)
})

test('Should have selected type', t => {
  link = new Link({ type: 'submit' })
  root.appendChild(link.render())
  t.true(root.firstChild.type === 'submit')
})

test('Should update props', t => {
  link = new Link({ children: 'foo' })
  root.appendChild(link.render())
  link.render({ children: 'bar' })
  t.true(root.firstChild.textContent.trim() === 'bar')
})
