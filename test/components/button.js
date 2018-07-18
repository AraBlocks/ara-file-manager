'use strict'

const test = require('ava')
// const Button = require('../../browser/components/button')
const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
test('Listener callbacks work', t => {
  let clicked
  let mouseOvered
  let mouseOuted
  new Nanocomponent
  const onclick = () => clicked = true
  const onmouseover = () => mouseOvered = true
  const onmouseout = () => mouseOuted = true

  // const button = new Button({ onclick, onmouseout, onmouseover })
  // button.createElement = () => html`<div></div>`
  // new Nanocomponent()
  // button.onclick()
  // button.onmouseout()
  // button.onmouseover()

  t.is(onclick, true, 'onclick should fire')
  t.is(onmouseout, true, 'onmouseout should fire')
  t.is(onmouseover, true, 'onmouseover should fire')
})