 describe("Testing Ara Button Generator", function () {
  let btn
  const araButtonClass = "ara-button"
  const araButtonTarget = "ara-buttons"
  const araButtonGenerator = new AraButtonGenerator("wss://echo.websocket.org")
  const item = JSON.stringify({
    title: 'The Room',
    license: 5,
    description: 'The best movie ever!',
    price: 33
  })

  before(function() {
    btn = araButtonGenerator.makeButton(item, araButtonTarget, araButtonClass)
    btn.innerHTML = "ARA"
  })

  it("should init one ara button with correct class", function () {
    const buttons = document.getElementsByClassName(araButtonClass)
    expect(buttons.length).to.be.equal(1)
  })

  it("should add one ara button to target", function () {
    const buttonsGroup = document.getElementsByClassName(araButtonTarget)
    expect(buttonsGroup.length).to.be.equal(1)
  })

  it("should send license on click", function (done) {
    araButtonGenerator.onopen = () => { btn.click() }
    araButtonGenerator.onmessage = function (evt) { 
      const received_msg = evt.data
      expect(evt.data).to.be.equal(item)
      done()
    }
  })
})