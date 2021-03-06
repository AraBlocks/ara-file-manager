const Button = require('../../components/button')
const { events } = require('k')
const windowManagement = require('../../lib/tools/windowManagement')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ estimate, did, gasPrice }) => {
  const downloadButton = new Button({
    children: 'Confirm',
    onclick: () => {
      windowManagement.emit({ event: events.CONFIRM_REDEEM, load: { did, gasPrice } })
      windowManagement.closeModal('redeemConfirmModal')
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => windowManagement.closeModal('redeemConfirmModal')
  })
  return html`
    <div class="${styles.container({})} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Redeem your rewards?
      </div>
      <div class="${styles.verticalContainer} modal-verticalContainer">
        <div class="${styles.smallMessage({})} modal-smallMessage">
          This will cost:
        </div>
        <span class="${styles.postheader} modals-postheader">${estimate} eth</span>
      </div>
      <div>
        ${downloadButton.render()}
        ${cancelbutton.render()}
      </div>
    </div>
  `
}
