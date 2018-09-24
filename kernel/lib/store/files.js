const {
  AWAITING_DOWNLOAD,
  DOWNLOADED_PUBLISHED,
} = require('../../../lib/constants/stateManagement')

module.exports = {
  loadingLibrary: true,
  published: [],
  purchased: []
}

function mockFiles() {
  return [
    {
      downloadPercent: 0,
      did: 'did:ara:fdkgi6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 237.43,
      peers: 1003,
      price: 56.99,
      name: 'Adobe Photoshop',
      size: 10.67,
      status: AWAITING_DOWNLOAD,
    },
    {
      downloadPercent: 1,
      did: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 54.33,
      peers: 33,
      price: 10.99,
      name: 'Microsoft Word',
      size: 4.67,
      status: DOWNLOADED_PUBLISHED,
    },
    {
      downloadPercent: 0,
      aid: 'did:ara:kdi986c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 2134.33,
      peers: 353,
      price: 3.99,
      name: 'Microsoft PowerPoint',
      size: 1.67,
      status: AWAITING_DOWNLOAD,
    }
  ]
}