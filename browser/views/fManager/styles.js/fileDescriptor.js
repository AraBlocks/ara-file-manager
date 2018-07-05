'use strict'

const { colors, fonts } = require('../../../lib/styleUtils')
const { css } = require('../../../lib/cssTool/css')

module.exports = {
  buttonHolder: css`
    :host {
      width: 100%;
    }

    :host button {
      text-align: left;
    }
  `,

  container: css`
    :host {
      border: 1px solid black;
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
      justify-content: space-between;
      font-family: ${fonts.bold};
      font-size: 20px;
      width: 87%;
    }
  `,

  sizeHolder(status) {
    return css`
      :host {
        color: ${status === 0 ? 'grey' : 'black' };
        font-family: ${fonts.light};
        font-size: 15px;
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

  tempToolTip: css`
    :host {
      border: 1px solid black;
      height: 8px;
      width: 8px;
      border-radius: 50%;
    }
  `,

  toolTipHolder: css`
    :host {
      margin-top: 3px;
    }
  `
}