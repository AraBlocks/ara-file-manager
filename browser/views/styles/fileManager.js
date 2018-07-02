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

  dropbtn: css`
    :host {
      font-size: 16px; 
      font-family: ${fonts.regular};
      border: none;
      outline: none;
      color: white;
      padding: 14px 16px;
      background-color: inherit;
      font-family: inherit; /* Important for vertical align on mobile phones */
      margin: 0; /* Important for vertical align on mobile phones */
    }    
  `,

  dropdownContent: css`
    :host {
      display: none;
      flex-direction: column;
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 120px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }
  `,

  header: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 20px;
      text-align: center;
    }
  `,

  subHeader: css`
    :host {
      font-family: ${fonts.regular};
      font-size: 20px;
      width: 100%;
    }
  `,

  content: css`
    :host {
      font-family: ${fonts.regular};
      font-size: 15px;
      text-align: left;
      width: 100%;
    }
  `,

  price: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 40px;
      text-align: left;
      width: 45%;
    }
  `,

  ara: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 20px;
      text-align: left;
      width: 20%;
    }
  `, 

  verticalContainer: css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: red;
      justify-content: space-between;
      height: 95%;
      padding: 10px;
      align-items: center;
    }
  `,

  verticalContainerSmall: css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: red;
      justify-content: space-between;
      width: 100%;
      height: 75px;
      align-items: center;
    }
  `,

  horizontalContainer: css`
    :host {
      display: flex;
      flex-direction: row;
      background-color: DodgerBlue;
      width: 100%;
    }
  `,  

  centerAlign: css`
    :host {
      justify-content: space-between;
      align-items: center;
    }
  `,  

  bottomAlign: css`
    :host {
      justify-content: flex-start;
      align-items: flex-end;
    }
  `,  

  expandButton: css`
    :host {
      style="width:70px;
      height:auto;
      padding:5px 2px;
      text-align:center;
    }
  `,

  line: css`
    :host {
      width: 100%;
      height: 1px;
      background-color: grey;
    }
  `,
}