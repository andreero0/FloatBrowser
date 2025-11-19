// Content Script Manager
// Handles injection of content scripts into webContents based on URL patterns

const fs = require('fs')
const path = require('path')

// Content scripts configuration
const contentScripts = [
  {
    name: 'youtubeAdBlock',
    matches: [
      '*://*.youtube.com/*',
      '*://*.youtube-nocookie.com/*'
    ],
    scriptPath: path.join(__dirname, 'contentScripts', 'youtubeAdBlock.js'),
    runAt: 'document_start', // document_start, document_end, document_idle
    enabled: true, // default enabled state
    settingKey: 'youtubeAdFree' // settings key to check if enabled
  }
]

// Load content script files at startup
const loadedScripts = {}

function loadContentScripts() {
  contentScripts.forEach(script => {
    try {
      loadedScripts[script.name] = fs.readFileSync(script.scriptPath, 'utf8')
    } catch (err) {
      console.error(`Failed to load content script ${script.name}:`, err)
    }
  })
}

// Check if URL matches pattern
function urlMatchesPattern(url, pattern) {
  // Convert glob pattern to regex
  // *://*.youtube.com/* becomes regex that matches youtube.com and subdomains

  try {
    // Simple pattern matching
    const regexPattern = pattern
      .replace(/\./g, '\\.') // Escape dots
      .replace(/\*/g, '.*')  // * matches anything

    const regex = new RegExp('^' + regexPattern + '$', 'i')
    return regex.test(url)
  } catch (e) {
    return false
  }
}

// Check if content script should be injected for this URL
function shouldInjectScript(script, url) {
  // Check if URL matches any of the patterns first
  if (!script.matches.some(pattern => urlMatchesPattern(url, pattern))) {
    return false
  }

  // Check if the feature is enabled in settings (default to true)
  const settingValue = settings.get(script.settingKey)
  const isEnabled = settingValue === undefined || settingValue === true

  return isEnabled
}

// Inject content script into webContents
function injectContentScript(webContents, url) {
  if (!webContents || webContents.isDestroyed()) {
    return
  }

  // Check each content script
  contentScripts.forEach(script => {
    if (shouldInjectScript(script, url)) {
      const scriptCode = loadedScripts[script.name]
      if (scriptCode) {
        try {
          webContents.executeJavaScript(scriptCode, true)
            .then(() => {
              console.log(`Injected content script: ${script.name}`)
            })
            .catch(err => {
              console.error(`Failed to inject ${script.name}:`, err)
            })
        } catch (err) {
          console.error(`Error injecting ${script.name}:`, err)
        }
      }
    }
  })
}

// Setup content script injection for a webContents
function setupContentScriptInjection(webContents) {
  if (!webContents || webContents.isDestroyed()) {
    return
  }

  // Inject on navigation
  webContents.on('did-start-navigation', (event, url) => {
    if (event.isMainFrame && !event.isSameDocument) {
      // Use did-start-navigation for document_start scripts
      injectContentScript(webContents, url)
    }
  })

  // Also inject on dom-ready for robustness
  webContents.on('dom-ready', () => {
    const url = webContents.getURL()
    injectContentScript(webContents, url)
  })
}

// Initialize the content script manager
function initialize() {
  loadContentScripts()
}

// Initialize when app is ready
app.once('ready', function() {
  initialize()
})

module.exports = {
  initialize,
  setupContentScriptInjection,
  injectContentScript
}
