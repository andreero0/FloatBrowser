const { ipcRenderer } = require('electron')

// Apply dark mode if enabled
function applyTheme () {
  ipcRenderer.invoke('get-setting', 'darkMode').then(function (darkMode) {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    }
  })
}

// Handle "Get Started" button
document.getElementById('get-started-button').addEventListener('click', function () {
  const dontShowAgain = document.getElementById('dont-show-again').checked

  if (dontShowAgain) {
    // Save preference to not show welcome screen again
    ipcRenderer.invoke('set-setting', 'floatWelcomeShown', true)
  }

  // Close the welcome window
  ipcRenderer.send('close-window')
})

// Handle resource links
document.getElementById('user-guide-link').addEventListener('click', function (e) {
  e.preventDefault()
  ipcRenderer.send('open-external-url', 'https://github.com/yourusername/float-browser-min/blob/main/docs/USER_GUIDE.md')
})

document.getElementById('shortcuts-link').addEventListener('click', function (e) {
  e.preventDefault()
  ipcRenderer.send('open-external-url', 'https://github.com/yourusername/float-browser-min/blob/main/docs/SHORTCUTS.md')
})

document.getElementById('troubleshooting-link').addEventListener('click', function (e) {
  e.preventDefault()
  ipcRenderer.send('open-external-url', 'https://github.com/yourusername/float-browser-min/blob/main/docs/TROUBLESHOOTING.md')
})

document.getElementById('settings-link').addEventListener('click', function (e) {
  e.preventDefault()
  // Open settings in main window by sending IPC to open a tab
  ipcRenderer.send('open-settings-tab')
  // Close welcome window
  ipcRenderer.send('close-window')
})

// Initialize
applyTheme()
