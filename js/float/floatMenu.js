/* Float menu integration for Min Browser - Main Process */

/**
 * Creates the Float menu template to be inserted into Min's menu structure
 * This runs in the main process and has access to window state
 * @param {Object} options - Menu options
 * @param {BrowserWindow} options.window - The window to get state from
 * @param {Function} options.sendIPCToWindow - Function to send IPC to window
 * @returns {Object} Menu template object
 */
function createFloatMenuTemplate (options = {}) {
  const { window, sendIPCToWindow } = options

  // Get Float state from the window
  let floatManager = null
  let floatProfiles = null
  let alwaysOnTop = false
  let opacity = 1.0
  let profiles = []

  if (window && windows && windows.getState) {
    const state = windows.getState(window)
    if (state) {
      floatManager = state.floatManager
      floatProfiles = state.floatProfiles

      if (floatManager) {
        alwaysOnTop = floatManager.isAlwaysOnTop()
        opacity = floatManager.getOpacity()
      }

      if (floatProfiles) {
        const profilesObj = floatProfiles.getProfiles()
        // Convert profiles object to array
        profiles = Object.keys(profilesObj).map(key => profilesObj[key])
      }
    }
  }

  // Helper to check if current opacity matches a preset
  function isOpacityActive (value) {
    return Math.abs(opacity - value) < 0.01
  }

  // Create opacity submenu with current value display and common presets
  const currentOpacityPercent = Math.round(opacity * 100)

  const opacitySubmenu = [
    // Show current opacity at the top (non-clickable, just informational)
    {
      label: `Current: ${currentOpacityPercent}%`,
      enabled: false
    },
    { type: 'separator' },
    // Common presets for quick access
    {
      label: '100% (Opaque)',
      click: function (item, win) {
        setOpacityFromMenu(win, 1.0)
      }
    },
    {
      label: '90%',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.9)
      }
    },
    {
      label: '80%',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.8)
      }
    },
    {
      label: '70%',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.7)
      }
    },
    {
      label: '60%',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.6)
      }
    },
    {
      label: '50%',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.5)
      }
    },
    {
      label: '30% (Minimum)',
      click: function (item, win) {
        setOpacityFromMenu(win, 0.3)
      }
    },
    { type: 'separator' },
    {
      label: 'Use Slider for Precise Control',
      enabled: false
    }
  ]

  // Helper function to set opacity from menu
  function setOpacityFromMenu (win, value) {
    if (win && windows && windows.getState) {
      const state = windows.getState(win)
      if (state && state.floatManager) {
        const success = state.floatManager.setOpacity(value)
        if (success && floatSettings) {
          floatSettings.set('opacity', value)
          floatSettings.save()

          // Notify renderer process of state change
          if (typeof sendIPCToWindow === 'function') {
            sendIPCToWindow(win, 'float:state-changed', {
              opacity: value,
              alwaysOnTop: state.floatManager.isAlwaysOnTop(),
              isPIP: state.floatManager.isPIPMode()
            })
          }
        }
        // Rebuild menu to update current value display
        if (typeof mainMenu !== 'undefined' && typeof buildAppMenu === 'function') {
          mainMenu = buildAppMenu()
          if (typeof Menu !== 'undefined') {
            Menu.setApplicationMenu(mainMenu)
          }
        }
      }
    }
  }

  // Create window profiles submenu
  const profilesSubmenu = []

  // Add predefined profiles with keyboard shortcuts
  const defaultProfiles = ['small', 'medium', 'large']
  defaultProfiles.forEach((profileName, index) => {
    const profile = profiles.find(p => p.name.toLowerCase() === profileName)
    if (profile) {
      profilesSubmenu.push({
        label: profile.name,
        accelerator: `CmdOrCtrl+${index + 1}`,
        click: function (item, win) {
          if (win && windows && windows.getState) {
            const state = windows.getState(win)
            if (state && state.floatProfiles) {
              state.floatProfiles.applyProfile(profileName)
            }
          }
        }
      })
    }
  })

  // Add custom profiles (without shortcuts)
  const customProfiles = profiles.filter(p => !defaultProfiles.includes(p.name.toLowerCase()))
  if (customProfiles.length > 0) {
    if (profilesSubmenu.length > 0) {
      profilesSubmenu.push({ type: 'separator' })
    }
    customProfiles.forEach(profile => {
      profilesSubmenu.push({
        label: profile.name,
        click: function (item, win) {
          if (win && windows && windows.getState) {
            const state = windows.getState(win)
            if (state && state.floatProfiles) {
              state.floatProfiles.applyProfile(profile.name.toLowerCase())
            }
          }
        }
      })
    })
  }

  // Add "Manage Profiles..." option
  if (profilesSubmenu.length > 0) {
    profilesSubmenu.push({ type: 'separator' })
  }
  profilesSubmenu.push({
    label: 'Manage Profiles...',
    click: function (item, win) {
      sendIPCToWindow(win, 'addTab', {
        url: 'min://app/pages/settings/index.html#float'
      })
    }
  })

  // Build the complete Float menu
  return {
    label: 'Float',
    submenu: [
      {
        label: 'Always on Top',
        type: 'checkbox',
        checked: alwaysOnTop,
        accelerator: 'CmdOrCtrl+Shift+A',
        click: function (item, win) {
          if (win && windows && windows.getState) {
            const state = windows.getState(win)
            if (state && state.floatManager) {
              const success = state.floatManager.setAlwaysOnTop(item.checked)
              if (success && floatSettings) {
                floatSettings.set('alwaysOnTop', item.checked)
                floatSettings.save()

                // Notify renderer process of state change
                if (typeof sendIPCToWindow === 'function') {
                  sendIPCToWindow(win, 'float:state-changed', {
                    opacity: state.floatManager.getOpacity(),
                    alwaysOnTop: item.checked,
                    isPIP: state.floatManager.isPIPMode()
                  })
                }
              }
              // Rebuild menu to update checkmark
              if (typeof mainMenu !== 'undefined' && typeof buildAppMenu === 'function') {
                mainMenu = buildAppMenu()
                if (typeof Menu !== 'undefined') {
                  Menu.setApplicationMenu(mainMenu)
                }
              }
            }
          }
        }
      },
      {
        label: 'Picture-in-Picture Mode',
        accelerator: 'CmdOrCtrl+Shift+P',
        click: function (item, win) {
          if (win && windows && windows.getState) {
            const state = windows.getState(win)
            if (state && state.floatManager) {
              const newPIPState = state.floatManager.togglePIPMode()

              // Notify renderer process of state change
              if (typeof sendIPCToWindow === 'function') {
                sendIPCToWindow(win, 'float:state-changed', {
                  opacity: state.floatManager.getOpacity(),
                  alwaysOnTop: state.floatManager.isAlwaysOnTop(),
                  isPIP: newPIPState
                })
              }
            }
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Opacity',
        submenu: opacitySubmenu
      },
      { type: 'separator' },
      {
        label: 'Window Profiles',
        submenu: profilesSubmenu
      }
    ]
  }
}

// Export for concatenated build (function will be available globally)
// In concatenated build, this function is available directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createFloatMenuTemplate
  }
}
