const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
      :host {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        font-family: ${fonts.light};
        justify-content: space-between;
        position: fixed;
        width: 24.8%;
        background-color: #1c1c1c;

      }
    `,

  logoContainer: css`
    :host {
      position: absolute;
      top: 15px;
      left: 17%;
      transform: scale(1.5, 1.5);
    }
  `,

  sectionContainer: css`
    :host {
      margin-top: 50px;
      animation: fadein 1500ms;
      overflow-y: scroll;
      height: 825px;
    }
  `,
}
