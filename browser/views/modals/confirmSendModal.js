const Button = require('../../components/button')
const { events } = require('k')
const { emit, closeModal } = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const styles = require('./styles')

module.exports = ({
	amount = 5,
	receiver = "0x12345678..."
}) => {
  const confirmButton = new Button({
    children: 'Confirm',
    onclick: () => {
      emit({
        event: events,
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
    <div class="${styles.container({})} modals-container">
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