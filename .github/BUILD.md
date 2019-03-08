# Build Instructions
We use [electron-builder](https://github.com/electron-userland/electron-builder) to compile our builds for both mac and windows.

## Prerequisites
[`jq`](https://stedolan.github.io/jq/) (for macos builds)
```
$ brew update && brew install jq
```
## Mac
### A note about macos certificates
TODO
### Development
```
$ npm run build-dev-mac
```
>This will create an `Ara File Manager.app`. The script that builds the `.app` includes a codesign at the bottom of it. If you don't want to or can't codesign the application, you can comment the last line in the script. Codesigning prevents the "untrusted developer" popup from rendering, as well as allowing for autopupdates.
>
>We suggest you place the `.app` in your `Applications` directory before using the app. This will ensure the deeplinks behave as expected.

#### Debugging
```
$ DEBUG=afm* /Applications/Ara\ File\ Manager.app/Contents/MacOS/Ara\ File\ Manager
//if you haven't moved the app from the `release-builds` directory you can run:
$ npm run debug-mac
```

### Production
```
$ npm run build-prod-mac
```
Like the dev build, this will create a codesigned `.app`, but also wrap it in a `.dmg` file. When booting the `Ara File Manager.dmg`, it will render a screen that prompts you to drag the `.app` into the `Applications` directory. The script will set flags that will enable google analytics in the application.

#### Debugging
```
$ DEBUG=afm* /Applications/Ara\ File\ Manager.app/Contents/MacOS/Ara\ File\ Manager
//if you haven't moved the app from the `release-builds` directory you can run:
$ npm run debug-mac
```

## Windows

### Development
```
$ npm run build-dev-windows
```
>This will create an **unpackaged** build of the application for windows. This is a directory of application-related files along with the actual `Ara File Manager.exe` which can be used to boot up the application. fully functional, but will **not** be able to autopupdate through squirrel.

>Must be built on a windows computer.

TODO: Figure out how to install and use wine + mono to build on a mac

#### Debugging
```
$ DEBUG=afm* <path to Ara File Manager.exe>
//if you haven't moved the app from the `release-builds` directory you can run:
$ npm run debug-windows
```

### Production

#### A note about windows certificates
The certificate can be exported from the GlobalSign security token and placed on a computer locally. The private key, however, is **bound** to the token and can't be exported. Because of this, you must have the token plugged in during the build. During the code signing phase of the build, the GlobalSign interface will pop up and prompt you to enter the password. It will prompt you every time a file needs to be signed. This is cumbersome, and you can opt for a single sign-on in the configuration of the GlobalSign application itself (which is available when it's plugged in).


```
$ CODE_SIGNING_PW=<secret password> npm run build-prod-windows
```
This will create a **packaged** build of the app for windows. Do **not** run this command on mac (it removes modules specific to mac). This will create an unpackaged version of the app, then it will package that into a single `AFM Installer.exe`. This installer will create a shortcut on the users desktop, and will place the actual application and related files in `C:\Users\<username>\AppData\Local\Ara File Manager`. The application can be uninstalled through the programs application available on Window's control panel. The script will set flags that will enable google analytics in the application.

**Ensure** you have a copy of the code signing certificate in `build/certs` before running the above command, as well as the GlobalSign security token plugged into your computer. **The installer must be signed as well**. To do this, open up the `Microsoft Visual C++ Build Tools` command prompt and enter the following command:

```
signtool sign /fd sha256 /a /f <path to certificate> /p <code signing certificate password> <path to AFM Installer.exe>
```

TODO: Use the callback after packager is complete to sign the installer

#### Debugging
```
$ DEBUG=afm* C:\Users\<username>\AppData\Local\ara-file-manager\Ara File Manager.exe
```
