'use strict'
const fs = require('fs')
const path = require('path');
const userHome = require('user-home')
const { app } = require('electron')

function writeFile(sourcePath, targetPath, fileName) {
	if (!fs.existsSync(`${userHome}/${fileName}`)) {
		console.log(`writing ${fileName} to ${userHome}`)
		const src = fs.readFileSync(sourcePath)
		console.log({sourcePath})
		fs.writeFileSync(`${targetPath}/${fileName}`, src)
		return null
	}
	console.log(`${fileName} already exists at ${userHome} - no need to write`)
}

function writeToHome(sourcePath) {
	const [ path ] = sourcePath
	const fileName = path.slice(path.lastIndexOf('/') + 1)
	return writeFile(path, userHome, fileName)
}

function writeSecrets() {
	// const secretDirectory = path.join('.', 'kernel', 'secrets')
	// fs.readdir(secretDirectory, (err, keys) => {
	// 	if (err) throw err;
	// 	for (const key of keys) {
	// 		const sourcePath = path.join('.', 'kernel', 'secrets', key)
	// 		const targetPath = path.join(userHome, '.ara', 'secrets', key)
	// 		writeFile(sourcePath, targetPath)
	// 	}
	// })
	const ararcSource = app.getAppPath() + '/.ararc'//path.resolve(__dirname, '.ararc')
	console.log({__dirname})
	console.log({ararcSource})
	// const ararcSource = path.resolve(__dirname, '../..', '.ararc')
	const ararcTarget = path.join(userHome, '.ararc')
	writeFile(ararcSource, ararcTarget)
}

module.exports = {
	writeSecrets,
	writeToHome
}
