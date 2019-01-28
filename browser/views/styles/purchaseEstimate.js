'use strict'

const { css } = require('css')
const { buttonSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  bigBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 35px;
    }
  `,

  buttonHolder: css`
    :host {
      width: 100%;
      height: 20%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    :host > * {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-top: 20px;
      text-align: center;
      width: 90%;
    }
  `,

  contentHolder: css`
    :host {
      align-items: center;
      display: flex;
      justify-content: center;
      width: 100%;
    }
  `,

  fileName: css`
    :host {
      font-family: ${fonts.black};
      font-size: 22px;
      padding: 2px 0px;
    }
  `,

  for: css`
    :host {
      font-size: 12px;
      margin-top: 7px;
    }
  `,

  headerHolder: css`
    :host {
      height: 35%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `,

  postheader: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 14px;
    }
  `,

  preheader: css`
    :host {
      font-size: 12px;
      margin-bottom: 5px;
    }

    :host > b {
      font-family: ${fonts.semibold}
    }
  `,

  spinner: css`
    :host {
      display: flex;
      justify-content: center;
      font-size: 4px;
    }
  `,

  padding: css`
    :host {
      padding-bottom: 8px;
    }
  `
}