#!/bin/bash

echo 'Packaging production build'

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara.icns \
--prune=true \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"

.node_modules/.bin/electron-osx-sign ./release-builds/ara-file-manager-darwin-x64/Ara\ File\ Manager.app/ --identity='Developer ID Application: Little Star Media, Inc. (HXEASF63SW)'

zip -r release-builds/ara-file-manager-darwin-x64/ara-file-manager.zip release-builds/ara-file-manager-darwin-x64/Ara\ File\ Manager.app

npm run mac-installer
