'use strict'
const fs = require('fs')
const path = require('path');
const userHome = require('user-home')

function writeSecretFile(key) {
	const secretPath = path.join('.', 'kernel', 'secrets', key)
	fs.readFile(secretPath, (err, data) => {
		if (err) throw err;
		const secretDirectory = path.join(userHome, '.ara', 'secrets', key)
		fs.writeFile(secretDirectory, data, (err) => {
			if (err) throw err;
			console.log('key saved')
		})
	})
}

function writeSecrets() {
	const secretDirectory = path.join('.', 'kernel', 'secrets')
	fs.readdir(secretDirectory, (err, keys) => {
		if (err) throw err;
		for (const key of keys) {
			writeSecretFile(key)
		}
	})
}

module.exports = writeSecrets
