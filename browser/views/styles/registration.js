const { colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colorSelector,
  fonts,

  header: css`
    :host {
      display: flex;
      font-family: ${fonts.black};
      font-size: 20px;
      width: 90%;
    }
  `,

  description: css`
    :host {
      font-family: ${fonts.light};
      font-size: 12px;
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

  registerForm: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 160px;
      justify-content: space-between;
      width: 90%;
    }
  `
}