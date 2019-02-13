const { css } = require('css')
const { fonts } = require('styleUtils')

module.exports = {
  araID: css`
    :host {
      display: flex;
      justify-content: center;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 98%;
    }
  `,

  araIDHolder: css`
    :host {
      align-items: center;
      background-color: aliceBlue;
      border: 1px solid #97c7f0;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      justify-content: center;
      margin-bottom: 10px;
      padding: 10px 2px;
      height: 5%;
      width: 355px;
    }
  `,

  header: css`
    :host {
      display: flex;
      font-family: ${fonts.black};
      font-size: 20px;
      width: 90%;
    }
  `,

  description: css`
    :host {
      font-family: ${fonts.light};
      font-size: 12px;
      width: 90%;
    }
  `,

  generatingMessage: css`
    :host {
      font-size: 16px;
      color: var(--ara-text-blue);
    }
  `,

  logo: css`
    :host {
      align-content: center;
      display: flex;
      justify-content: center;
    }

    :host > img {
      height: 9px;
    }
  `,

  registerForm: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 160px;
      justify-content: space-between;
      width: 90%;
    }
  `
}