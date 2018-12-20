#!/bin/bash
echo 'Adding ararc'
mv ararc.txt .ararc
echo 'Packaging dev build'

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara_dev.icns \
--prune=true \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"

echo 'Finish packaging, removing .ararc from repo'
mv .ararc ararc.txt