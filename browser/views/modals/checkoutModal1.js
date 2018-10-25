'use strict'

const html = require('choo/html')
const styles = require('./styles')
const Button = require('../../components/button')
const { PURCHASE } = require('../../../lib/constants/stateManagement')
const { emit, closeModal } = require('../../lib/tools/windowManagement')

module.exports = ({
  aid: did,
  fileName = 'No file name given',
  price = 0,
  publisherName = 'No publisher name given'
}) => {
  const buyButton = new Button({
    children: 'Buy Now',
    onclick: () => {
      emit({
        event: PURCHASE,
        load: {
          did,
          fileName,
          price
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
          You're about to purchase
        </div>
        <div class="${styles.fileName} modal-fileName">
          ${fileName}
        </div>
        <div class="${styles.postheader} modal-postheader">
          from ${publisherName}
        </div>
        <div class="${styles.for} modal-for">
          for
        </div>
      <div>
        <span class="${styles.bigBold} modals-bigBold">${price}</span> Ara
      </div>
      </div>
      <div>
        ${buyButton.render()}
        ${cancelbutton.render()}
      </div>
    </div>
  `
}