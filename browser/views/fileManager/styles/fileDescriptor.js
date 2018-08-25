'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {

  buttonHolder: css`
    :host {
      width: 100%;
    }

    :host button {
      font-size: 12px;
      height: 25px;
      text-align: left;
    }
  `,

  container: css`
    :host {
      display: flex;
      height: 75px;
      width: 100%;
    }
  `,

  iconHolder: css`
    :host {
      display: flex;
      justify-content: left;
      width: 12%;
    }
  `,

  name: css`
    :host {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,

  nameHolder: css`
    :host {
      display: flex;
      font-family: ${fonts.bold};
      font-size: 16px;
      width: 75%;
    }
  `,

  sizeHolder(status) {
    return css`
      :host {
        color: ${status === 0 ? 'grey' : 'black' };
        font-family: ${fonts.light};
        font-size: 13px;
      }
    `
  },

  summaryHolder: css`
    :host {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 88%;
    }
  `,


  tooltipHolder: css`
    :host {
      margin-left: 5px;
      margin-top: 3px;
    }
  `
}