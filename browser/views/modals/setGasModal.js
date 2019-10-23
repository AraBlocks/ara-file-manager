const { closeModal, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const Input = require('../../components/input')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ average, fast, fastest, step }) => {
  this.state = {
    gasPrice: 0
  }

  this.oninput = () => {
    return (value) => {
      this.state.gasPrice = value
    }
  }

  const set = new Button({
    children: 'Set Custom Price',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
    onclick: () => {
      emit({ event: events.GAS_PRICE, load: { gasPrice: Number(this.state.gasPrice), step } })
      closeModal('setGasModal')
    }
  })
  const exit = new Button({
    children: 'Exit',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'darkteal' } },
    onclick: () => closeModal('setGasModal')
  })
  const customGas = new Input({
    placeholder: '0',
    cssClass: { name: 'customGasPrice' },
    type: 'number',
    oninput: this.oninput('gasPrice'),
    color: 'light-grey'
  })

  return html`
    <div class="${styles.container({ justifyContent: 'initial', height: 97, width: 90 })} modals-container">
      <div class="${styles.title} modal-messageBold">
        Set Gas Price
      </div>
      <div class="${styles.separator} section-separator"></div>
      <div style="margin: 5% 0;">
        <div class="${styles.gasPriceHolder({})}" onclick="${() => {
          this.state.gasPrice = fastest
          emit({ event: events.GAS_PRICE, load: { gasPrice: Number(this.state.gasPrice), step } })
          closeModal('setGasModal')
        }}">
          <div class="${styles.gasPrice({})}">Fastest</div>
          <div class="${styles.gasPrice({ float: 'right', bold: false })}">${fastest} Gwei</div>
        </div>
        <div class="${styles.gasPriceHolder({ color: 'teal'})}" onclick="${() => {
          this.state.gasPrice = fast
          emit({ event: events.GAS_PRICE, load: { gasPrice: Number(this.state.gasPrice), step } })
          closeModal('setGasModal')
        }}">
          <div class="${styles.gasPrice({})}">Fast</div>
          <div class="${styles.gasPrice({ float: 'right', bold: false })}">${fast} Gwei</div>
        </div>
        <div class="${styles.gasPriceHolder({ color: 'darkteal' })}" onclick="${() => {
          this.state.gasPrice = average
          emit({ event: events.GAS_PRICE, load: { gasPrice: Number(this.state.gasPrice), step } })
          closeModal('setGasModal')
        }}">
          <div class="${styles.gasPrice({})}">Average</div>
          <div class="${styles.gasPrice({ float: 'right', bold: false })}">${average} Gwei</div>
        </div>
      </div>
      <div style="flex-direction: column;">
        ${customGas.render()}
        <div class="${styles.lightLabel}" style="float: right; transform: translate(-10px, -29px);">Gwei</div>
      </div>
      <div style="position: absolute; bottom: 3%;">
        ${set.render()}
        ${exit.render()}
      </div>
    </div>
  `
}
