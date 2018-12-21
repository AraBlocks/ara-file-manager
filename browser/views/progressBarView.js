'use strict'

const Nanocomponent = require('nanocomponent')
const Button = require('../components/Button')
const html = require('nanohtml')

class ProgressBarView extends Nanocomponent {
  constructor() {
    super()
    this.children = {
      publishButton: new Button({
        children: [
          'Publish',
          html`
            <span class="bounce">
              <div class="dot1"></div>
              <div class="dot2"></div>
              <div class="dot3"></div>
            </span>
          `
        ],
        cssClass: { name: 'thinBorder' },
      }),
    }
  }

  update() {
    return true
  }

  createElement() {
    const { children } = this

    return html`
      <div style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
      ">
        ${children.publishButton.render({})}
      </div>
    `
  }
}

module.exports = ProgressBarView