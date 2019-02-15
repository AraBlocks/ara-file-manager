# Ara File Manager
## Status
This project is in active developement. `dev` is stable branch.

## Dependencies
- [Node](https://nodejs.org/en/download/)

## Development
```
$ npm i
$ npm run start-dev [loggedin] [<DID>] [<password>]
```
You can follow the `start-dev` with an optional string: "`loggedin`". If you add this, you'll need to follow it with the DID you'd like to log in with, and the corresponding password to that DID. It will boot the app with you logged in already, for speedier development.

## Packaging App
```
$ npm i electron-packager -g
$ electron-packager . --overwrite --platform=darwin --arch=x64 --icon=build/icons/mac/ara.icns --prune=true --out=release-builds --app-bundle-id=“com.littlstar.araFileManager”
```

This will write a mac compatible compiled application to a folder in your project root called `release-builds`

## Debug
```
$ DEBUG=acm* npm run start-dev //development mode
$ DEBUG=acm* ~/<path to .app>/Contents/MacOS/Ara\ File \Manager //packaged
```
All `debug` names in the project begin with `acm` followed by their path, separated by a colon. You can narrow the logs by specifying the paths.

## Metadata format
The metadata format the file manager is compatible with is the following:
```
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
- [Commit message format](https://github.com/littlstar/ara-file-manager/blob/master/.github/COMMIT_FORMAT.md)
- [Commit message examples](https://github.com/littlstar/ara-file-manager/blob/master/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](https://github.com/littlstar/ara-file-manager/blob/master/.github/CONTRIBUTING.md)

## See also
- External [link](https://goo.gl/67cqTC)

## License
LGPL-3.0
