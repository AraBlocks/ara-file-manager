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
    }
  `,

  ellipses(show) {
    return css`
      :host {
        display: ${show ? 'inherit' : 'none' };
        height: 3px;
        padding: 3px;
      }

      img:hover {
        transform: scale(1.2);
      }
    `
  }
}
