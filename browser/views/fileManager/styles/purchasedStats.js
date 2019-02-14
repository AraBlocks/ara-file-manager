const { events: k } = require('k')
const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  bolden: css`
    :host {
      font-family: ${fonts.bold};
    }
  `,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      width: 50%;
    }
  `,

  divider: css`
    :host {
      font-family: ${fonts.regular};
      margin: 0 8px;
    }
  `,

  earnings(status) {
    return css`
      :host {
        color: ${status === k.DOWNLOADED_PUBLISHED ? 'black' : colors.araGrey};
        font-family: ${fonts.regular};
      }
    `
  },

  peers: css`
    :host {
      font-family: ${fonts.regular};
    }
  `,

  stats: css`
    :host {
      display: flex;
      justify-content: flex-end;
    }
  `
}
