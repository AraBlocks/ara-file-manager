const { JSDOM } = require('jsdom')
const test = require('ava')

const { window } = new JSDOM(`<!DOCTYPE html><div id="root"></div>`)
global.window = window
global.document = window.document
const html = require('nanohtml')

const Tooltip = require('../../../browser/components/dynamicTooltip')

const root = document.getElementById('root')

let counter
let tooltip
test.beforeEach(t => {
  tooltip = null
  counter = 0
})

test.afterEach(t => {
  root.removeChild(root.firstChild)
})

test('Should render beforeText', t => {
  tooltip = new Tooltip({})
  root.appendChild(tooltip.render())
  const [div] = document.getElementsByClassName('tooltipText')
  t.true(div.textContent.trim() === 'Copy to Clipboard')
})

test('Clicking should render afterText', t => {
  tooltip = new Tooltip
  root.appendChild(tooltip.render())
  const [div] = document.getElementsByClassName('tooltipText')
  div.click()
  t.true(div.textContent.trim() === 'Copied!')
})

test('Should render children', t => {
  tooltip = new Tooltip({ children: html`<div class="foo"></div>`})
  root.appendChild(tooltip.render())
  t.truthy(document.getElementsByClassName('foo')[0])
})

test('Should fire onclick', t => {
  tooltip = new Tooltip({ itemClicked: () => counter++ })
  root.appendChild(tooltip.render())
  root.firstChild.click()
  t.true(counter === 1)

  const [div] = document.getElementsByClassName('tooltipText')
  t.true(div.textContent.trim() === 'Copied!')
})