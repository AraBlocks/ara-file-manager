const { css } = require('css')
const { fonts, colorSelector } = require('css-constants')

module.exports = {
  container: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 90%;
    }
  `,

  logo: css`
    :host {
      align-content: center;
      display: flex;
      justify-content: center;
    }

    :host > img {
      height: 9px;
    }
  `,

  title: css`
    :host {
      font-family: ${fonts.black};
      font-size: 20px;
    }
  `,

  recoverForm: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 80%;
      justify-content: space-between;
    }

    :host div {
      font-size: 13px;
    }

    :host div > b {
      font-family: ${fonts.bold};
    }
  `
}