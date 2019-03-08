#!/bin/bash

echo "Packaging production build"

electron-packager $(pwd) \
--overwrite \
--platform=linux \
--arch=x64 \
--icon=./build/icons/mac/ara.icns \
--prune=true \
--out=$(pwd)/build-releases

electron-installer-debian --src $(pwd)/build-releases/ara-file-manager-linux-x64 --dest $(pwd)/build-releases --arch amd64
sudo docker build . -t afm
sudo docker run -it --rm -v $(pwd)/build-releases/ara-file-manager-linux-x64:/snap/app afm --src=.

mv $(pwd)/build-releases/ara-file-manager-linux-x64/*.snap $(pwd)/build-releases
