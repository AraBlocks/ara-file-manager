#!/bin/bash

shopt -s extglob
rm -rf node_modules/fd-lock/prebuilds/!(win32-x64)
rm -rf node_modules/sodium-native/prebuilds/!(win32-x64)
rm -rf node_modules/turbo-net/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)

electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_prod.ico \
--prune=true \
--out=release-builds \

DEBUG=electron-windows-installer:main node ./scripts/winstaller.js
