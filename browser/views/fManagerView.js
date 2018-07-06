'use strict'

const FileDescriptor = require('./fManager/fileDescriptor')
const PublishedRow = require('./fManager/publishedRow')
const PublishedStats = require('./fManager/publishedStats')
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
    const downloadDemo = new PublishedRow({
      downloadPercent: 1,
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
      percentDownloaded: 0
    })

    Object.assign(window, {
      FileManagerView: this,
      downloadDemo
     })

    return html`
      <div>
        ${new PublishedRow({
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
          percentDownloaded: 1
        }).render()}
      ${new PublishedRow({
        downloadPercent: 1,
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
        percentDownloaded: 0
      }).render()}

      ${downloadDemo.render()}
    </div>
  `
  }
}

// const downloadingDescriptor = new FileDescriptor({
//   name: 'Microsoft Powerpoint',
//   size: '3.632',
//   downloadPercent: 0,
//   status: 1,
//             meta: {
//         aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
//         datePublished: '11/20/1989'
//       }
// })

// return html`
//   <div
//     style="
//       display: flex;
//       justify-content: center;
//       width: 100%;
//     "
//   >

//       ${new FileDescriptor({
//         name: 'Microsoft Word',
//         size: '5.6',
//         downloadPercent: 0,
//         status: 0,
//         meta: {
//           aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
//           datePublished: '11/20/1989'
//         }
//       }).render()}


//       ${downloadingDescriptor.render()}
//       ${downloadingDescriptor.start()}

//       ${new FileDescriptor({
//         name: 'Adobe Photoshop',
//         size: '8.7',
//         downloadPercent: 1,
//         status: 2,
//         meta: {
//           aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
//           datePublished: '11/20/1989'
//         }
//       }).render()}
//     </div>

//     <div
//       style="
//         width: 45%;
//       "
//     >
//       ${new PublishedStats({
//         earnings: 543.22,
//         peers: 50,
//         price: 9.99,
//         status: 0
//       }).render()}

//       ${new PublishedStats({
//         earnings: 31.06,
//         peers: 2,
//         price: 4.99,
//         status: 1
//       }).render()}

//       ${new PublishedStats({
//         earnings: 87.036,
//         peers: 102,
//         price: 34.99,
//         status: 2
//       }).render()}
//     </div>
//   </div>
// `

module.exports = FileManagerView