'use strict'

const k = require('../../../lib/constants/stateManagement')
const { closeModal, closeWindow, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const { utils } = require('../../lib/tools')
const styles = require('./styles')
const html = require('choo/html')
const overlay = require('../../components/overlay')

module.exports = (load) => {
  const publishButton = new Button({
    children: 'DEPLOY',
    onclick: () => {
      emit({ event: k.CONFIRM_PUBLISH, load: { ...load } }),
      closeModal()
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => {
      emit({ event: k.CANCEL_TRANSACTION })
      closeModal('deployConfirmModal')
    }
  })

  return html`
		<div class="${styles.container} modals-container">
			${overlay(true)}
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Start Publishing?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage({})} modal-smallMessage">
						In order to start the publishing process,<br> 
						the File Manager needs to prepare the network.<br>
            <br>This will cost:<br>
          </div>
          <span class="${styles.postheader} modals-postheader">
            ${utils.roundDecimal(load.gasEstimate, 1000)} eth
          </span>
        </div>
      </div>
      ${publishButton.render({})}
      ${cancelbutton.render({})}
    </div>
  `
}