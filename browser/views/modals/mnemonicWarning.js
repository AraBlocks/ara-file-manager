'use strict'

const windowManagement = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')
const {	clipboard, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

module.exports = ({ mnemonic }) => {
  const copyMnemonicButton = new Button({
    children: "Copy Mnemonic",
    cssClass: {
      opts: { color: 'green', fontSize: '10px' }
    },
    onclick: () => clipboard.writeText(mnemonic)
  })
  const confirmButton = new Button({
    children: "I've saved my mnemonic",
    onclick: () => {
      windowManager.openWindow('filemanager')
      windowManagement.closeModal('mnemonicWarning')
    }
  })

  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.logo} modals-logo">
        <img src="../assets/images/ARA_logo_horizontal.png"/>
      </div>
      <div>
        <div
          class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin"
          style="font-size: 20px;"
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
        <div>${mnemonic.split(' ').slice(0,4).map(word => html`<b> ${word}</b>`)}</div>
        <div>${mnemonic.split(' ').slice(4,8).map(word => html`<b> ${word}</b>`)}</div>
        <div>${mnemonic.split(' ').slice(8).map(word => html`<b> ${word}</b>`)}</div>
        <div class="${styles.copyItemContainer} modal-copyItemContainer" >
          <div>${copyMnemonicButton.render({})}</div>
        </div>
      </div>
      ${confirmButton.render({})}
    </div>
  `
}