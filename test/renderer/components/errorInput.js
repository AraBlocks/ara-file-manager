const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const ErrorInput = require('../../../browser/components/errorInput')

let root = document.getElementById('root')

let errorInput
let counter
test.beforeEach(t => {
  counter = 0
  errorInput = null
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render value', t => {
  const errorInput = new ErrorInput({ value: 'foo' })
  root.appendChild(errorInput.render())
  t.true(document.querySelector('input').value.trim() === 'foo')
})

test('Should fire oninput', t => {
  const errorInput = new ErrorInput({ oninput: () => counter++ })
  root.appendChild(errorInput.render())
  const inputEvent = new window.Event('input')
  document.querySelector('input').dispatchEvent(inputEvent)
  t.true(counter === 1)
})

test('Should fire onchange', t => {
  const errorInput = new ErrorInput({ onchange: () => counter++ })
  root.appendChild(errorInput.render())
  const changeEvent = new window.Event('change')
  document.querySelector('input').dispatchEvent(changeEvent)
  t.true(counter === 1)
})

test('Should be able to disable', t => {
  const errorInput = new ErrorInput({ disabled: true, onchange: () => counter++ })
  root.appendChild(errorInput.render())
  const inputEvent = new window.Event('input')
  document.querySelector('input').dispatchEvent(inputEvent)
  t.true(counter === 0)
})

test('Should render placeholder', t => {
  const errorInput = new ErrorInput({ placeholder: 'foo' })
  root.appendChild(errorInput.render())
  t.true(document.querySelector('input').placeholder.trim() === 'foo')
})

test('Should have selected type', t => {
  errorInput = new ErrorInput({ type: 'submit' })
  root.appendChild(errorInput.render())
  t.true(document.querySelector('input').type === 'submit')
})

test('Should render error message', t => {
  errorInput = new ErrorInput({ errorMessage: 'foo' })
  root.appendChild(errorInput.render())
  const [div] = document.getElementsByClassName('ErrorInput-errorMsg')
  t.true(div.textContent === 'foo')
})