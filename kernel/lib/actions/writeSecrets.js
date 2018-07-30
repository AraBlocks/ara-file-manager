'use strict'
const fs = require('fs')
const path = require('path');
const userHome = require('user-home')

function writeFile(sourcePath, targetPath) {
	fs.readFile(sourcePath, (err, data) => {
		if (err) throw err;
		fs.writeFile(targetPath, data, (err) => {
			if (err) throw err;
		})
	})
}

function writeSecrets() {
	const secretDirectory = path.join('.', 'kernel', 'secrets')
	fs.readdir(secretDirectory, (err, keys) => {
		if (err) throw err;
		for (const key of keys) {
			const sourcePath = path.join('.', 'kernel', 'secrets', key)
			const targetPath = path.join(userHome, '.ara', 'secrets', key)
			writeFile(sourcePath, targetPath)
		}
	})

	const ararcSource = path.join('.', '.ararc')
	const ararcTarget = path.join(userHome, '.ararc')
	writeFile(ararcSource, ararcTarget)
}

module.exports = writeSecrets
