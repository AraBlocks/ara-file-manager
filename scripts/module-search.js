
/*
See every place a module is mentioned in package.json files
Searches this package.json, and all of them in node_modules, no matter how deep
Currently looks just at the name and the dependencies, not development dependencies
Pass a module name, or blank to search the whole list below

$ node ./scripts/module-search.js module-name
$ node ./scripts/module-search.js
*/

const fs = require('fs');
const util = require('util');
const path = require('path');

let everything = `
ara-analytics
ara-base-dcdn
ara-console
ara-context
ara-contracts
ara-crypto
ara-file-manager
ara-file-manager-testnet
ara-filesystem
ara-identity
ara-identity-archiver
ara-identity-credentials
ara-identity-dns
ara-identity-resolver
ara-identity-server
ara-identity-services
ara-integration-tests
ara-keyring-registry
ara-keyring-registry-cli
ara-module-template
ara-network
ara-network-node-dht
ara-network-node-dns
ara-network-node-signalhub
ara-privatenet
ara-reward-dcdn
ara-reward-protocol
ara-runtime-configuration
ara-secret-storage
ara-util
canonical-configuration
cfsnet
cfsnet-protocol-buffers
cfsnet-protocol-tests
dcdn-http-gateway
did-document
did-document-public-key
did-universal-resolver-driver
did-universal-resolver-resolution
did-uri
eslint-config-ara
has-did-method
ld-cryptosuite-registry
multidrive
random-access-contract
reward-protocol-buffers
tara-token
testnet-faucet
`;

if (!process.argv[2]) { // Search the whole list above, one after another
	let a = everything.split(/\r?\n/);
	a.forEach(line => {
		if (line.trim().length) {
			search(line);
			console.log();
		}
	});
} else { // Just search the one module name the user typed
	search(process.argv[2]);
}

let searched; // Count how many package.json files we open on a single search
function search(searchTerm) {
	console.log(`Searching for ${searchTerm}...\r\n`);
	searched = 0;
	recursiveSpelunker(".", searchTerm);
}
console.log(`\r\nSearched ${searched} package.json files`); // Say how many at the very end

// Search the given folder to find and count files and subfolders
function recursiveSpelunker(folderPath, searchTerm) {
	fs.readdirSync(folderPath, {withFileTypes: true}).forEach(foundItem => {
		let foundPath = path.join(folderPath, foundItem.name);
		countItem(folderPath, foundPath, foundItem, searchTerm);
		if (foundItem.isDirectory()) {
			recursiveSpelunker(foundPath, searchTerm);
		}
	});
}

// Each time we find a file or folder, examine it here
function countItem(folderPath, foundPath, foundItem, searchTerm) {
	if (foundItem.isFile() && foundItem.name == "package.json") {
		searched++;
		let p = JSON.parse(fs.readFileSync(foundPath, 'utf8'));
		if (p.name == searchTerm) {
			console.log(`is    "${p.name}" version "${p.version}" in ${foundPath} `);
		}
		for (let i in p.dependencies) {
			if (i == searchTerm) console.log(`needs "${i}" version "${p.dependencies[i]}" in ${foundPath} `);
		}
	}
}
