#!/bin/bash
echo 'Packaging dev build'

./node_modules/.bin/electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_dev.ico \
--prune=true \
--out=release-builds \
--protocol=ara
