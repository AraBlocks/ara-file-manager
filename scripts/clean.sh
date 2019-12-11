#!/bin/bash
echo 'clean.sh ---- start'
echo ''
echo 'This will delete the dist folder'
read -p "Are you sure? [y/n]" -n 1 -r
echo ''
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo ''

rm -rf ./dist

ls ./dist

echo ''
echo 'Now you can do a fresh $ npm run build'
echo ''
echo 'clean.sh ---- done'
echo ''
fi
