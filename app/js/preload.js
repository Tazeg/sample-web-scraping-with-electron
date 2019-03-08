// ------------------------------------------------------------------------------
// Twitter : @JeffProd
// Web     : https://jeffprod.com
// ------------------------------------------------------------------------------

console.log('preload.js loaded')

const { ipcRenderer } = require('electron')

ipcRenderer.on('sendbackhtml', (event, arg) => {
    console.log('preload: received sendbackhtml')
    ipcRenderer.send('hereishtml', document.documentElement.innerHTML)
  })
