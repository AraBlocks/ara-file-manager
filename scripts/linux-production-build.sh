#!/bin/bash

echo "Packaging production build"

electron-packager $(pwd) \
--overwrite \
--platform=linux \
--arch=x64 \
--icon=./build/icons/mac/ara.icns \
--prune=true \
--out=$(pwd)/release-builds

electron-installer-flatpak --src $(pwd)/release-builds/ara-file-manager-linux-x64 --dest $(pwd)/build-releases --arch amd64
electron-installer-redhat --src $(pwd)/release-builds/ara-file-manager-linux-x64 --dest $(pwd)/build-releases --arch amd64
electron-installer-debian --src $(pwd)/release-builds/ara-file-manager-linux-x64 --dest $(pwd)/build-releases --arch amd64
sudo docker build . -t afm
sudo docker run -it --rm -v $(pwd)/release-builds/ara-file-manager-linux-x64:/snap/app afm --src=.

mv $(pwd)/release-builds/ara-file-manager-linux-x64/*.snap $(pwd)/build-releases
