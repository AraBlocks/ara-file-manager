'use strict'

const { css } = require('css')

module.exports = {
  container: css`
    :host {
      align-items: center;
      bottom: 0;
      background-color: var(--ara-orange);
      font-size: 11px;
      height: 52px;
      left: 0;
      justify-content: center;
      position: absolute;
      width: 100%;
      display: flex;
      z-index: 999;
    }

    :host > p {
      width: 90%;
    }

    @media only screen and (max-width: 350px) {
      :host {
        font-size: 10px;
        height: 55px;
      }
  }
  `,
}