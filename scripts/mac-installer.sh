#!/bin/bash

VERSION=$(jq '.version' package.json | sed -e 's/^"//' -e 's/"$//')

./node_modules/.bin/electron-installer-dmg ./release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app ara-file-manager-"$VERSION" \
  --out ./release-builds/ \
  --icon=./build/icons/mac/ara_DMG.icns \
  --overwrite