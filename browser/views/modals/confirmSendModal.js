'use strict'

const html = require('choo/html')
const styles = require('./styles')
const Button = require('../../components/button')
const { CONFIRM_SEND_ARA } = require('../../../lib/constants/stateManagement')
const { emit, closeModal } = require('../../lib/tools/windowManagement')

module.exports = ({
	walletAddress = "0x12345678...",
	amount = 6
}) => {
  const confirmButton = new Button({
    children: 'Confirm',
    onclick: () => {
      emit({
        event: CONFIRM_SEND_ARA,
        load: {
        }
      })
      closeModal()
    }
  })

  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => {
      closeModal()
    }
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
					to wallet address<br><br>
					<b>${walletAddress}</b><br>
					Are you sure you'd like to send these tokens?
				</div>
      </div>
      <div>
        ${confirmButton.render({})}
        ${cancelbutton.render({})}
      </div>
    </div>
  `
}