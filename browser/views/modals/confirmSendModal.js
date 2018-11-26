'use strict'

const Button = require('../../components/button')
const { CONFIRM_SEND_ARA } = require('../../../lib/constants/stateManagement')
const { emit, closeModal } = require('../../lib/tools/windowManagement')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({
	amount = 5,
	receiver = "did:ara:0c354f916a8c6059ab4d726eed4f9f2bf47db09f01c4f4111822483ccede7cf8"
}) => {
  const confirmButton = new Button({
    children: 'Confirm',
    onclick: () => {
      emit({
        event: CONFIRM_SEND_ARA,
        load: {
					amount,
					receiver
        }
      })
      closeModal('confirmSendModal')
    }
  })

  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => closeModal()
   })
  return html`
    <div class="${styles.container} modals-container">
      <div>
        <div class="${styles.preheader} modals-preheader">
          You're about to send
				</div>
				<div>
        	<span class="${styles.bigBold} modals-bigBold">${amount}</span> Ara
				</div>
				<div class="${styles.containerCenter} modals-verticalContainer">
					to<br><br>
          <div class="${styles.truncateText} modals-truncateText">
            <b>${receiver}</b>
          </div>
					<br>Are you sure you'd like to send these tokens?
				</div>
      </div>
      <div>
        ${confirmButton.render({})}
        ${cancelbutton.render({})}
      </div>
    </div>
  `
}