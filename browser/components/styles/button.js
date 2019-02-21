const {
  fontSelector,
  colors,
  fonts,
  fontSize,
} = require('css-constants')

const { css } = require('css')

module.exports = (opts) => {
  return css`
      :host {
        background-color: ${opts.backgroundColor || colors.blue[0]};
        color: ${opts.color || colors.white[0]};
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize(opts.relativeFontSize || 1)}
        transition: all 100ms;
        cursor: default;
        -webkit-app-region: no-drag;
      }
    `
}
