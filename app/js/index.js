// ------------------------------------------------------------------------------
// Twitter : @JeffProd
// Web     : https://jeffprod.com
// ------------------------------------------------------------------------------

const cheerio = require('cheerio')
const { ipcRenderer } = require('electron')

const webview = document.querySelector('webview')

webview.addEventListener('dom-ready', () => {
  let currentURL = webview.getURL()
  let titlePage = webview.getTitle()
  console.log('currentURL is : ' + currentURL)
  console.log('titlePage is : ' + titlePage)

  webview.executeJavaScript(`function gethtml () {
    return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    }
    gethtml();`).then((html) => {
    extractLinks(html)
  })  
})

let extractLinks = function (html) {
  const $ = cheerio.load(html)
  $('a').each((i, element) => {
    console.log('href: ' + $(element).attr('href'))
    console.log('text: ' + $(element).text())
  })
}

let childLoadURL = function (url) {
  ipcRenderer.send('scrapeurl', url)
}

ipcRenderer.on('extracthtml', (event, html) => {
  console.log('extract html given by child window')
  extractLinks(html)
})
