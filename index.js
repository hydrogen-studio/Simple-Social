const { app, BrowserWindow } = require('electron')
const path = require('path')
let { ipcMain } = require("electron")
let { sentiment, grammarHelper, isNice } = require("./util/algorithms.js")
const storage = require('electron-json-storage');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Simple Social",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.maximize()

  win.loadFile('index.html')

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle("analyze", (event, message) => {
  let sentimentResult = sentiment(message)
  let grammar = grammarHelper(message);
  let grammarResult = grammar
  let isNiceResult = isNice(message);
  var doc = { 
    sentRes: sentimentResult,
    grammarRes: grammarResult, 
    isNiceRes: isNiceResult
  };

  storage.set("result", doc, () => {
    console.log("Temp Data Stored")
  })
  return doc
})

ipcMain.handle("result", (event, message) => {
  return storage.getSync("result")
})