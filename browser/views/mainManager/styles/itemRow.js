'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

  container: css`
    :host {
      align-items: center;
      display: flex;
      justify-content: space-between;
      min-height: 40px;
      overflow: auto;
      padding: 10px 0px;
      width: 100%;
    }
  `,

  detailHolder: css`
  :host {
    color: black;
    display: flex;
    font-family: ${fonts.light};
    font-size: 12px;
    justify-content: space-between;
    width: 100%;
  }
  :host b {
    font-family: ${fonts.bold}
  }
`,

  iconHolder: css`
    :host {
      display: flex;
      justify-content: left;
      width: 12%;
    }
  `,

  name: css`
    :host {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,

  nameHolder: css`
    :host {
      display: flex;
      font-family: ${fonts.bold};
      font-size: 15px;
      width: 75%;
    }
  `,
  
	summaryHolder: css`
    :host {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      width: 88%;
    }
  `,
}