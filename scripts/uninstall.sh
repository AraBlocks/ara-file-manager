#!/bin/bash
echo 'uninstall-mac.sh ---- start'
echo ''
echo 'Deleting all the paths where this or previous versions of the app may have left files'
echo ''

#TODO just ls for now

echo '(1)'
ls /Applications/Ara\ File\ Manager.app
echo '(2)'
ls ~/.ara
echo '(3)'
ls ~/.ararc
echo '(4)'
ls ~/AppData/Local/ara-file-manager
echo '(5)'
ls ~/AppData/Local/ara-updater
echo '(6)'
ls ~/AppData/Local/Programs/ara
echo '(7)'
ls ~/AppData/Roaming/Ara\ File\ Manager
echo '(8)'
ls ~/Library/Application\ Support/Ara\ File\ Manager
echo '(9)'
ls ~/Library/Preferences/com.ara.one.araFileManager.helper.plist
echo '(10)'
ls ~/Library/Preferences/com.ara.one.araFileManager.plist
echo '(done)'

echo ''
echo 'Now you can reinstall the app as though this computer has never seen it before'
echo ''
echo 'uninstall-mac.sh ---- done'
echo ''
