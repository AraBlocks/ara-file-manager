const { colorSelector } = require('styleUtils')
const { css } = require('css')
const { events } = require('k')

module.exports = {
  colorSelector,

  holder(status = null) {
    let text = ''
    switch (status) {
      case events.PURCHASING:
        text = 'Purchasing'
        break
      case events.PUBLISHING:
        text = 'Publishing'
        break
      case events.UPDATING_FILE:
        text = 'Updating'
        break
      default:
        text = 'Connecting'
    }
    return css`
      :host {
        background-color: ${colorSelector('grey')};
        height: 1px;
        width: 100%;
        position: relative;
      }

      :host > div {
        height: 1px;
        transition: width 100ms;
      }

      ${status &&
      `:host::before {
          content: "${text}";
          position: absolute;
          width: 100%;
          top: -18px;
          left: 0;
          display: flex;
          justify-content: center;
          font-size: 14px;
          color: ${colorSelector('dark-grey')};
        }`
      }
    `
  },
}