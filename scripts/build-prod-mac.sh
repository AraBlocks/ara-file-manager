#!/bin/bash
echo 'build prod mac ---- start'
echo ''

# Edit lib/constants/analytics.js to set production to true so the app will send analytics
ANALYTICS_CONSTANTS=./lib/constants/analytics.js
sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = true"/ "$ANALYTICS_CONSTANTS"

# Package
echo 'Using electron-packager, should take around 1 minute...'
./node_modules/.bin/electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara.icns \
--prune=true \
--asar \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"
echo '...done. Now release-builds has a darwin folder with a .app folder inside'
echo ''

# Sign
echo 'Skipping electron-osx-sign step'
# If you've got a code signing certificate in your keychain, uncomment the line below to sign the .app folder
./node_modules/.bin/electron-osx-sign ./release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app/ --identity='Developer ID Application: Little Star Media, Inc. (HXEASF63SW)'
echo ''

# Zip
echo 'Using bash zip, should take around 1 minute...'
zip -r release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.zip release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app
echo '...done, Now alongside the .app folder there is a .zip file'
echo ''

# Edit the file back to false so your development won't send analytics
sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = false"/ "$ANALYTICS_CONSTANTS"

# Installer
# Have bash jq read the version we're making out of package.json
VERSION=$(jq '.version' package.json | sed -e 's/^"//' -e 's/"$//')
echo 'Using electron-installer-dmg, should take around 1 minute...'
./node_modules/.bin/electron-installer-dmg ./release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app ara-file-manager-"$VERSION" \
--out ./release-builds/ \
--icon=./build/icons/mac/ara_DMG.icns \
--overwrite
echo '...done. Now release-builds has a .dmg file'
echo ''

echo 'build prod mac ---- done'
echo ''
