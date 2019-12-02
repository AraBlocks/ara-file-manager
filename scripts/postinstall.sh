#!/bin/bash
echo 'postinstall.sh ---- start'
echo ''

# Remove faulty utp-native
echo 'ls utp-native before rm:'
ls ./node_modules/@hyperswarm/network/node_modules/utp-native
rm -r ./node_modules/@hyperswarm/network/node_modules/utp-native
echo 'ls utp-native after rm:'
ls ./node_modules/@hyperswarm/network/node_modules/utp-native
#TODO this does delete something, and it is necessary
#     update and unify our use of UTP so we can get rid of this extra step

# Remove contracts
# rm -r ./node_modules/ara-contracts/contracts
#TODO this was already commented out
#     make a note about it or just get rid of it entirely

echo ''
echo 'postinstall.sh ---- done, but more happens asynchronously'
echo ''
