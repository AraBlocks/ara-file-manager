'use strict'

const styles = require('./styles/confirm')
const html = require('choo/html')

module.exports = (state, emit) => {
  return html`
    <div class=${styles.container}>
      <div>
        <table>
          <tr>
            <td class=${styles.header}>
              Title
            </td>
            <td>
              The Room
            </td>
          </tr>
          <tr>
            <td class=${styles.header}>
              Description
            </td>
            <td>
              The best movie ever
            </td>
          </tr>
          <tr>
          <td class=${styles.header}>
            License
          </td>
          <td>
            5
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