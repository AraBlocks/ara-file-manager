const k = require('../../../lib/constants/stateManagement')

module.exports = {
  loadingLibrary: false,
  deepLinkData: null,
  published: [],
  purchased: [],
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
      shouldBroadcast: false,
      size: 10000043 * 100,
      status: k.AWAITING_DOWNLOAD,
      allocatedRewards: 20
    },
    {
      downloadPercent: 1,
      did: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 54.33,
      peers: 33,
      price: 10.99,
      name: 'Microsoft Word',
      shouldBroadcast: true,
      size: 12030043 * 100,
      status: k.DOWNLOADED_PUBLISHED,
      allocatedRewards: 20
    },
    {
      downloadPercent: 1,
      did: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 54.33,
      peers: 33,
      price: 10.99,
      name: 'Spirited Away',
      shouldBroadcast: false,
      size: 12030043 * 100,
      status: k.DOWNLOADED_PUBLISHED,
      allocatedRewards: 0
    },
    {
      downloadPercent: 0,
      aid: 'did:ara:kdi986c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 2134.33,
      peers: 353,
      price: 3.99,
      name: 'Microsoft PowerPoint',
      shouldBroadcast: false,
      size: 19033043 * 100,
      status: k.AWAITING_DOWNLOAD,
      allocatedRewards: 499
    },
    {
      downloadPercent: .50,
      did: 'did:ara:fdkgi6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 237.43,
      peers: 1003,
      price: 56.99,
      name: 'Adobe Photoshop',
      shouldBroadcast: false,
      size: 10000043 * 100,
      status: k.DOWNLOADING,
    },
    {
      downloadPercent: 1,
      did: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 54.33,
      peers: 33,
      price: 10.99,
      name: 'Microsoft Word',
      shouldBroadcast: false,
      size: 12030043 * 100,
      status: k.OUT_OF_SYNC,
      allocatedRewards: 14
    },
    {
      downloadPercent: .70,
      did: 'did:ara:fdkgi6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 237.43,
      peers: 1003,
      price: 56.99,
      name: 'Movie Film',
      shouldBroadcast: false,
      size: 10000043 * 100,
      status: k.PAUSED,
      allocatedRewards: 0
    },
    {
      downloadPercent: 1,
      did: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
      datePublished: '11/20/1989',
      earnings: 54.33,
      peers: 33,
      price: 10.99,
      name: 'Microsoft Word',
      shouldBroadcast: false,
      size: 12030043 * 100,
      status: k.UPDATE_AVAILABLE,
      allocatedRewards: 0
    }
  ]
}