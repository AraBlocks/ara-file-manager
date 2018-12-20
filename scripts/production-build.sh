#!/bin/bash

echo "${BASH_SOURCE[0]}"

ANALYTICS_CONSTANTS=./lib/constants/analytics.js

sed -i.bak s/"UA_ACCOUNT_CURRENT:"[[:print:]]*/"UA_ACCOUNT_CURRENT: UA_ACCOUNT_PRODUCTION"/ "$ANALYTICS_CONSTANTS"

echo 'Adding ararc'
mv ararc.txt .ararc
echo 'Packaging production build'

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara.icns \
--prune=true \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"

sed -i.bak s/"UA_ACCOUNT_CURRENT:"[[:print:]]*/"UA_ACCOUNT_CURRENT: UA_ACCOUNT_STAGING"/ "$ANALYTICS_CONSTANTS"

echo 'Finish packaging, removing .ararc from repo'
mv .ararc ararc.txt