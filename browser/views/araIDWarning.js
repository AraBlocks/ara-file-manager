'use strict'

const windowManagement = require('../lib/tools/windowManagement')
const Button = require('../components/button')
const styles = require('./modals/styles')
const { clipboard } = require('electron')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class AraIDWarning extends Nanocomponent {
  constructor({ userDID }) {
    super()

    this.state = { copied: false }
    this.props = { userDID }

    this.children = {
      copyIDButton: new Button({
        children: "Copy Identity",
        cssClass: {
          opts: { color: 'green', fontSize: '18' }
        },
        onclick: this.copyID.bind(this)
      }),
      confirmButton: new Button({
        children: "I've saved my Ara ID",
        cssClass: { name: 'thinBorder' },
        onclick: () => {
          if (!this.state.copied) { return }
          windowManagement.transitionModal('mnemonicWarning')
        }
      })
    }
  }

  copyID(e) {
    const { props, state } = this
    clipboard.writeText(props.userDID)
    const span = e.target.parentElement.children[1]

    state.copied = true
    this.rerender()

    span.style.zIndex = 1
    span.classList.add('fadeInUp')
    span.addEventListener('animationend', () => {
      span.classList.remove('fadeInUp'), false
      span.style.zIndex = -1
    })
  }

  update() {
    return true
  }

  createElement() {
    const { children, props, state } = this
    return html`
      <div class="${styles.containerLeft} modals-containerLeft">
        <div class="${styles.logo} modals-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div style="align-self: baseline;">
          <div class="${styles.title} modals-title">
            Save your identity
          </div>
        </div>
        <div class="${styles.contentHolder} modal-contentHolder">
          <div class="${styles.smallMessage({})} modal-smallMessage">
            The following string of characters is your <b>Ara ID</b>. Please <b>copy it and keep it in a safe place</b>.
          </div>
          <div class="${styles.araIDHolder} modal-araIDHolder">
            <div class="${styles.araID} modal-araID">${props.userDID.slice(-64)}</div>
          </div>
          <div class="${styles.copyItemContainer} modal-copyItemContainer" >
            <div class="${styles.clipboard} modal-clipboard">
              ${children.copyIDButton.render({})}
              <span>Copied !</span>
            </div>
            ${children.confirmButton.render({ cssClass: state.copied ? 'standard' : 'thinBorder' })}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = AraIDWarning