const Button = require('../../components/button')
const { events } = require('k')
const windowManagement = require('../../lib/tools/windowManagement')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ aid, fileName, price }) => {
  const downloadButton = new Button({
    children: 'Download',
    onclick: () => {
      windowManagement.openWindow('filemanager')
      windowManagement.emit({ event: events.DOWNLOAD, load: { aid, fileName, price } })
      windowManagement.closeModal('reDownloadModal')
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => windowManagement.closeModal('reDownloadModal')
  })
  return html`
    <div class="${styles.container({})} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Download this file?
      </div>
      <div class="${styles.verticalContainer} modal-verticalContainer">
        <div class="${styles.smallMessage({})} modal-smallMessage">
          The download will cost:
        </div>
        <span class="${styles.postheader} modals-postheader">${price} Ara</span>
      </div>
      <div>
        ${downloadButton.render()}
        ${cancelbutton.render()}
      </div>
    </div>
  `
}