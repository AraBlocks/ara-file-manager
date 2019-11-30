#!/bin/bash
echo 'power-wash.sh ---- start'
echo ''

echo 'Deleting node_modules folder may take a minute...'
echo ''

rm -rf ./dist
rm -rf ./release-builds
rm -rf ./node_modules

ls ./dist
ls ./release-builds
ls ./node_modules

echo ''
echo 'power-wash.sh ---- done'
echo ''
