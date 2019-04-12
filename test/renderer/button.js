const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Button = require('../../browser/components/button')

let button
let counter
test.beforeEach(t => {
  button = null
  counter = 0
})

test.afterEach(t => {
  document.getElementById('root')
    .removeChild(document.getElementById('root')
    .getElementsByTagName('button')[0])
})

test('Should render children properly', t => {
  button = new Button({ children: 'foo' })
  document.getElementById('root').appendChild(button.render())
  t.true(document.querySelector('button').textContent.trim() === 'foo')
})

test('Should fire onclick', t => {
  button = new Button({ onclick: () => counter++ })
  document.getElementById('root').appendChild(button.render())
  document.querySelector('button').click()
  t.true(counter === 1)
})

test('Should fire mouseout', t => {
  button = new Button({ onmouseout: () => counter++ })
  document.getElementById('root').appendChild(button.render())
  const mouseoutEvent = new window.Event('mouseout')
  document.querySelector('button').dispatchEvent(mouseoutEvent)
  t.true(counter === 1)
})

test('Should fire mouseover', t => {
  button = new Button({ onmouseover: () => counter++ })
  document.getElementById('root').appendChild(button.render())
  const mouseoverEvent = new window.Event('mouseover')
  document.querySelector('button').dispatchEvent(mouseoverEvent)
  t.true(counter === 1)
})

test('Should have selected type', t => {
  button = new Button({ type: 'submit' })
  document.getElementById('root').appendChild(button.render())
  t.true(document.querySelector('button').type === 'submit')
})

test('Should update props', t => {
  button = new Button({ children: 'foo' })
  document.getElementById('root').appendChild(button.render())
  button.render({ children: 'bar' })
  t.true(document.querySelector('button').textContent.trim() === 'bar')
})
