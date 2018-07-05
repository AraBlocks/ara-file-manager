'use strict'

const FileDescriptor = require('./fManager/fileDescriptor')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

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
      name: 'Microsoft Powerpoint',
      size: '3.632',
      downloadPercent: 0,
      status: 1,
                meta: {
            aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
            datePublished: '11/20/1989'
          }
    })

    return html`
      <div style="width: 50%">
        ${new FileDescriptor({
          name: 'Microsoft Word',
          size: '5.6',
          downloadPercent: 0,
          status: 0,
          meta: {
            aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
            datePublished: '11/20/1989'
          }
        }).render()}

        ${downloadingDescriptor.render()}
        ${downloadingDescriptor.start()}

        ${new FileDescriptor({
          name: 'Adobe Photoshop',
          size: '8.7',
          downloadPercent: 1,
          status: 2,
          meta: {
            aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
            datePublished: '11/20/1989'
          }
        }).render()}
      </div>
    `
  }
}

module.exports = FileManagerView