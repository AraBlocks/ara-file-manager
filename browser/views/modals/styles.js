'use strict'

const { css } = require('css')
const { buttonSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  bigBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 50px;
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 95%;
      width: 90%;
      justify-content: space-between;
      text-align: center;
    }

    :host > * {
      width: 95%;
    }
  `,

  fileName: css`
    :host {
      font-family: ${fonts.boldSpecial};
      font-size: 20px;
    }
  `,

  for: css`
    :host {
      font-size: 12px;
      margin: 12px 0;
    }
  `,

  messageBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 25px;
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
  `,

  smallBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 20px;
    }
  `,

  smallMessage: css`
    :host {
      font-size: 12px;
      margin-bottom: 12px;
    }
  `,

  verticalContainer: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  `
}