'use strict'

//const { CONFIRM_DELETE } = require('../../../lib/constants/stateManagement')
const { closeModal, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ price = 0.09 }) => {
  const deleteButton = new Button({
    children: 'Delete File',
    onclick: () => {
      //emit({ event: CONFIRM_DELETE, load }),
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
			<div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
				Are you sure you want<br>
				to delete this file from<br>
				the network?<br>
			</div>
      <div>
				<div class="${styles.verticalContainer} modal-verticalContainer">
					<div class="${styles.smallMessage({})} modal-smallMessage">
						<div class="${styles.smallMessage({ color: 'red' })} modal-smallMessage">
							<b>This will permanently remove your file from<br>the network.</b><br><br>
						</div>
						You will not be able to continue distributing this file, and will not be able to earn ARA Token rewards for hosting it.<br><br>
						Any users currently synced to the network will lose<br>
						this file, although this process is not instantaneous.<br><br>
						This does not guarantee that all copies of your file will be erased, as users may have backed the file up or disconnected from the network.<br><br>
						This will not delete local files on your computer.<br><br>
						Deleting this file will cost:
          </div>
				</div>
			</div>
			<span class="${styles.postheader} modals-postheader">
				${price} Ara
			</span>
      ${deleteButton.render()}
      ${cancelbutton.render()}
    </div>
  `
}