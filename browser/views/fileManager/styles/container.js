'use strict'

const { css } = require('css')
const { fonts, colors, colorSelector } = require('styleUtils')

module.exports = {
  container: css`
    :host {
      padding-top: 10px;
      display: flex;
      justify-content: center;
    }

    :host > div {
      width: 95%;
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
      font-family: ${fonts.boldSpecial};
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

  sectionContainer: css`
    :host {
      height: 525px;
      overflow-y: scroll;
    }
  `,

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