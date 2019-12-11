#!/bin/bash
echo 'uninstall.sh ---- start'
echo ''
echo 'This will delete all the paths where the app may have left files'
echo 'This includes program, settings, and user document files, for this and previous versions, on macOS, Windows, and Linux'
echo ''
echo '**** WARNING: THIS WILL DELETE YOUR ~/.ara FOLDER! ****'
echo ''
read -p "Are you sure? [y/n]" -n 1 -r
echo ''
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo ''

rm -rf /Applications/Ara\ File\ Manager.app
rm -rf ~/.ara
rm -rf ~/.ararc
rm -rf ~/AppData/Local/ara-file-manager
rm -rf ~/AppData/Local/ara-updater
rm -rf ~/AppData/Local/Programs/ara
rm -rf ~/AppData/Roaming/Ara\ File\ Manager
rm -rf ~/Library/Application\ Support/Ara\ File\ Manager
rm -rf ~/Library/Preferences/com.ara.one.araFileManager.helper.plist
rm -rf ~/Library/Preferences/com.ara.one.araFileManager.plist

ls /Applications/Ara\ File\ Manager.app
ls ~/.ara
ls ~/.ararc
ls ~/AppData/Local/ara-file-manager
ls ~/AppData/Local/ara-updater
ls ~/AppData/Local/Programs/ara
ls ~/AppData/Roaming/Ara\ File\ Manager
ls ~/Library/Application\ Support/Ara\ File\ Manager
ls ~/Library/Preferences/com.ara.one.araFileManager.helper.plist
ls ~/Library/Preferences/com.ara.one.araFileManager.plist

echo ''
echo 'Now you can reinstall the app as though this computer has never seen it before'
echo ''
echo 'uninstall.sh ---- done'
echo ''
fi
