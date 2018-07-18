'use strict'

const { css } = require('css')

module.exports = {
  fonts: {
    black: `"ProximaNova-Black", sans-serif`,
    bold: `"ProximaNova-Bold", sans-serif`,
    boldSpecial: `"NoeDisplay-Bold", "ProximaNova-Bold"`,
    light: `"ProximaNova-Light", sans-serif`,
    regular: `"ProximaNova-Regular", sans-serif`,
    semibold: `"ProximaNova-Semibold", sans-serif`,
  },

  colors: {
    araBlue: '#1e7dfa',
    araGrey: '#cbcbcb',
    araLightBlack: '#444444',
    araRed: '#fc2636',
  },

  buttonSelector(type) {
    let opts
    switch (type) {
      case 'cancel':
        opts = {
          children: 'Cancel',
          cssClass: {
            name: 'smallInvisible',
            opts: {
              color: 'blue',
              weight: 'light'
            }
          }
        }
        break
      default:
    }
    return opts
  },

  colorSelector(color) {
    let selectedColor
    switch (color) {
      case 'red':
        selectedColor = '#fc2636'
        break
      case 'blue':
        selectedColor = '#1e7dfa'
        break
      case 'grey':
        selectedColor = '#cbcbcb'
        break
      case 'light black':
        selectedColor = '#444444'
        break
      case 'black':
        selectedColor = '#000000'
        break
      default:
        selectedColor = '#fc2636'
    }

    return selectedColor
  },

  fontSelector(font) {
    let selectedFont
    switch (font) {
      case 'black':
        selectedFont = `"ProximaNova-Black", sans-serif`
        break
      case 'bold':
        selectedFont = `"ProximaNova-Bold", sans-serif`
        break
      case 'light':
        selectedFont = `"ProximaNova-Light", sans-serif`
        break
      case 'regular':
        selectedFont = `"ProximaNova-Regular", sans-serif`
        break
      case 'semibold':
        selectedFont = `"ProximaNova-Semibold", sans-serif`
        break
      default:
        selectedFont = `"ProximaNova-Regular", sans-serif`
      }
      return selectedFont
  },

  fontCSS: {
    noeH1:  css`
      :host {
        font-family: "NoeDisplay-Bold", "ProximaNova-Bold";
        font-size: 24px;
      }
    `,
    proxiLarge: css`
      :host {
        font-family: "ProximaNova-Bold", sans-serif;
        font-size: 48px;
      }
    `,
    proxiH1: css`
      :host {
        font-family: "ProximaNova-Bold", sans-serif;
        font-size: 24px;
      }
    `,
    proxiH2: css`
    :host {
      font-family: "ProximaNova-Bold", sans-serif;
      font-size: 15px;
    }
  `,
    proxiContent: css`
      :host {
        font-family: "ProximaNova-Light", sans-serif;
        font-size: 12px;
      }
    `,
  }
}