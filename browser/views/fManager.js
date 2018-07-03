'use strict'

const FileDescriptor = require('./fManager/fileDescriptor')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileManager extends Nanocomponent {
  createElement() {
    return (new FileDescriptor({
      name: 'Microsoft Word',
      size: '5.6',
      downloadPercent: 1,
      status: 2
    })).render()
  }
}