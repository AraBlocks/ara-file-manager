'use strict'

const windowManagement = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')
const {	clipboard, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

module.exports = (identity) => {
  identity = 'did:ara:e27e2ef7b14adf94d72d858964fb307dad6b061481ec4435d62b7fac38a67c5c'
  const copyMnemonic = new Button({
    children: "Copy Identity",
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
    <div class="${styles.containerLeft} modals-containerLeft">
      <div class="${styles.logo} modals-logo">
        <img src="../assets/images/LTLSTR_Logo_FileManager.png"/>
      </div>
      <div>
        <div class="${styles.title} modals-title">
          Registration
        </div>
      </div>
      <div class="">
        <div class="${styles.smallMessage({})} modal-smallMessage">
          The following string of characters is your <b>Ara Identity</b>. Please copy it and keep it in a safe place.
        </div>
        <div class="${styles.araIDHolder} modal-araIDHolder">${identity}</div>
        <div class="${styles.copyMnemonicContainer} modal-copyMnemonicContainer" >
          <div>${copyMnemonic.render()}</div>
        </div>
      </div>
      ${confirmButton.render()}
    </div>
  `
}