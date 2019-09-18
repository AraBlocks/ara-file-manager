const { css }  = require('css')

module.exports = {
  mainContainer(current) {
    return css`
      :host {
        cursor: pointer;
        display: flex;
        position: relative;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px 40px 15px 40px;
        background-color: ${current ? `var(--ara-teal)` : '' }

      }

      :host:hover {
        background-color: ${current ? `var(--ara-darkteal)` : `var(--ara-grey)`};
        z-index: ${current ? 100 : 0 }
      }
    `
  },

  container: css`
    :host {
      cursor: pointer;
      display: flex;
      position: absolute;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
      padding: 3px;
      z-index: 100;
    }
  `
}
