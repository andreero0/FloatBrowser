// Float Welcome module
// Note: This module relies on electron, path being available from main.js in the concatenated build
// We use pathUtil to avoid conflict with 'path' variable
const pathUtil = require('path')
const { BrowserWindow: FloatBrowserWindow, ipcMain: floatIpcMain, shell: floatShell } = require('electron')

let welcomeWindow = null

/**
 * Show the Float Browser welcome screen
 * @param {Object} mainWindow - The main browser window
 */
function showWelcomeScreen (mainWindow) {
  if (welcomeWindow) {
    welcomeWindow.focus()
    return
  }

  welcomeWindow = new FloatBrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    center: true,
    title: 'Welcome to Float Browser',
    backgroundColor: '#f5f5f5',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: pathUtil.join(__dirname, '../../js/preload/default.js')
    },
    parent: mainWindow,
    modal: false,
    show: false
  })

  welcomeWindow.loadFile(pathUtil.join(__dirname, '../../pages/floatWelcome/index.html'))

  welcomeWindow.once('ready-to-show', () => {
    welcomeWindow.show()
  })

  welcomeWindow.on('closed', () => {
    welcomeWindow = null
  })

  // Handle IPC from welcome window
  floatIpcMain.on('close-window', (event) => {
    if (welcomeWindow && event.sender === welcomeWindow.webContents) {
      welcomeWindow.close()
    }
  })

  floatIpcMain.on('open-external-url', (event, url) => {
    floatShell.openExternal(url)
  })

  floatIpcMain.on('open-settings-tab', (event) => {
    if (mainWindow) {
      mainWindow.webContents.send('addTab', {
        url: 'min://app/pages/settings/index.html#float'
      })
    }
  })
}

/**
 * Check if welcome screen should be shown and show it if needed
 * @param {Object} mainWindow - The main browser window
 * @param {Object} settings - The settings object
 */
function checkAndShowWelcome (mainWindow, settings) {
  // Check if welcome has been shown before
  const welcomeShown = settings.get('floatWelcomeShown', false)

  if (!welcomeShown) {
    // Show welcome screen after a short delay to let main window load
    setTimeout(() => {
      showWelcomeScreen(mainWindow)
    }, 1000)
  }
}

module.exports = {
  showWelcomeScreen,
  checkAndShowWelcome
}
