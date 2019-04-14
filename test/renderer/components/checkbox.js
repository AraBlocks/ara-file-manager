const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Checkbox = require('../../../browser/components/checkbox')

const root = document.getElementById('root')

let checkbox
let counter
test.beforeEach(t => {
  checkbox = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render checked properly', t => {
  checkbox = new Checkbox()
  root.appendChild(checkbox.render())
  t.true(root.firstChild.textContent.trim() === '')
  checkbox.render({ checked: true })
  t.true(root.firstChild.textContent.trim() === '✓')
})

test('Should fire onclick', t => {
  checkbox = new Checkbox({ onCheck: () => counter++ })
  root.appendChild(checkbox.render())
  root.firstChild.click()
  t.true(counter === 1)
})

test('Should be able to be disabled', t => {
  checkbox = new Checkbox({ disabled: true, onCheck: () => counter++ })
  root.appendChild(checkbox.render())
  root.firstChild.click()
  t.true(counter === 0)
})
