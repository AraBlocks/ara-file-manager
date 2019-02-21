const { stateManagement: k } = require('k')
const {
  colors,
  colorSelector,
  fonts
} = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,

  bolden: css`
    :host {
      font-family:${fonts.bold};
    }
  `,

  container(status, shouldBroadcast) {
    const color = status === k.DOWNLOADED_PUBLISHED && shouldBroadcast ? 'black' : 'grey'
    return css`
      :host {
        align-items: flex-end;
        color: ${colorSelector(color)};
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    `
  },

  divider: css`
    :host {
      margin: 0 8px;
    }
  `,

  iconHolder: (shouldBroadcast) => css`
    :host {
      margin-left: 5px;
      width: 11px;
      ${!shouldBroadcast && 'opacity: .3;'}
    }
  `,

  price: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 14px;
      margin-bottom: 8px;
    }
  `,

  stats: css`
    :host {
      display: flex;
      font-family: ${fonts.regular};
      font-size: 12px;
      justify-content: flex-end;
    }
  `
}