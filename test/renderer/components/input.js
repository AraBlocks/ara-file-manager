const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Input = require('../../../browser/components/input')

let root = document.getElementById('root')

let input
let counter
test.beforeEach(t => {
  counter = 0
  input = null
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render value', t => {
  const input = new Input({ value: 'foo' })
  root.appendChild(input.render())
  t.true(document.querySelector('input').value.trim() === 'foo')
})

test('Should fire oninput', t => {
  const input = new Input({ oninput: () => counter++ })
  root.appendChild(input.render())
  const inputEvent = new window.Event('input')
  document.querySelector('input').dispatchEvent(inputEvent)
  t.true(counter === 1)
})

test('Should fire onchange', t => {
  const input = new Input({ onchange: () => counter++ })
  root.appendChild(input.render())
  const changeEvent = new window.Event('change')
  document.querySelector('input').dispatchEvent(changeEvent)
  t.true(counter === 1)
})

test('Should be able to disable', t => {
  const input = new Input({ disabled: true, onchange: () => counter++ })
  root.appendChild(input.render())
  const inputEvent = new window.Event('input')
  document.querySelector('input').dispatchEvent(inputEvent)
  t.true(counter === 0)
})

test('Should render placeholder', t => {
  const input = new Input({ placeholder: 'foo' })
  root.appendChild(input.render())
  t.true(document.querySelector('input').placeholder.trim() === 'foo')
})

test('Should have selected type', t => {
  input = new Input({ type: 'submit' })
  root.appendChild(input.render())
  t.true(document.querySelector('input').type === 'submit')
})