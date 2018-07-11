'use strict'

const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-family: ${fonts.light};
      height: 150px;
      justify-content: space-between;
      margin-bottom: 40px;
    }
  `,

  closeButtonHolder: css`
    :host button {
    }
  `
  ,

  subHeader: css`
    :host {
      display: flex;
      font-size: 14px;
      justify-content: space-between;
    }
  `,

  titleHolder: css`
    :host {
      font-size: 30px;
      font-family: ${fonts.boldSpecial};
    }
  `,

  userHolder: css`
    :host {
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }

    :host b {
      font-family: ${fonts.bold};
    }
  `,

  publishFilebuttonHolder: css`
    :host button {
      width: 100%;
    }
  `
}