'use strict'

const k = require('../../../lib/constants/stateManagement')
const { closeModal, closeWindow, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = (load) => {
  const publishButton = new Button({
    children: 'Publish',
    onclick: () => {
      emit({ event: k.CONFIRM_PUBLISH, load: { ...load } }),
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
            By publishing this file, you certify that you have the
            <div class="${styles.smallMessage({ color: 'blue' })} modal-smallMessage">
              legal right to publish and distribute this content.
            </div>
            <br>Publishing this file will cost:
          </div>
          <span class="${styles.postheader} modals-postheader">
            ${Math.round(load.gasEstimate * 1000)/1000} eth
          </span>
        </div>
      </div>
      ${publishButton.render({})}
      ${cancelbutton.render({})}
    </div>
  `
}