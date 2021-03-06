const { css } = require('css')
const {
  colorSelector,
  colors,
  fonts,
} = require('styleUtils')

module.exports = {
  container({ disabled, requiredIndicator, color = 'white' }) {
    return css`
      :host {
        align-items: center;
        ${requiredIndicator && 'background-color:' + colorSelector('pink')};
        box-sizing: border-box;
        border: 1px solid var(--ara-grey);
        display: flex;
        justify-content: space-between;
        ${disabled && 'opacity: .4;'}
        width: 100%;
        margin-top: 8px;
        -webkit-app-region: no-drag;
        background-color: ${colorSelector(color)};
      }
    `
  },

  button: css`
    :host {
      background-color: ${colorSelector('teal')};
      color: white;
      font-size: 12px;
      font-family: ${fonts.light};
      height: 25px;
      margin: 10px;
      width: 70px;
    }

    :host:hover {
      background-color: ${colorSelector('teal', true)};
    }
  `,

  icon: css`
    :host {
      background-image:url(../assets/images/ara_token.png);
      background-repeat: no-repeat;
      background-size: 8%;
      background-position-x: 98%;
      background-position-y: 50%;
    }
  `,

  requiredIndicator: css`
    :host {
      background-color: ${colorSelector('pink')};
    }
  `,

  selection: css`
    :host {
      font-size: 12px;
      font-family: ${fonts.bold};
      margin: 5px;
    }
  `,

  standard({ fontSize = '18px' } = {}) {
    return css`
      :host {
        font-size: ${fontSize};
        font-family: ${fonts.light};
        height: 2em;
        text-indent: 10px;
        width: 100%;
      }

      :host::placeholder {
        color: var(--ara-grey);
        text-indent: 10px;
      }
    `
  },

  customGasPrice() {
    return css`
      :host {
        background-color: ${colorSelector('light-grey')};
        height: 12%;
        color: ${colorSelector('dark-grey')};
        text-align: end;
        font-size: 18px;
        width: 81%;
        padding: 10px;
        line-height: 30px;
      }
    `
  }
}
