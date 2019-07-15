#!/bin/bash
echo 'build dev win ---- start'
echo ''

# Package
echo 'Using electron-packager, may take around 5 minutes...'
./node_modules/.bin/electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_dev.ico \
--prune=true \
--asar \
--out=release-builds \
--protocol=ara
echo '...done. Now release-builds has a win32 folder with .exe and .dll files inside'
echo ''

echo 'build dev win ---- done'
echo ''
