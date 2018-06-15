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
      align-items: center;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      vertical-align: middle;
    }

    :host table, tr, td {
      border: 1px solid black;
      border-collapse: collapse;
    }

    :host table {
      width: 60%;
    }
  `,

  header: css`
    :host {
      width: 80px;
      text-align: left;
    }
  `
}