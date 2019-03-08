#!/bin/bash

VERSION=$(jq '.version' package.json | sed -e 's/^"//' -e 's/"$//')

./node_modules/.bin/electron-installer-dmg ./release-builds/ara-file-manager-darwin-x64/ara-file-manager.app ara-file-manager-"$VERSION" \
  --out ./release-builds/ \
  --icon=./build/icons/mac/ara_DMG.icns \
  --overwrite
