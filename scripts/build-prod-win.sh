#!/bin/bash
echo 'build prod win ---- start'
echo ''

# Remove some native modules that we might want to rebuild? #TODO
shopt -s extglob
rm -rf node_modules/fd-lock/prebuilds/!(win32-x64)
rm -rf node_modules/sodium-native/prebuilds/!(win32-x64)
rm -rf node_modules/turbo-net/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)

# Edit lib/constants/analytics.js to set production to true so the app will send analytics
ANALYTICS_CONSTANTS=./lib/constants/analytics.js
sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = true"/ "$ANALYTICS_CONSTANTS"

# Package
echo 'Using electron-packager, may take around 5 minutes...'
./node_modules/.bin/electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_prod.ico \
--prune=true \
--asar \
--out=release-builds
echo '...done. Now release-builds has a win32 folder with .exe and .dll files inside'
echo ''

# Edit the file back to false so your development won't send analytics
sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = false"/ "$ANALYTICS_CONSTANTS"

# Installer
echo 'Using electron-winstaller, may take around 5 minutes...'
# There's no progress output, but open Task Manager to watch NuGet and then 7zip heavily use the CPU
# Run our script that uses electron-winstaller, telling it to output some debug messages
DEBUG=electron-windows-installer:main node ./scripts/build-prod-winstaller.js
echo '...done. Now release-builds has a winstalled folder with files inside'

echo 'build prod win ---- done'
echo ''
