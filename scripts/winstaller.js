const { urls } = require('k')
const winstaller = require('electron-winstaller')

const { version } = require('../package.json')

winstaller.createWindowsInstaller({
  // Drag ./release-builds/Ara File Manager-win32-x64/ to the Desktop
  appDirectory: 'C:/Users/Admin/Desktop/Ara File Manager-win32-x64/',
  outputDirectory: 'C:/Users/Admin/Desktop/winstalled',
  authors: 'Ara blocks',
  exe: `Ara File Manager.exe`,
  iconUrl: 'https://s3.amazonaws.com/ara-prod-media/file-manager/ara_prod.ico',
  setupIcon: './build/icons/windows/ara_prod.ico',
  loadingGif: './build/Ara-Installing.gif',
  setupExe: `AFM-${version}.exe`,
  certificateFile: './build/certs/code_signing.cer',
  certificatePassword: process.env.CODE_SIGNING_PW,
  remoteReleases: urls.SQUIRREL_WIN
})
  .then(
    () => console.log('¡WE BUILDED IT!'),
    (e) => console.log(`Fatal Error (if error is about failing to produce .wix, dont worry, we only need the .exe): ${e.message}`)
  )
