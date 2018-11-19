'use strict'

const windowManagement = require('../lib/tools/windowManagement')
const Button = require('../components/button')
const styles = require('./modals/styles')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { clipboard, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

class MnemonicWarning extends Nanocomponent {
  constructor({ mnemonic }) {
    super()

    this.props = { mnemonic }
    this.state = { copied: false }

    this.children = {
      copyMnemonicButton: new Button({
        children: "Copy Mnemonic",
        cssClass: {
          opts: { color: 'green', fontSize: '10px' }
        },
        onclick: this.copyMnemonic.bind(this)
      }),

      confirmButton: new Button({
        children: "I've saved my mnemonic",
        cssClass: { name: 'thinBorder' },
        onclick: () => {
          windowManager.openWindow('filemanager')
          windowManagement.closeModal('mnemonicWarning')
        }
      })
    }
  }

  copyMnemonic(e) {
    const { props, state } = this
    clipboard.writeText(props.mnemonic)
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
    const { mnemonic } = props
    return html`
      <div class="${styles.container} modals-container">
        <div class="${styles.logo} modals-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div>
          <div
            class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin"
            style="font-size: 20px; color: var(--ara-red);"
          >
            DO NOT LOSE THIS MNEMONIC
          </div>
          <div class="${styles.smallMessage({})} modal-smallMessage">
            This 12 word phrase is the ONLY way to recover your account and login to your account on another computer
            Please write this phrase down and keep it in a secure place.
            You will never be shown this mnemonic again
          </div>
        </div>
        <div class="${styles.mnemonicContainer} modal-mnemonicContainer">
          <div>${mnemonic.split(' ').slice(0, 4).map(word => html`<b> ${word}</b>`)}</div>
          <div>${mnemonic.split(' ').slice(4, 8).map(word => html`<b> ${word}</b>`)}</div>
          <div>${mnemonic.split(' ').slice(8).map(word => html`<b> ${word}</b>`)}</div>
          <div class="${styles.copyItemContainer} modal-copyItemContainer" >
            <div class="${styles.clipboard} modal-clipBoard" style="width: 45%;">
              ${children.copyMnemonicButton.render({})}
              <span>Copied !</span>
            </div>
          </div>
        </div>
        ${children.confirmButton.render({ cssClass: state.copied ? 'standard' : 'thinBorder' })}
      </div>
    `
  }
}

module.exports = MnemonicWarning