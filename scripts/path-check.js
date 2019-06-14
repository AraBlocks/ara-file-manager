
/*
Paths on Windows used to be limited to MAX_PATH 260 characters

Some apps that deal with longer paths on Windows are:
-npm, which regularly makes super long paths nesting node_modules within node_modules within node_modules
-Node and its fs module
-Git Bash from git-scm.com, with bash commands like '$ find node_modules'
-Third-party Windows utility apps like 7zip, XYplorer, and SpaceSniffer

Some apps that unfortunately don't are:
-Amazingly, the File Explorer app that ships with Windows 10
-electron-winstaller, which won't be able to build a setup.exe if node_modules is too deep

So, here's a script that can take a look at your node_modules path depth situation
Pass it a folder name like node_modules to look in that folder

$ node ./scripts/path-check.js node_modules
*/

const fs = require('fs');
const util = require('util');
const path = require('path');

// Look at the given folder, and tabulate the following results
let startPath = path.resolve(process.argv[2]);
let results = {
	size: 0n, // Total size of all the files we find, a bigint just in case
	files: 0, // Total count of files
	folders: 0, // Total count of folders
	longest: "", // Longest path found
	over150: [], // Paths longer than 150, 200, and 260 characters
	over200: [],
	over260: [], // Windows MAX_PATH violation!
	multiple: [], // multiple[2] lists the paths 2 node_modules deep, [3] for 3, and so on
};

console.log(`Searching '${startPath}'...`);
recursiveSpelunker(startPath);

// Search the given folder to find and count files and subfolders
function recursiveSpelunker(folderPath) {
	fs.readdirSync(folderPath, {withFileTypes: true}).forEach(foundItem => {
		let foundPath = path.join(folderPath, foundItem.name);
		countItem(folderPath, foundPath, foundItem);
		if (foundItem.isDirectory()) {
			recursiveSpelunker(foundPath);
		}
	});
}

// Each time we find a file or folder, count it here, adding it to our results
function countItem(folderPath, foundPath, foundItem) {

	if (foundPath.length > results.longest.length) results.longest = foundPath;

	if      (foundPath.length > 260) results.over260.push(foundPath);
	else if (foundPath.length > 200) results.over200.push(foundPath);
	else if (foundPath.length > 150) results.over150.push(foundPath);

	if (foundItem.isFile()) {

		results.files++;
		let stats = fs.statSync(foundPath, {bigint: true});
		results.size += stats.size;

	} else if (foundItem.isDirectory()) {

		results.folders++;

		// Count how many times the path we found contains the name node_modules
		let count = (foundPath.match(/node_modules/g) || []).length;
		if (count > 1 && foundItem.name == "node_modules") {
			if (!results.multiple[count]) results.multiple[count] = [];
			results.multiple[count].push(foundPath);
		}
	}
}

// Compose text like 0 names, 1 name, 2 names, 1,234 names
function things(n, name) {
	if (!n) return `${n} ${name}s`;
	else if (n == 1) return `${n} ${name}`;
	else return `${(n+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${name}s`; // Add commas like 12,345
}

// Return a string with each line of the given array on a new line
function listArray(a) {
	let s = "";
	a.forEach(p => { s += p + "\r\n" });
	return s;
}

// Compose text to list the nested node_modules folders
function logMultiple() {
	let s = "";
	for (let i = 2; i < results.multiple.length; i++) {
		s += `${things(results.multiple[i].length, "path")} at ${i} node_modules deep:

${listArray(results.multiple[i])}
`
	}
	return s;
}

// Log the results out for the user
console.log(`...done

${things(results.over150.length, "path")} at more than 150 characters:

${listArray(results.over150)}
${things(results.over200.length, "path")} at more than 200 characters:

${listArray(results.over200)}
${things(results.over260.length, "path")} at more than 260 MAX_PATH characters:

${listArray(results.over260)}
${logMultiple()}The longest path is ${things(results.longest.length, "character")}:

${results.longest}

${things(results.over150.length, "path")} at more than 150 characters
${things(results.over200.length, "path")} at more than 200 characters
${things(results.over260.length, "path")} at more than 260 MAX_PATH characters

${things(results.folders, "folder")}
${things(results.files, "file")}
${things(results.size, "byte")}`);
