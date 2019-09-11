const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  header: css`
    :host {
      background-color: #1c1c1c;
      font-family: ${fonts.bold};
      color: white;
      font-size: 12px;
      height: 30px;
      padding: 8% 10% 0 10%;
      position: sticky;
      pointer-events: none;
      top: 0px;
      z-index: 99;
    }
  `,
}
