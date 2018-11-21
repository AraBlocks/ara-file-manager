'use strict'

const { css } = require('css')

module.exports = {
  container: css`
    :host {
      animation: banner 1000ms;
      background-color: var(--ara-orange);
      left: 0;
      position: absolute;
      margin: 5px 5px;
      opacity: .93;
      padding: 10px;
      padding-bottom: 0;
      text-align: left;
      top: 0;
      z-index: 99;
    }

    :host div {
      color: white;
      padding: 5px;
      text-align: center;
      cursor: pointer;
    }
  `,
}