# Ara File Manager.

[![Build Status](https://travis-ci.com/AraBlocks/ara-file-manager.svg?token=6WjTyCg41y8MBmCzro5x&branch=master)](https://travis-ci.com/AraBlocks/ara-file-manager)

The **Ara File Manager** is a simple desktop app that demonstrates the functionality of a complete local Ara network node and cryptocurrency wallet.
Ara is truly decentralized; with the Ara File Manager, your machine is participating directly in peer distribution swarms and the blockchain.

The File Manager lets you sell your digital content using the Ara token, and distribute your content without centralized hosting costs.
You can buy content, and earn Ara by seeding content in a swarm of nodes that have also purchased it.

With the _code_ of the Ara File Manager, you can see how to integrate Ara into your own app or site,
enabling your users to buy, sell, own, upload, and download content, all in the secure and decentralized Ara system.

## Status

This project is in active developement.

## Dependencies

- [Node](https://nodejs.org/en/download/)

## Development

```shell
$ npm install --verbose --no-optional
$ npm run start-dev [loggedin] [<DID>] [<password>]
```

Use the `--verbose` flag to get more granular feedback from npm.
The `--no-optional` flag will prevent unnecessary and heavy packages from being installed.
`npm install` downloads a large number of modules, compiles native code, and takes a minute or two to do all this.

You can follow the `start-dev` with an optional string: "`loggedin`". If you add this, you'll need to follow it with the DID you'd like to log in with, and the corresponding password to that DID. It will boot the app with you logged in already, for speedier development.

## Building Native Modules

The Ara File Manager is built with
[Node](https://nodejs.org/) and [Electron](https://electronjs.org/)
and includes modules developed within [Ara Blocks](https://github.com/arablocks),
the [Dat Project](https://datproject.org/) and
[Ethereum](https://www.ethereum.org/).

Building the Ara File Manager includes building native modules, including [web3](https://www.npmjs.com/package/web3) and the _Ethereum Virtual Machine_.

So, when installing Node, also install Node's _Tools for Native Modules_.
(On Windows, this involves installing
[Chocolatey](https://chocolatey.org/),
[Python 2](https://www.python.org/download/releases/2.0/), and the
_Visual Studio Build Tools_.)
There are a variety of ways to accomplish this, specific to your platform.
The [node-gyp README](https://github.com/nodejs/node-gyp) contains a good guide.

Running the code for the first time, you may encounter an error like this:

```shell
$ npm run start-dev

> ara-file-manager@0.9.0 start-dev /Users/Name/ara-file-manager
> electron boot

App threw an error during load
Error: The module '/Users/Name/ara-file-manager/node_modules/utp-native/build/Release/utp.node' was
compiled against a different Node.js version using NODE_MODULE_VERSION 67. This version of Node.js
requires NODE_MODULE_VERSION 57. Please try re-compiling or re-installing the module (for instance,
using `npm rebuild` or `npm install`).
```

This happens when the versions of V8 in Node and Electron don't match.
`npm install` built the native modules using Node, but now `start-dev` ran Electron, and Electron's newer V8 doesn't like them.

To remedy this, use [electron-rebuild](https://github.com/electron/electron-rebuild) to [rebuild the native modules for Electron](https://electronjs.org/docs/tutorial/using-native-node-modules#installing-modules-and-rebuilding-for-electron).
After every `npm install` (which will build the native modules for Node), rebuild them for Electron with a command like this:

```shell
$ ./node_modules/.bin/electron-rebuild
```

Alternatively, install an [older version of Node](https://nodejs.org/en/download/releases/) to match the `NODE_MODULE_VERSION` that Electron expects.

## Packaging App

```shell
$ npm i electron-packager -g
$ electron-packager . --overwrite --platform=darwin --arch=x64 --icon=build/icons/mac/ara.icns --prune=true --out=release-builds --app-bundle-id=“com.littlstar.araFileManager”
```

This will write a mac compatible compiled application to a folder in your project root called `release-builds`

## Debug

```shell
$ DEBUG=acm* npm run start-dev //development mode
$ DEBUG=acm* ~/<path to .app>/Contents/MacOS/Ara\ File \Manager //packaged
```

All `debug` names in the project begin with `acm` followed by their path, separated by a colon. You can narrow the logs by specifying the paths.

## Metadata format

The metadata format the file manager is compatible with is the following:

```shell
{
  "fileInfo": {
    "author": "Manggo",
    "size": "500mb"
    "title": "Some content"
    "timestamp": "2018-12-12T23:59:46.314Z"
  }
}
```

## Building the application

Documentation around building the application can be found [here](https://github.com/littlstar/ara-file-manager/blob/master/.github/BUILD.md)

## Contributing

* Cut from and make PRs to `master`
* After getting approval and merging into `master`, bump either minor or patch
  - Minor when latest version of app not compatible with older versions (ie `ara-contracts` has changed)
  - Patch for everything else
* Push tags
* Push `CHANGELOG`

- [Commit message format](https://github.com/littlstar/ara-file-manager/blob/master/.github/COMMIT_FORMAT.md)
- [Commit message examples](https://github.com/littlstar/ara-file-manager/blob/master/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](https://github.com/littlstar/ara-file-manager/blob/master/.github/CONTRIBUTING.md)

## See also

- External [link](https://goo.gl/67cqTC)

## License

LGPL-3.0
