# Ara File Manager

The **Ara File Manager** is a simple desktop app that demonstrates the functionality of a complete local Ara network node and crypto token wallet.
Ara is truly decentralized; with the Ara File Manager, your machine is participating directly in peer distribution swarms and the blockchain.

The File Manager lets you sell your digital content using the ARA token, and distribute your content without hosting costs.
You can buy content, and earn Ara by seeding content in a swarm of nodes that have also purchased it.

With the _code_ of the Ara File Manager, you can see how to integrate Ara into your own app or site,
enabling your users to buy, sell, own, upload, and download content, all with the secure and decentralized Ara tools.

## Quick guide

Get the code for the Ara File Mananager, build it, and run it with commands like these:

```shell
$ git clone https://github.com/arablocks/ara-file-manager
$ cd ara-file-manager
$ npm install
$ npm run start-dev
```

Didn't work? Head over to the [detailed guide](https://github.com/arablocks/ara-file-manager/blob/master/.github/INSTALL.md).

Package your code for development and production on macOS and Windows:

```shell
$ npm run build-dev-mac
$ npm run build-dev-win
$ npm run build-prod-mac
$ npm run build-prod-win
```

Make a branch, code some changes, and send us a pull request:

```shell
$ git checkout -b your-branch-name
$ git commit -a -n -m "tasktype(file.ext): note about what you did"
$ git push origin your-branch-name
```

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

## Packaging App

```shell
$ npm i electron-packager -g
$ electron-packager . --overwrite --platform=darwin --arch=x64 --icon=build/icons/mac/ara.icns --prune=true --out=release-builds --app-bundle-id=“com.ara.one.araFileManager”
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

Documentation around building the application can be found [here](https://github.com/arablocks/ara-file-manager/blob/master/.github/BUILD.md)

## Contributing

* Cut from and make PRs to `master`
* After getting approval and merging into `master`, bump either minor or patch
  - Minor when latest version of app not compatible with older versions (ie `ara-contracts` has changed)
  - Patch for everything else
* Push tags
* Push `CHANGELOG`

- [Commit message format](https://github.com/arablocks/ara-file-manager/blob/master/.github/COMMIT_FORMAT.md)
- [Commit message examples](https://github.com/arablocks/ara-file-manager/blob/master/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](https://github.com/arablocks/ara-file-manager/blob/master/.github/CONTRIBUTING.md)

## See also

- External [link](https://goo.gl/67cqTC)

## License

LGPL-3.0
