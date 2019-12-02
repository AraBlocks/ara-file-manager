#!/bin/bash
echo 'uninstall-mac.sh ---- start'
echo ''

echo 'Deleting all the paths where this or previous versions of the app may have left files'
echo ''

ls "/Applications/Ara File Manager.app"
ls "/Applications/Tortuga.app"
ls "~/.ara"
ls "~/.ararc"
ls "~/Library/Application Support/Ara File Manager"
ls "~/Library/Preferences/com.ara.one.araFileManager.helper.plist"
ls "~/Library/Preferences/com.ara.one.araFileManager.plist"
echo ''

echo 'Now you can reinstall the app as though this computer has never seen it before'
echo ''

echo 'uninstall-mac.sh ---- done'
echo ''
