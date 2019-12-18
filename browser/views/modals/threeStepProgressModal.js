const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, stepOneHash, stepTwoHash, stepThreeHash, step, network, retryEvent, stepNames }) => {
  const stepOneLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      stepOneHash ?
        shell.openExternal(network === 'main' ? `https://etherscan.io/${stepOneHash}` : `https://ropsten.etherscan.io/tx/${stepOneHash}`) :
        null
    }
  })
  const stepTwoLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      stepTwoHash ?
        shell.openExternal(network === 'main' ? `https://etherscan.io/${stepTwoHash}` : `https://ropsten.etherscan.io/tx/${stepTwoHash}`) :
        null
    }
  })
  const stepThreeLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      stepThreeHash ?
        shell.openExternal(network === 'main' ? `https://etherscan.io/${stepThreeHash}` : `https://ropsten.etherscan.io/tx/${stepThreeHash}`) :
        null
    }
  })
  const exit = new Button({
    children: 'Exit',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
    onclick: () => closeModal('threeStepProgressModal')
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100, useSelector: false })} modals-container">
      <div class="${styles.title} modal-messageBold">
        ${modalName}...
      </div>
      <div class="${styles.separator} section-separator" style="width: 90%;"></div>
      <div class="${styles.threeStepProgressContainer}">
        <div class="${styles.stepOne}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('One') ? spinnerBar() : html`<div class="${styles.circle({ color: 'green' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            ${stepNames[1]}
          </div>
          <div>
            ${stepOneLink.render()}
          </div>
          ${'retryStepOne' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('threeStepProgressModal')
              emit({ event: retryEvent, load: { step: 'stepOne' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
        <div class="${styles.stepTwo}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('Two') ? spinnerBar() : html`<div class="${styles.circle({ color: step && step.includes('Three') ? 'green' : 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            ${stepNames[2]}
          </div>
          <div>
            ${stepTwoHash ? stepTwoLink.render() : null}
          </div>
          ${'retryStepTwo' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('threeStepProgressModal')
              emit({ event: retryEvent, load: { step: 'stepTwo' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
        <div class="${styles.stepThree}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('Three') ? spinnerBar() : html`<div class="${styles.circle({ color: 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            ${stepNames[2]}
          </div>
          <div>
            ${stepThreeHash ? stepThreeLink.render() : null}
          </div>
          ${'retryStepThree' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('threeStepProgressModal')
              emit({ event: retryEvent, load: { step: 'stepThree' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
      </div>
      <div style="width: 100%;">
        ${exit.render()}
      </div>
    </div>
  `
}
