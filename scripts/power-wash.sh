#!/bin/bash
echo 'power-wash.sh ---- start'
echo ''
echo 'This will delete package-lock.json, node_modules, and dist'
read -p "Are you sure? [y/n]" -n 1 -r
echo ''
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo 'This may take a minute...'
echo ''

rm -rf ./package-lock.json
rm -rf ./node_modules
rm -rf ./dist

ls ./package-lock.json
ls ./node_modules
ls ./dist

echo ''
echo 'Now you can do a fresh $ npm install'
echo ''
echo 'power-wash.sh ---- done'
echo ''
fi
