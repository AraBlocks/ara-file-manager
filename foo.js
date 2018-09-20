const debug = console.log
const path = require('path')
const fs = require('fs')
const userHome = require('user-home')
function getAcmFilePath() {
  // const { account: { userAid } } = store
  const userAid = 'did:ara:4156c6f5b852547a6c5e51699bffda1e500dfbe936dd18283aee164e01c0b53b'
	if (userAid == null) {
		debug('User has not logged in')
		return null
	}
	const acmDirectory = path.resolve(userHome, '.acm')
	fs.existsSync(acmDirectory) || fs.mkdirSync(acmDirectory)
	const fileDirectory = path.resolve(userHome, '.acm', userAid.slice(-64))
	return fileDirectory
}

async function getPublishedItems() {
	return new Promise((resolve, reject) => {
		const fileDirectory = getAcmFilePath()
		if (fileDirectory == null) return
		fs.readFile(fileDirectory, function (err, data) {
			if (err) return resolve([])
			const itemList = data.toString('utf8').slice(0, -1).split('\n')
			debug(`Retrieved %s published items`, itemList.length)
			return resolve(itemList)
		})
	})
}

async function removedPublishedItem(contentDID) {
  const items = await getPublishedItems()
  const clean = items.filter(did => did !== contentDID)
  const fileDirectory = getAcmFilePath()
  fs.unlinkSync(fileDirectory)
  if (clean.length) {
    clean.forEach(did => fs.appendFileSync(fileDirectory, `${did}\n`))
  }
  return clean
}
// getPublishedItems().then(debug)
removedPublishedItem('f9a1ac57e5e3b6c15a57a55a744553ec183231176541e27e3c44aa725257ac80')