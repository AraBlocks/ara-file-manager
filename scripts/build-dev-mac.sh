#!/bin/bash
echo 'build dev mac ---- start'
echo ''

# Package
echo 'Using electron-packager, should take around 1 minute...'
./node_modules/.bin/electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara_dev.icns \
--prune=true \
--asar \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"
echo '...done. Now release-builds has a darwin folder with a .app folder inside'
echo ''

# Sign
echo 'Skipping electron-osx-sign step'
# If you've got a code signing certificate in your keychain, uncomment the line below to sign the .app folder
#./node_modules/.bin/electron-osx-sign ./release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app/ --identity='Developer ID Application: Little Star Media, Inc. (HXEASF63SW)'
echo ''

echo 'build dev mac ---- done'
echo ''
