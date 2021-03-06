const { events } = require('k')
const { closeModal, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const { utils } = require('../../lib/tools')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = (load) => {
  const updateButton = new Button({
    children: 'Update',
    onclick: () => {
      emit({ event: events.CONFIRM_UPDATE_FILE, load })
      closeModal()
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => closeModal()
  })

  return (html`
    <div class="${styles.container({})} modals-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Update File?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage({})} modal-smallMessage">
            This update will be pushed to all users connected to<br>
            the network.<br><br>
            This will cost:
          </div>
          <span class="${styles.postheader} modals-postheader">
            ${utils.roundDecimal(load.gasEstimate, 1000)} eth
          </span>
        </div>
      </div>
      <div>
        ${updateButton.render({})}
        ${cancelbutton.render({})}
      </div>
    </div>
  `)
}