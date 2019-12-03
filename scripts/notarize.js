
console.log("notarize.js ---- start");

// Load environment variables from a .env file into process.env
require("dotenv").config();

const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {

	// Pull stuff from the given context
	const { electronPlatformName, appOutDir } = context;

	// Make sure we're on macOS
	if (electronPlatformName != "darwin") {
		console.log("notarize.js ---- This isn't macOS, returning without doing anything");
		return;
	}

	// Make sure the user gave us their Apple ID and password for their developer account
	if (!process.env.APPLEID || !process.env.PASSWORD) {
		console.log("notarize.js ---- No Apple ID or password, returning without doing anything");
		console.log("notarize.js ---- Try again with your Apple developer account information, like this:");
		console.log("notarize.js ---- $ APPLEID=yourid PASSWORD=yourpass npm run build");
		return;
	}

	const appName = context.packager.appInfo.productFilename;
	console.log(`notarize.js ---- Notarizing '${appName}' in '${appOutDir}'`);
	console.log(`notarize.js ---- Contacting Apple as '${process.env.APPLEID}' with a ${process.env.PASSWORD.length}-character password`);
	console.log("notarize.js ---- Now electron-notarize will upload the app to Apple's servers for automated analysis");
	console.log("notarize.js ---- This can take several minutes...");

	return await notarize({
		appBundleId: "com.ara.one.araFileManager",
		appPath: `${appOutDir}/${appName}.app`,
		appleId: process.env.APPLEID,
		appleIdPassword: process.env.PASSWORD,
	});
};
