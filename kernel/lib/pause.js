module.exports = async (time) => {
  await new Promise(_ => setTimeout(_, time))
}