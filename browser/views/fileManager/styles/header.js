'use strict'

const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  didHolder: css`
    :host {
      border-radius: 7px;
      cursor: pointer;
      padding: 0 6px;
      transition: all ease-in-out;
    }

    :host:hover {
      background-color: #d0d0d0;
    }
  `,

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

  subHeader: css`
    :host {
      display: flex;
      font-size: 14px;
      justify-content: space-between;
      padding-top: 10px;
    }
  `,

  tabHolder: css`
    :host {
      display: flex;
    }

    :host div {
      cursor: pointer;
      margin-right: 30px;
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
      align-items: flex-end;
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
  `,

  windowControlsHolder: css`
    :host {
      display: flex;
      justify-content: space-between;
      width: 25px;
    }
  `
}