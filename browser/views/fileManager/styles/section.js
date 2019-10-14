const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  header: css`
    :host {
      background-color: white;
      font-family: ${fonts.black};
      font-size: 16px;
      height: 30px;
      padding: 0 2.5%;
      position: sticky;
      pointer-events: none;
      top: 0px;
      z-index: 500;
    }
  `,

  separator: css`
    :host {
      background-color: ${colors.araGrey};
      height: 1px;
      margin-top: 5px;
      width: 100%;
    }
  `
}
