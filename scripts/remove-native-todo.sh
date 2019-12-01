#!/bin/bash

# This file isn't run, it's a TODO
# The old build system removed the files below, perhaps unnecessarily
# So, either determine that you don't need to, or remove them in the new system
# or better yet, fix it so you don't have to remove anything

# Currently in postinstall.sh, but would like to remove it:
rm -r ./node_modules/@hyperswarm/network/node_modules/utp-native
# rm -r ./node_modules/ara-contracts/contracts
# ^ This line is already commented out, included here just for additional context

# Previously at the start of build-prod-win.sh:
shopt -s extglob
rm -rf node_modules/fd-lock/prebuilds/!(win32-x64)
rm -rf node_modules/sodium-native/prebuilds/!(win32-x64)
rm -rf node_modules/turbo-net/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)
rm -rf node_modules/utp-native/prebuilds/!(win32-x64)
