'use strict'

const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  aid: css`
    :host {
      color: ${colors.araLightBlack};
      font-family: ${fonts.light};
    }
  `,

  clipboard: css`
    :host {
      cursor: pointer;
      background-color: #1e7dfa;
      color: white;
      display: flex;
      flex-direction: column;
      height: 2em;
      justify-content: center;
      position: relative;
      width: 100%;
    }

    :host span {
      animation-duration: 1000ms;
      color: red;
      left: 39%;
      opacity: 0;
      position: absolute;
    }
  `,

  optionsTooltip: css`
    :host {
      color: black;
      display: flex;
      flex-direction: column;
      font-family: ${fonts.light};
      font-size: 12px;
      height: 110px;
      justify-content: center;
      padding-left: 5px;
      text-align: left;
      width: 300px;
    }

    :host b {
      font-family: ${fonts.bold};
    }
  `,

  published: css`
    :host {
      color: ${colors.araLightBlack};
      font-family: ${fonts.light};
    }
  `,

  fileTooltip: css`
    :host {
      color: black;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100px;
    }
  `
}