'use strict'

const { css }  = require('css')

module.exports = {
  container: css`
    :host {
      cursor: pointer;
      display: flex;
      height: 44px;
      justify-content: space-between;
      -webkit-app-region: no-drag;
    }

    :host:hover {
      background-color: #eeeeee;
    }
  `,

  fileDescriptorHolder: css`
    :host {
      min-width: 220px;
    }
  `,

  mainContainer: css`
    :host {
      position: relative;
      height: 55px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 10px;
    }

    :host:hover {
      background-color: #eeeeee;
    }
  `
}