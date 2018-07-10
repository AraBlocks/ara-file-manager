'use strict'

const PublishedSection = require('./fManager/publishedComponent/publishedSection')
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
    Object.assign(window, {
      FileManagerView: this,

     })

    return html`
      <div id="outside">
        ${new PublishedSection({files: mockFiles()}).render()}
      </div>
  `
  }
}

function mockFiles() {
  return [
  {
      downloadPercent: 0,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 237.43,
        peers: 1003,
        price: 56.99,
      },
      name: 'Adobe Photoshop',
      size: 10.67,
      status: 0,
    },
    {
      downloadPercent: 1,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 54.33,
        peers: 33,
        price: 10.99,
      },
      name: 'Microsoft Word',
      size: 4.67,
      status: 2,
    },
    {
      downloadPercent: 0,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 2134.33,
        peers: 353,
        price: 3.99,
      },
      name: 'Microsoft PowerPoint',
      size: 1.67,
      status: 0,
    }
  ]
}

module.exports = FileManagerView