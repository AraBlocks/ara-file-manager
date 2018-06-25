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
    verifyMessageSent(btn, item, done)
  })

  it("should send second license on click", function (done) {
    const item2 = JSON.stringify({
      title: 'The Room 2',
      license: 5,
      description: 'The best movie ever!',
      price: 55
    })

    let btn2 = araButtonGenerator.makeButton(item2, araButtonTarget, araButtonClass)
    verifyMessageSent(btn2, item2, done)
    btn2.remove()
  })

  function verifyMessageSent(btn, item, done) {
    if (araButtonGenerator.readyState == 1) { 
      btn.click() 
    } else {
      araButtonGenerator.onopen = () => { btn.click() }
    }
    araButtonGenerator.onmessage = function (evt) { 
      const received_msg = evt.data
      expect(evt.data).to.be.equal(item)
      done()
    }    
  }
})