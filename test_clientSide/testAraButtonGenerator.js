 describe("Testing", function () {
  const araButtonClass = "ara-button"
  const araButtonTarget = "ara-buttons"
  const araButtonGenerator = new AraButtonGenerator("wss://echo.websocket.org")

  before(function() {
    const item = JSON.stringify({
      title: 'The Room',
      license: 5,
      description: 'The best movie ever!',
      price: 33
    })
    let btn = araButtonGenerator.makeButton(item, araButtonTarget, araButtonClass)
    btn.innerHTML = "ARA"
  });

  it("should init one ara button", function () {
    const buttons = document.getElementsByClassName(araButtonClass)
    expect(buttons.length).to.be.equal(1);
  });

  it("should add one ara button to target", function () {
    const buttonsGroup = document.getElementsByClassName(araButtonTarget)
    expect(buttonsGroup.length).to.be.equal(1);
  })
});