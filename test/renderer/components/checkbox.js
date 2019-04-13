const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document

const Checkbox = require('../../../browser/components/checkbox')

let checkbox
let counter
test.beforeEach(t => {
  checkbox = null
  counter = 0
})

test.afterEach(t => {
  document.getElementById('root')
    .removeChild(document.getElementById('root')
    .getElementsByTagName('div')[0])
})

test('Should render checked properly', t => {
  checkbox = new Checkbox()
  document.getElementById('root').appendChild(checkbox.render())
  t.true(document.getElementById('root').firstChild.textContent.trim() === '')
  checkbox.render({ checked: true })
  t.true(document.getElementById('root').firstChild.textContent.trim() === '✓')
})

test('Should fire onclick', t => {
  checkbox = new Checkbox({ onCheck: () => counter++ })
  document.getElementById('root').appendChild(checkbox.render())
  document.getElementById('root').firstChild.click()
  t.true(counter === 1)
})

test('Should be able to be disabled', t => {
  checkbox = new Checkbox({ disabled: true, onCheck: () => counter++ })
  document.getElementById('root').appendChild(checkbox.render())
  document.getElementById('root').firstChild.click()
  t.true(counter === 0)
})
