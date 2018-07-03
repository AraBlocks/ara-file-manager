'use strict'

const FileDescriptor = require('./fManager/fileDescriptor')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileManagerView extends Nanocomponent {
  createElement() {
    Object.assign(window, { FileManagerView: this })
    return html`
      <div style="width: 50%">
        ${new FileDescriptor({
          name: 'Microsoft Word',
          size: '5.6',
          downloadPercent: 1,
          status: 2
        }).render()}
      </div>
    `
  }
}

module.exports = FileManagerView