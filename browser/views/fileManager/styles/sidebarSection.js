const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  header(clickable){
    return css`
      :host {
        background-color: #1c1c1c;
        font-family: ${fonts.bold};
        color: white;
        font-size: 14px;
        height: 30px;
        padding: 8% 10% 0 10%;
        position: sticky;
        top: 0px;
        z-index: 500;
      }

      ${clickable &&
        `:host:hover {
          cursor: pointer;
          font-size: 14px;
        }`
      }
    `
  },
}
