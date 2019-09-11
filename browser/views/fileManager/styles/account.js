const { css }  = require('css')

module.exports = {
  container: css`
    :host {
      cursor: pointer;
      display: flex;
      height: 44px;
      width: 95%;
      justify-content: space-between;
      padding: 10px 2.5% 0 2.5%;
      -webkit-app-region: no-drag;
    }

    :host:hover {
      background-color: #eeeeee;
    }
  `,

  fileDescriptorHolder: css`
    :host {
      min-width: 220px;
    }
  `,

  mainContainer: css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 0 15px 40px;
    }

    :host:hover {
      background-color: var(--ara-teal);
    }
  `
}
