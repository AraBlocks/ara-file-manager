const { argv } = require('yargs')
const identityArchiver = require('ara-network-node-identity-archiver')
const identityResolver = require('ara-network-node-identity-resolver')

void async function startArchiver() {
  try { await identityArchiver.configure({key: 'archiver'}, require('yargs')) }
  catch (err) { await identityArchiver.configure(null, require('yargs')) }
  try {
    await identityArchiver.start(argv)
  } catch (e) {
    console.log({e})
  }
}()

void async function startResolver() {
	try { await identityResolver.configure({key: 'resolver'}, require('yargs')) }
  catch (err) { await identityResolver.configure(null, require('yargs')) }
  try {
    await identityResolver.start(argv)
  } catch (e) {
    console.log({e})
  }
}()