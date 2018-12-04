'use strict'

const { fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  appInfo: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 88px;
      justify-content: space-around;
      line-height: 15px;
      text-align: center;
    }

    :host .link-holder {
      display: flex;
      justify-content: space-between;
      width: 63%;
    }
  `,

  accountOverview: css`
    :host {
      padding-bottom: 15px;
      border-bottom: 1px solid var(--ara-grey);
    }
  `,

  balanceSection: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      display: flex;
      height: 73px;
      flex-direction: column;
      justify-content: space-between;
      padding: 3px 0 12px 0;
    }

    :host b {
      font-family: ${fonts.black};
    }

    :host span {
      font-family: ${fonts.bold};
    }

    :host span.balance {
      font-size: 27px;
    }

    :host span.ethBalance {
      color: var(--ara-grey);
    }
  `,

  banner: css`
    :host {
      font-family:${fonts.black};
      font-size: 21px;
      margin: 15px 0;
    }
  `,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      height: 100%;
      justify-content: space-around;
      padding: 0 15px;
      word-wrap: break-word;
    }
  `,

  closeBtnHolder: css`
    :host {
      left: 90%;
      position: absolute;
      top: 3%;
    }
  `,

  contentHolder: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      display: flex;
      flex-direction: column;
      height: 420px;
      justify-content: space-between;
    }
  `,

  copyableText: css`
    :host {
      border-radius: 7px;
      cursor: pointer;
      margin-bottom: 5px;
      padding: 0 6px;
      transition: all ease-in-out;
    }
  `,

  idHolder: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      height: 120px;
      padding-top: 10px
    }

    :host .container {
      height: 105px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    :host .did {
      color: var(--ara-teal);
      font-family: ${fonts.bold};
      font-size: 14px;
      margin-top: 8px;
    }

    :host .eth {
      color: var(--ara-green);
      font-family: ${fonts.bold};
      font-size: 14px;
      margin-top: 8px;
    }
  `,

  interactiveSection: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 170px;
      justify-content: space-between;
      padding: 12px 0 20px 0;
    }

    :host .request-container {
      display: flex;
      flex-direction: column;
      height: 90px;
      justify-content: space-between;
    }

    :host .send-container {
      display: flex;
      flex-direction: column;
      height: 60px;
      justify-content: space-between;
    }
  `
}