'use strict'

const { css } = require('../../lib/cssTool/css')

module.exports = {
  container: css`
    :host {
      display: table;
      height: 100%;
      width: 100%;
      text-align: center;
    }

    :host div {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }
  `
}