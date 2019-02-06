const winstaller = require('electron-winstaller')

winstaller.createWindowsInstaller({
  appDirectory: './release-builds/Ara File Manager-win32-x64/',
  outputDirectory: './release-builds/winstalled',
  authors: 'Ara blocks',
  exe: 'Ara File Manager.exe',
  iconUrl: 'https://s3.amazonaws.com/ara-prod-media/file-manager/ara_prod.ico',
  setupIcon: './build/icons/windows/ara_prod.ico',
  loadingGif: './build/Ara-Installing.gif',
  setupExe: 'AFM Installer.exe',
  certificateFile: './build/certs/code_signing.cer',
  certificatePassword: proccess.env.CODE_SIGNING_PW
})
  .then(
    () => console.log("It worked!"), 
    (e) => console.log(`Fatal Error (if error is about failing to produce .wix, dont worry, we only need the .exe): ${e.message}`)
  )