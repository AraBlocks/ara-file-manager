const { css } = require('css')

const fonts = {
  black: `"ProximaNova-Black", sans-serif`,
  bold: `"ProximaNova-Bold", sans-serif`,
  boldSpecial: `"NoeDisplay-Bold", "ProximaNova-Bold"`,
  light: `"ProximaNova-Light", sans-serif`,
  regular: `"ProximaNova-Regular", sans-serif`,
  semibold: `"ProximaNova-Semibold", sans-serif`,
}

const colors = {
  araBlue: '#1e7dfa',
  araGreen: '#70A241',
  araGrey: '#cbcbcb',
  araLightBlack: '#444444',
  araRed: '#fc2636',
  araPink: '#fbe6e6',
  araOrange: '#f58761',
  araTeal: '#50BABE',
  araBlack: '#000000',
  araDarkGrey: '#66923c'
}

module.exports = {
  fonts,
  colors,
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
    return styleOptsi
  },

  colorSelector(color, hoverState = false) {
    switch (color) {
      case 'black':
        return colors.araBlack
      case 'blue':
        return !hoverState ? colors.araBlue : '#005ed9'
      case 'dark-grey':
      case 'light black':
        return colors.araDarkGrey
      case 'grey':
      case 'gray':
        return colors.araGrey
      case 'green':
        return !hoverState ? colors.araGreen : '#66923c'
      case 'orange':
        return !hoverState ? colors.araOrange : '#b36348'
      case 'red':
        return !hoverState ? colors.araRed : '#e50112'
      case 'teal':
        return !hoverState ? colors.araTeal : '#3c999c'
        break
      case 'pink':
        return '#fbe6e6'
      default:
        return !hoverState ? colors.araRed : colors.araGreen
    }
  },

  fontSelector(fontType) {
    return fonts[fontType]
  },

  fontCSS: {
    'h1-noe':  css`
      :host {
        font-family: ${fonts.black};
        font-size: 24px;
      }
    `,

    'hero': css`
      :host {
        font-family: ${fonts.bold};
        font-size: 48px;
      }
    `,
    'h1-proxi': css`
      :host {
        font-family: ${fonts.bold};
        font-size: 24px;
      }
    `,
    'h2-proxi': css`
    :host {
      font-family: ${fonts.bold};
      font-size: 15px;
    }
  `,
    'text-proxi': css`
      :host {
        font-family: ${fonts.light};
        font-size: 12px;
      }
    `,
  }
}
