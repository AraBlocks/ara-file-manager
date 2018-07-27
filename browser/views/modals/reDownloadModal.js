'use strict'

const Button = require('../../components/button')
const { closeWindow, openWindow } = require('../../lib/tools/windowManagement')
const styles = require('./styles')
const html = require('choo/html')
const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')
const download = require('../../lib/download')

module.exports = ({
  price = windowManager.fileInfo.price || 0,
  aid = windowManager.fileInfo.aid
}) => {
  const downloadButton = new Button({
    children: 'Download',
    onclick: download
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: closeWindow
  })
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Download this file?
      </div>
      <div class="${styles.verticalContainer} modal-verticalContainer">
        <div class="${styles.smallMessage} modal-smallMessage">
          The download will cost:
        </div>
        <span class="${styles.postheader} modals-postheader">${price} ARA</span>
      </div>
      <div>
        ${downloadButton.render()}
        ${cancelbutton.render()}
      </div>
    </div>
  `
}

windowManager.bridge.on('DOWNLOADING', () => {
  openWindow('filemanager')
  windowManager.get('reDownloadModal').close()
})