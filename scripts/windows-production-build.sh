#!/bin/bash

echo "${BASH_SOURCE[0]}"

ANALYTICS_CONSTANTS=./lib/constants/analytics.js

sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = true"/ "$ANALYTICS_CONSTANTS"

electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_prod.ico \
--prune=true \
--out=release-builds \

sed -i.bak s/"const IS_PRODUCTION = "[[:print:]]*/"const IS_PRODUCTION = false"/ "$ANALYTICS_CONSTANTS"

DEBUG=electron-windows-installer:main node ./scripts/winstaller.js