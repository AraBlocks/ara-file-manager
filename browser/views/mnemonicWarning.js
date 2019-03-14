const { clipboard, remote } = require('electron')
const { events } = require('k')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const windowManager = remote.require('electron-window-manager')

const Button = require('../components/button')
const styles = require('./modals/styles')
const windowManagement = require('../lib/tools/windowManagement')

class MnemonicWarning extends Nanocomponent {
  constructor({ isAFS = false, mnemonic }) {
    super()
    this.props = { mnemonic, isAFS }
    this.state = { copied: false }

    this.children = {
      copyMnemonicButton: new Button({
        children: "Copy mnemonic",
        cssClass: {
          opts: { color: 'green' }
        },
        onclick: this.copyMnemonic.bind(this)
      }),

      confirmButton: new Button({
        children: "I've saved my mnemonic",
        cssClass: { name: 'thinBorder' },
        onclick: () => {
          if (!this.state.copied) { return }
          this.props.isAFS
            ? windowManagement.transitionModal('publishSuccessModal')
            : windowManager.openWindow('filemanager')
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

    const acctMsg = 'recover your account and login to your account on another computer.'
    const afsMsg = 'recover or edit access to this package.'
    return html`
      <div class="${styles.container({ justifyContent: 'space-around', height: 95 })} modals-container">
        <div class="${styles.logo} modals-logo">
          <img src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div>
          <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin" style="font-size: 20px; color: var(--ara-red);">
            DO NOT LOSE THIS MNEMONIC
          </div>
          <div class="${styles.smallMessage({})} modal-smallMessage">
            This 12 word phrase is the ONLY way to ${props.isAFS ? afsMsg : acctMsg}
            Please write this phrase down and keep it in a secure place.
            You will never be shown this mnemonic again.
          </div>
        </div>
        <div class="${styles.mnemonicContainer} modal-mnemonicContainer" style="width: 70%;">
          <div>${mnemonic.split(' ').slice(0, 4).map(word => html`<b> ${word}</b>`)}</div>
          <div>${mnemonic.split(' ').slice(4, 8).map(word => html`<b> ${word}</b>`)}</div>
          <div>${mnemonic.split(' ').slice(8).map(word => html`<b> ${word}</b>`)}</div>
        </div>
        <div class="${styles.copyItemContainer} modal-copyItemContainer">
          <div class="${styles.clipboard} modal-clipBoard">
            ${children.copyMnemonicButton.render({})}
            <span>Copied !</span>
          </div>
          ${children.confirmButton.render({ cssClass: state.copied ? 'standard' : 'thinBorder' })}
        </div>
      </div>
    `
  }
}

module.exports = MnemonicWarning