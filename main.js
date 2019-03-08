// ------------------------------------------------------------------------------
// Twitter : @JeffProd
// Web     : https://jeffprod.com
// ------------------------------------------------------------------------------

const url = require('url')
const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow = null
let childWindow = null

const mainUrl = url.format({
  protocol: 'file',
  slashes: true,
  pathname: path.join(__dirname, 'app/index.html')
})

app.on('ready', function () {

  mainWindow = new BrowserWindow({
    center: true,
    minWidth: 1024,
    minHeight: 768,
    show: false
  })

  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(mainUrl)

  mainWindow.webContents.on('dom-ready', function () {
    console.log('user-agent:', mainWindow.webContents.getUserAgent());
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })

  childWindow = new BrowserWindow({
      parent: mainWindow,
      center: true,
      minWidth: 800,
      minHeight: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false, // https://electronjs.org/docs/tutorial/security#2-d%C3%A9sactiver-lint%C3%A9gration-de-nodejs-dans-tous-les-renderers-affichant-des-contenus-distants
        preload: path.join(__dirname, 'app/js/preload.js')
      }
  })

  childWindow.webContents.openDevTools()
  childWindow.webContents.on('dom-ready', function () {
    console.log('childWindow DOM-READY => send back html')
    childWindow.send('sendbackhtml')
  })  
}) // app.on('ready'

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { app.exit() }
})

ipcMain.on('scrapeurl', (event, url) => {
  childWindow.loadURL(url, { userAgent: 'My Super Browser v2.0 Youpi Tralala !' })
})

ipcMain.on('hereishtml', (event, html) => {
  mainWindow.send('extracthtml', html)
})
