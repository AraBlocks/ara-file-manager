const { create, remove } = require('ara-filesystem')
//test('dc5ef43f73ceef76eead0ed541ddaa716e6c760f90dacf05b9409ac99c82e346')

const files = [
	{
		downloadPercent: 0,
		meta: {
			aid: 'did:ara:fdkgi6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
			datePublished: '11/20/1989',
			earnings: 237.43,
			peers: 1003,
			price: 56.99,
		},
		name: 'Adobe Photoshop',
		size: 10.67,
	},
	{
		downloadPercent: 1,
		meta: {
			aid: 'did:ara:oopd6c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
			datePublished: '11/20/1989',
			earnings: 54.33,
			peers: 33,
			price: 10.99,
		},
		name: 'Microsoft Word',
		size: 4.67,
	},
	{
		downloadPercent: 0,
		meta: {
			aid: 'did:ara:kdi986c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
			datePublished: '11/20/1989',
			earnings: 2134.33,
			peers: 353,
			price: 3.99,
		},
		name: 'Microsoft PowerPoint',
		size: 1.67,
	}
]

function findFile(aid, files) {
	const index = files.findIndex((file) => file.meta.aid === aid)
	if (index !== -1) {
		return files[index]
	}
	return null
}

const file = findFile('did:ara:kdi986c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6', files)
console.log(file)
file.size = 888
// const res = files.findIndex((file) => {
// 	return file.meta.aid === 'i986c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6'
// })
// if(!res) {
// 	files[res].size = 999
// }
console.log(files)
// async function test(did) {
// 	try {
// 		const { afs } = await create({ did })
// 		const result = await afs.readdir(afs.HOME)
// 		console.log(result)
// 		afs.close()
// 		// const instance = await remove({ did, password: 'abc', paths: result })
// 		// instance.close()
// 	} catch(e) {
// 		console.log(e)
// 	}
// }
// test2('2')
// function test2(aid) {
// 	console.log(aid)
// 	aid = '1'
// 	console.log(aid)
// }
