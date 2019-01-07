#!/bin/bash
echo 'Packaging dev build'

electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_dev.ico \
--prune=true \
--out=release-builds \
--protocol=ara \