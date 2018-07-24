'use strict'

const { closeWindow } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ price = 5.43 }) => {
  const publishButton = new Button({ children: 'Publish' })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: closeWindow
  })

  return html`
    <div class="${styles.container} modals-container">
      <div>
        <div class="${styles.messageBold} modal-messageBold">
          Publish Now?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage} modal-smallMessage">
            Publishing this file will cost:
          </div>
          <span class="${styles.postheader} modals-postheader">
            ${price} ARA
          </span>
        </div>
      </div>
      ${publishButton.render()}
      ${cancelbutton.render()}
    </div>
  `
}