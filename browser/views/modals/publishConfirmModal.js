const k = require('../../../lib/constants/stateManagement')
const { closeModal, closeWindow, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const { utils } = require('../../lib/tools')
const styles = require('./styles')
const html = require('nanohtml')

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
      emit({ event: k.CANCEL_TRANSACTION })
      closeModal()
    }
  })

  return html`
    <div class="${styles.container({})} modals-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Publish Now?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <span style="margin-bottom: 15px">This will cost:</span>
          <span class="${styles.postheader} modals-postheader">
            ${utils.roundDecimal(load.gasEstimate, 1000)} eth
          </span>
        </div>
      </div>
      <div>
        ${publishButton.render({})}
        ${cancelbutton.render({})}
      </div>
    </div>
  `
}