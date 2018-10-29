'use strict'

const windowManagement = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')
const {	clipboard, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

module.exports = (mnemonic) => {
  const copyMnemonic = new Button({
    children: "Copy Mnemonic",
    cssClass: {
      opts: { color: 'blue', fontSize: '10px' }
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
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          DO NOT LOSE THIS MNEMONIC
        </div>
        <div class="${styles.smallMessage({})} modal-smallMessage">
          This 12 word phrase is the ONLY way to recover your account and login to your account on another computer
          Please write this phrase down in and keep it in a secure place.
          You will never be shown this mnemonic again
        </div>
      </div>
      <div class="${styles.mnemonicContainer} modal-mnemonicContainer">
        <div>${mnemonic.split(' ').slice(0,4).map(word => html`<b> ${word}</b>`)}</div>
        <div>${mnemonic.split(' ').slice(4,8).map(word => html`<b> ${word}</b>`)}</div>
        <div>${mnemonic.split(' ').slice(8).map(word => html`<b> ${word}</b>`)}</div>
        <div class="${styles.copyMnemonicContainer} modal-copyMnemonicContainer" >
          <div>${copyMnemonic.render()}</div>
        </div>
      </div>
      ${confirmButton.render()}
    </div>
  `
}