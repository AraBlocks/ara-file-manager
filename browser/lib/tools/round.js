'use strict'

module.exports = {
  roundDecimal(number, place){
    return Math.round(number * place) / place
  }
}