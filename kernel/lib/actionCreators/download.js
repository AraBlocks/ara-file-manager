'use strict'

const dispatch = require('../reducers/dispatch')
const { download } = require('../actions')
const { DOWNLOAD, DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(DOWNLOAD, async (load) => {
	windowManager.bridge.emit(DOWNLOADING)
	const newState = dispatch({
    type: DOWNLOADING,
    load: {
      purchased: [
				{
					downloadPercent: 0,
					meta: {
						aid: windowManager.fileInfo.aid,
						datePublished: '11/20/1989',
						earnings: 2134.33,
						peers: 353,
						price: windowManager.fileInfo.price,
					},
					name: windowManager.fileInfo.fileName,
					size: 1.67,
					status: 1,
				}
			]
    }
  })
	download({did: load, handler: () => {
		windowManager.bridge.emit(DOWNLOADED)
		const newState = dispatch({
			type: DOWNLOADING,
			load: {
				purchased: [
					{
						downloadPercent: 0,
						meta: {
							aid: windowManager.fileInfo.aid,
							datePublished: '11/20/1989',
							earnings: 2134.33,
							peers: 353,
							price: windowManager.fileInfo.price,
						},
						name: windowManager.fileInfo.fileName,
						size: 1.67,
						status: 2,
					}
				]
			}
		})
	}})
})
