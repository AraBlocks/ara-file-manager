'use strict'

const { colors, fonts } = require('../../lib/styles')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  colors,
  fonts,

  dropdown: css`
    :host {
      overflow: hidden;
      font-family: ${fonts.regular};
    }
  `,

  dropdownButton: css`
    :host {
      font-size: 16px; 
      font-family: ${fonts.regular};
      border: none;
      outline: none;
      color: black;
      background-color: white;
      height: 35px;
      display: flex;
      justify-content: left;
      align-items: center; 
      padding-left: 10px;
    }    
  `,

  dropdownContent: css`
    :host {
      display: none;
      flex-direction: column;
      position: absolute;
      background-color: white;
      width: 115px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      height: 140px;
      justify-content: space-between;
      align-items: space-between;
      border-width: 1px 1px 1px 1px;
      border-color: ${colors.araGrey};
      border-style: solid;
    }
  `,

  menuButton: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 25px;
      justify-content: space-around;
    }
  `,

  menuBar: css`
    :host {
      width: 20px;
      height: 3px;
      background-color: black;
    }
  `
}