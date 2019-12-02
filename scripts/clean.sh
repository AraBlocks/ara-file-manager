#!/bin/bash
echo 'clean.sh ---- start'
echo ''
echo 'Deleting the dist folder'
echo ''

rm -rf ./dist

ls ./dist

echo ''
echo 'Now you can do a fresh $ npm run build'
echo ''
echo 'clean.sh ---- done'
echo ''
