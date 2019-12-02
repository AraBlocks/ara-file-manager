#!/bin/bash
echo 'uninstall-win.sh ---- start'
echo ''

echo 'Deleting all the paths where this or previous versions of the app may have left files'
echo ''

ls "~/.ara"
ls "~/.ararc"
ls "~/AppData/Local/ara-file-manager"
ls "~/AppData/Local/ara-updater"
ls "~/AppData/Local/Programs/ara"
ls "~/AppData/Roaming/Ara File Manager"
echo ''

echo 'Now you can reinstall the app as though this computer has never seen it before'
echo ''

echo 'uninstall-win.sh ---- done'
echo ''
