const { fonts, colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
  fonts,

  container: css`
    :host {
      display: flex;
    }
  `,

  exclamation: css`
    :host {
      color: ${colorSelector('orange')};
      font-size: 17px;
    }
  `,

  name(loading) {
    return css`
      :host {
        color: ${loading ? colorSelector('grey') : 'black'};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `
  },

  nameHolder: css`
    :host {
      display: flex;
      font-family: ${fonts.bold} !important;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 2px;
    }
  `,

  sizeHolder: css`
    :host {
      font-family: ${fonts.light};
      font-size: 12px;
    }
  `,

  summaryHolder: css`
    :host {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 88%;
    }
  `,

  clickable: css`
    :host {
      width: 100%;
    }
  `,

  tooltipHolder: css`
    :host {
      margin-left: 5px;
      margin-top: 3px;
    }
  `
}