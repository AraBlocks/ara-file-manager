'use strict'

const FileDescriptor = require('./fManager/fileDescriptor')
const ProgressRing = require('../components/progressRing')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

let setTimer = false
let percent = 0
let test = {downloadPercent:0}
// setInterval(() => test.downloadPercent+=.01, 200 )
class FileManagerView extends Nanocomponent {
  constructor() {
    super()
  }

  update() {
    return true
  }

  createElement() {
    Object.assign(window, { FileManagerView: this })

    const downloadingDescriptor = new FileDescriptor({
      name: 'Microsoft P...',
      size: '3.632',
      downloadPercent: 0,
      status: 1
    })

    return html`
      <div style="width: 50%">
        ${new FileDescriptor({
          name: 'Microsoft Word',
          size: '5.6',
          downloadPercent: 0,
          status: 0
        }).render()}

        ${downloadingDescriptor.render()}
        ${downloadingDescriptor.start()}

        ${new FileDescriptor({
          name: 'Adobe Pho...',
          size: '8.7',
          downloadPercent: 1,
          status: 2
        }).render()}
      </div>
    `
  }
}

module.exports = FileManagerView