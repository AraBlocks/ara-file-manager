const winstaller = require('electron-winstaller')

winstaller.createWindowsInstaller({
  appDirectory: '/release-builds/Ara File Manager-win32-x64/Ara File Manager.exe',
  outputDirectory: '/release-builds/winstalled',
  authors: 'Ara blocks',
  exe: 'Ara File Manager.exe',
  iconUrl: `https://s3.amazonaws.com/ara-prod-media/file-manager/ara_prod.ico`,
  loadingGif: '../build/installer.gif',
  setupExe: 'AFM Installer.exe'
})
  .then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`))
