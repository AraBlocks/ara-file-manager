'use strict'

const { waitModalText } = require('../../lib/tools/generalModalTextProvider')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({ modalName = null, load }) => {
	const { description, waitTime } = waitModalText(modalName, load)
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
				Please wait...
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${description}
			</div>
			<div class="${styles.spinnerHolder} modal-spinnerHolder">
      	<div class="spinner-small-teal ${styles.spinnerHolder}"></div>
			</div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${waitTime}
			</div>
    </div>
  `
}