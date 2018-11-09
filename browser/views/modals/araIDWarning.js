'use strict'

const windowManagement = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ userDID }) => {
  const copyIDButton = new Button({
    children: "Copy Identity",
    cssClass: {
      opts: { color: 'blue', fontSize: '10px' }
    },
    onclick: () => clipboard.writeText(userDID)
  })
  const confirmButton = new Button({
    children: "I've saved my Ara Identity",
    onclick: () => windowManagement.transitionModal('mnemonicWarning')
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
        <div class="${styles.araIDHolder} modal-araIDHolder">${userDID}</div>
        <div class="${styles.copyItemContainer} modal-copyItemContainer" >
          <div>${copyIDButton.render({})}</div>
        </div>
      </div>
      ${confirmButton.render({})}
    </div>
  `
}