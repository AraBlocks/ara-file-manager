'use strict'

const { CONFIRM_PUBLISH } = require('../../../lib/constants/stateManagement')
const { closeModal, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = (load) => {
  const publishButton = new Button({
    children: 'Publish',
    onclick: () => {
      emit({ event: CONFIRM_PUBLISH, load: { ...load, cost: 5 } }),
      closeModal()
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => {
      closeWindow('publishFileView')
      closeModal()
    }
  })

  return html`
    <div class="${styles.container} modals-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Publish Now?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage({})} modal-smallMessage">
            Publishing this file will cost:
          </div>
          <span class="${styles.postheader} modals-postheader">
            5 ARA
          </span>
        </div>
      </div>
      ${publishButton.render()}
      ${cancelbutton.render()}
    </div>
  `
}