const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container(){
    return css`
      :host {
        display: flex;
        flex-direction: column;
        font-family: ${fonts.light};
        justify-content: space-between;
        padding: 2.5% 2.5%;
        position: fixed;
        bottom: 0;
        width: 70%;
        height: 130px;
        background-color: #ffffff;
        border: 1px solid var(--ara-grey);
      }
    `
  },

  subFooter: css`
    :host {
      display: flex;
      font-size: 20px;
      justify-content: space-between;
      height: 35px;
      display: flex;
      align-items: baseline;
    }
  `,

  downloadButtonHolder: css`
    :host {
      width: 100%;
      left: 0;
      position: absolute;
      bottom: 24%;
    }

    :host button {
      width: 100%;
      height: 3em;
    }
  `,

  publishFilebuttonHolder: css`
    :host {
      width: 100%;
      left: 0;
      position: absolute;
      bottom: 0%;
    }

    :host button {
      width: 100%;
      height: 3em;
    }
  `,
}
