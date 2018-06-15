'use strict'

const styles = require('./styles/confirm')
const html = require('choo/html')

module.exports = (state, emit) => {
  const { purchaseRequest } = state
  return html`
    <div class=${styles.container}>
      <div>
        <table>
          <tr>
            <td class=${styles.header}>
              Title
            </td>
            <td>
              ${purchaseRequest.title}
            </td>
          </tr>
          <tr>
            <td class=${styles.header}>
              Description
            </td>
            <td>
              ${purchaseRequest.description}
            </td>
          </tr>
          <tr>
          <td class=${styles.header}>
            License
          </td>
          <td>
            ${purchaseRequest.license}
          </td>
        </tr>
        </table>
        <button>
          Purchase
        </button>
      </div>
    </div>
  `
}