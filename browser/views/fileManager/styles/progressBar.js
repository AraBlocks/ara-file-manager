const { colorSelector } = require('styleUtils')
const { css } = require('css')
const { events } = require('k')

module.exports = {
  colorSelector,

  holder(status = null) {
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
          content: "${(
            status === events.PURCHASING
              ? 'Purchasing'
              : status === events.PUBLISHING
                ? 'Publishing'
                : 'Connecting'
          )}";
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