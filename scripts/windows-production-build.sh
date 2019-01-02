#!/bin/bash

echo "${BASH_SOURCE[0]}"

ANALYTICS_CONSTANTS=./lib/constants/analytics.js

sed -i.bak s/"UA_ACCOUNT_CURRENT:"[[:print:]]*/"UA_ACCOUNT_CURRENT: UA_ACCOUNT_PRODUCTION"/ "$ANALYTICS_CONSTANTS"

electron-packager . \
--overwrite \
--platform=win32 \
--arch=x64 \
--icon=./build/icons/windows/ara_dev.ico \
--prune=true \
--out=release-builds \

sed -i.bak s/"UA_ACCOUNT_CURRENT:"[[:print:]]*/"UA_ACCOUNT_CURRENT: UA_ACCOUNT_STAGING"/ "$ANALYTICS_CONSTANTS"
