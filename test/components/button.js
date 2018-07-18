'use strict'

const Button = require('../../browser/components/button')
const { expect } = require('chai')

it("should pass", () => {
  const button = new Button({})
  expect(0).to.be.equal(0)
})
