'use strict'

const { colors, colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  colorSelector,
  fonts,

  container: css`
    :host {
      align-items: center;
      background-color: white;
      border: 1px ${colors.araGrey} solid;
      border-width: 0px 1px;
      cursor: pointer;
      display: block;
      font-family: ${fonts.light};
      height: 2em;
      line-height: 2em;
      overflow: hidden;
      padding: 0 5px;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
      -webkit-app-region: no-drag;
      z-index: 9999;
    }

    :host:hover {
      background-color: #e2e2e2;
    }

    :host span {
      align-items: center;
      animation-duration: 900ms;
      background-color: #e2e2e2;
      color: ${colorSelector('orange')};
      display: flex;
      flex-direction: column;
      font-family: ${fonts.semibold};
      height: 1.4em;
      justify-content: center;
      left: 25%;
      opacity: 0;
      position: absolute;
      top: 0.4em;
      width: 50%;
      z-index: -1;
    }
  `
}