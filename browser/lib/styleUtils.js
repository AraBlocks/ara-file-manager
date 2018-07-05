'use strict'

module.exports = {
  fonts: {
    black: `"ProximaNova-Black", sans-serif`,
    bold: `"ProximaNova-Bold", sans-serif`,
    light: `"ProximaNova-Light", sans-serif`,
    regular: `"ProximaNova-Regular", sans-serif`,
    semibold: `"ProximaNova-Semibold", sans-serif`,
  },

  colors: {
    araBlue: '#1e7dfa',
    araGrey: '#cbcbcb',
    araRed: '#fc2636'
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
  }
}