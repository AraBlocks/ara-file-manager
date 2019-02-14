const { colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  container: css`
    :host {
      padding-top: 10px;
      display: flex;
      justify-content: center;
    }

    :host > div {
      width: 100%;
    }

    :host a {
      cursor: pointer;
    }
  `,

  noFilesContainer: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 40%;
      text-align: center;
    }

    :host div {
      font-family: ${fonts.black};
      font-size: 30px;
    }

    :host p {
      font-size: 15px;
      font-family: ${fonts.light};
    }

    :host a {
      color:  ${colorSelector('red')};
      font-family: ${fonts.light};
      font-size: 13px;
      text-decoration: none;
    }

    :host a:hover {
      color: ${colorSelector('red', true)};
    }
  `,

  sectionContainer(isTestnet) {
    return css`
      :host {
        animation: fadein 1500ms;
        height: ${isTestnet ? '430px' : '450px'};
        overflow-y: scroll;
      }
    `
  },

  spinnerBarHolder: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }
  `
}