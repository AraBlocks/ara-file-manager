'use strict'

const html = require('choo/html')
const styles = require('./styles')
const Button = require('../../components/button')
const { PURCHASE } = require('../../../lib/constants/stateManagement')
const { emit, closeModal } = require('../../lib/tools/windowManagement')
const { utils } = require('../../lib/tools')

module.exports = ({
  aid: did,
  fileName = 'The Ultimate Manggo Collection Vol I',
  price = 10,
  publisherName = 'Unnamed Author'
}) => {
  const buyButton = new Button({
    children: 'Buy Now',
    onclick: () => {
      const load = { did, fileName, price }
      emit({ event: PURCHASE, load })
      closeModal()
    }
  })

  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => closeModal()
  })
  price = Number(price)
  const fee = utils.roundDecimal(price / 10, 10)
  return html`
    <div class="${styles.container({})} modals-container">
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
        <span class="${styles.bigBold} modals-bigBold">
        ${price ? price + fee : 0}
        </span>
        Ara
      </div>
      <div style="font-size: 9px;">
        ${price ? price + ' + ' + fee + ' Network Fee' : null}
      </div>
      </div>
      <div>
        ${buyButton.render({})}
        ${cancelbutton.render({})}
      </div>
    </div>
  `
}