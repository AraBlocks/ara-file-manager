const winstaller = require('electron-winstaller')

winstaller.createWindowsInstaller({
  appDirectory: './release-builds/Ara-File-Manager-win32-x64',
  outputDirectory: './release-builds/winstalled',
  authors: 'Ara Blocks',
  exe: 'Ara-File-Manager.exe',
  iconUrl: 'https://s3.amazonaws.com/ara-prod-media/file-manager/ara_prod.ico',
  loadingGif: './build/installer.gif',
  setupIcon: './build/icons/windows/ara_dev.ico',
  setupExe: 'AFM Installer.exe',
  description: "ara file manager"
})
  .then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`))