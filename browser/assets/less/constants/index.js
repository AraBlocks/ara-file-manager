const { css } = require('css')

const fonts = {
  black: `"ProximaNova-Black", sans-serif`,
  bold: `"ProximaNova-Bold", sans-serif`,
  boldSpecial: `"NoeDisplay-Bold", "ProximaNova-Bold"`,
  light: `"ProximaNova-Light", sans-serif`,
  regular: `"ProximaNova-Regular", sans-serif`,
  semibold: `"ProximaNova-Semibold", sans-serif`,
}

const fontWeight = {
  light: 200,
  regular: 500,
  bold: 700
}

const fontSize = (size) => {
  const totalSize = (0.25 * size) + 1

  return `${totalSize}em`
}

const space = (count) => {
  const totalSpace = Math.pow(count, 2) * 0.25

  return `${totalSpace}rem`
}

const colors = {
  blue: [
    'hsl(214.1, 88.0, 95.0)',
  ],
  black: [
    'hsl(0.0, 0.0, 15.0)'
  ],
  red: [
    'hsl(355.5, 84.9, 95.0)'
  ],
  araPink: '#fbe6e6',
  araOrange: 'var(--ara-orange)',
  araTeal: 'var(--ara-teal)'
}

module.exports = {
  buttonSelector(type, opts = {}) {
    let styleOpts
    switch (type) {
      case 'destructive':
        return Object.assign({
          content: 'Cancel',
          color: colors.red[0],
          'font-weight': fontWeight.bold,
        }, opts)
      case 'confirm':
        return Object.assign({
          color: colors.araTeal
        }, opts)
      default:
        return Object.assign({
          color: colors.blue[0]
        }, opts)
    }
  },

  colorSelector(color, hoverState = false) {
    switch (color) {
      case 'black':
        return colors.black[0]
      case 'blue':
        return !hoverState ? colors.blue[0] : colors.blue[1]
      case 'dark-grey':
      case 'light black':
        return colors.black[1]
      case 'grey':
      case 'gray':
        return colors.black[2]
      case 'green':
        return !hoverState ? colors.green[0] : colors.green[1]
      case 'orange':
        return !hoverState ? colors.orange[0] : colors.orange[1]
      case 'red':
        return !hoverState ? colors.red[0] : colors.red[1]
      case 'teal':
        return !hoverState ? colors.teal[0] : colors.teal[1]
        break
      case 'pink':
        return colors.pink[0]
      default:
        return colors.red[0]
    }
  },

  fontSelector(fontType) {
    return fonts[fontType]
  },

  fontCSS: {
    'h1-noe':  css`
      :host {
        font-family: ${fonts.black};
        font-size: ${fontSize(4)};
      }
    `,

    'hero': css`
      :host {
        font-family: ${fonts.bold};
        font-size: ${fontSize(5)};
      }
    `,
    'h1-proxi': css`
      :host {
        font-family: ${fonts.bold};
        font-size: ${fontSize(4)};
      }
    `,
    'h2-proxi': css`
    :host {
      font-family: ${fonts.bold};
      font-size: ${fontSize(2)};
    }
  `,
    'text-proxi': css`
      :host {
        font-family: ${fonts.light};
        font-size: ${fontSize(1)}
      }
    `,
  }
}
