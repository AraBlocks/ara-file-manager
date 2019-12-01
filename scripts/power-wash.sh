#!/bin/bash
echo 'power-wash.sh ---- start'
echo ''

echo 'Deleting package-lock.json, node_modules, and dist'
echo 'This may take a minute...'
echo ''

rm -rf ./package-lock.json
rm -rf ./node_modules
rm -rf ./dist

ls ./package-lock.json
ls ./node_modules
ls ./dist

echo 'Now you can do a fresh $ npm install'
echo ''

echo 'power-wash.sh ---- done'
echo ''
