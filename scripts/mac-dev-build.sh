#!/bin/bash
echo 'Packaging dev build'

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara_dev.icns \
--prune=true \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"

./node_modules/.bin/electron-osx-sign ./release-builds/ara-file-manager-darwin-x64/ara-file-manager.app/ --identity='Developer ID Application: Little Star Media, Inc. (HXEASF63SW)'
