#!/bin/bash
echo 'postinstall.sh ---- start'
echo ''

# Remove faulty utp-native
rm -r ./node_modules/@hyperswarm/network/node_modules/utp-native
#TODO make a note about this, is it still necessary?

# Remove contracts
# rm -r ./node_modules/ara-contracts/contracts
#TODO this is commented out, make a note about it or just get rid of it entirely

echo 'postinstall.sh ---- done'
echo ''
