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
    araGreen: 'var(--ara-green)',
    araGrey: '#cbcbcb',
    araLightBlack: '#444444',
    araRed: '#fc2636',
    araPink: '#fbe6e6',
    araOrange: 'var(--ara-orange)',
    araTeal: 'var(--ara-teal)'
  },

  buttonSelector(type, opts = {}) {
    let styleOpts
    switch (type) {
      case 'cancel':
        styleOpts = {
          children: 'Cancel',
          cssClass: {
            name: 'smallInvisible',
            opts: {
              color: 'orange',
              weight: 'light',
            }
          }
        }
        break
      case 'blue':
      styleOpts = {
          cssClass: {
            opts: {
              color: 'blue'
            }
          }
        }
      case 'green':
      styleOpts = {
          cssClass: {
            opts: {
              color: 'green'
            }
          }
        }
      default:
    }

    Object.assign(styleOpts.cssClass.opts, opts)
    return styleOpts
  },

  colorSelector(color, hoverState = false) {

    let selectedColor
    switch (color) {
      case 'black':
        selectedColor = '#000000'
        break
      case 'blue':
        selectedColor = !hoverState ? 'var(--ara-blue)' : '#005ed9'
        break
      case 'grey':
      case 'gray':
        selectedColor = 'var(--ara-grey)'
        break
      case 'green':
        selectedColor = !hoverState ? 'var(--ara-green)' : '#66923c'
        break
      case 'light black':
        selectedColor = '#444444'
        break
      case 'orange':
        selectedColor = !hoverState ? 'var(--ara-orange)' : '#b36348'
        break
      case 'red':
        selectedColor = !hoverState ? 'var(--ara-red)' : '#e50112'
        break
      case 'teal':
        selectedColor = !hoverState ? 'var(--ara-teal)' : '#3c999c'
        break
      case 'pink':
        selectedColor = '#fbe6e6'
        break
      default:
        selectedColor = !hoverState ? 'var(--ara-red)' : 'green'
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
        font-family: ProximaNova-Black;
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