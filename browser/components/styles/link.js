const { colorSelector, fontSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
  standard({
    fontSize = '14',
    color  = 'green',
    weight = 'bold',
    height = '36'
  }) {
    return css`
      :host {
        cursor: pointer;
        position: 'absolute';
        padding: '4px';
        width: '81px';
        left: '224px';
        top: '150px';
        color: ${colorSelector(color)};
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: ${height}px;
        -webkit-app-region: no-drag;
      }

      :host:hover {
        color: ${colorSelector(color, true)};
      }
    `
  }
}