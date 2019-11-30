#!/bin/bash
echo 'postinstall.sh ---- start'
echo ''

# Remove faulty utp-native
ls ./node_modules/@hyperswarm/network/node_modules/utp-native
rm -r ./node_modules/@hyperswarm/network/node_modules/utp-native
ls ./node_modules/@hyperswarm/network/node_modules/utp-native
#TODO make a note about this, is it still necessary?
#     added ls before and after to see if it is even deleting anything
#TODO also, electron-builder may install-app-deps without needing to tell it to in postinstall
#     so you may not need any of this anymore

# Remove contracts
# rm -r ./node_modules/ara-contracts/contracts
#TODO this is commented out, make a note about it or just get rid of it entirely

echo ''
echo 'postinstall.sh ---- done, but more happens asynchronously'
echo ''
