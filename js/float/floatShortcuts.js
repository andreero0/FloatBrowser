/**
 * FloatShortcuts
 *
 * Manages global keyboard shortcuts for Float Browser features.
 * Allows users to control Float features from any application.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

const { globalShortcut } = require('electron')

class FloatShortcuts {
  /**
   * Creates a FloatShortcuts instance
   * @param {FloatWindowManager} floatWindowManager - The FloatWindowManager instance
   * @param {BrowserWindow} browserWindow - The Electron BrowserWindow instance
   * @param {FloatSettings} floatSettings - The FloatSettings instance
   * @param {FloatProfiles} floatProfiles - The FloatProfiles instance (optional)
   */
  constructor (floatWindowManager, browserWindow, floatSettings, floatProfiles) {
    if (!floatWindowManager) {
      throw new Error('FloatShortcuts requires a FloatWindowManager instance')
    }
    if (!browserWindow) {
      throw new Error('FloatShortcuts requires a BrowserWindow instance')
    }
    if (!floatSettings) {
      throw new Error('FloatShortcuts requires a FloatSettings instance')
    }

    this.floatManager = floatWindowManager
    this.window = browserWindow
    this.settings = floatSettings
    this.floatProfiles = floatProfiles

    // Track registered shortcuts
    this.registeredShortcuts = []

    // Track registration errors for user feedback
    this.registrationErrors = []
  }

  /**
   * Registers all global shortcuts
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.3
   */
  registerShortcuts () {
    // Clear any previous registration errors
    this.registrationErrors = []

    // Get shortcuts from settings
    const shortcuts = this.settings.get('globalShortcuts', {
      toggleVisibility: 'CommandOrControl+Shift+F',
      toggleAlwaysOnTop: 'CommandOrControl+Shift+A',
      togglePIP: 'CommandOrControl+Shift+P'
    })

    // Register toggle visibility shortcut (Requirement 5.1, 5.2)
    this._registerShortcut(
      shortcuts.toggleVisibility,
      'toggleVisibility',
      this._handleToggleVisibility.bind(this)
    )

    // Register toggle always-on-top shortcut (Requirement 5.3)
    this._registerShortcut(
      shortcuts.toggleAlwaysOnTop,
      'toggleAlwaysOnTop',
      this._handleToggleAlwaysOnTop.bind(this)
    )

    // Register toggle PIP shortcut (Requirement 5.4)
    this._registerShortcut(
      shortcuts.togglePIP,
      'togglePIP',
      this._handleTogglePIP.bind(this)
    )

    // Register profile shortcuts if FloatProfiles is available (Requirement 6.3)
    if (this.floatProfiles) {
      this._registerShortcut(
        'CommandOrControl+1',
        'applyProfileSmall',
        this._handleApplyProfile.bind(this, 'small')
      )

      this._registerShortcut(
        'CommandOrControl+2',
        'applyProfileMedium',
        this._handleApplyProfile.bind(this, 'medium')
      )

      this._registerShortcut(
        'CommandOrControl+3',
        'applyProfileLarge',
        this._handleApplyProfile.bind(this, 'large')
      )
    }

    // Log summary
    if (this.registrationErrors.length > 0) {
      console.warn('FloatShortcuts: Some shortcuts failed to register:', this.registrationErrors)
    } else {
      console.log('FloatShortcuts: All shortcuts registered successfully')
    }
  }

  /**
   * Registers a single shortcut with error handling
   * @param {string} accelerator - The keyboard shortcut (e.g., 'CommandOrControl+Shift+F')
   * @param {string} name - The name of the shortcut for tracking
   * @param {Function} handler - The handler function to call
   * Requirements: 5.5
   */
  _registerShortcut (accelerator, name, handler) {
    try {
      const success = globalShortcut.register(accelerator, handler)

      if (success) {
        this.registeredShortcuts.push({ accelerator, name })
        console.log(`FloatShortcuts: Registered ${name} (${accelerator})`)
      } else {
        // Registration failed (likely because shortcut is already in use)
        const error = {
          accelerator,
          name,
          error: 'Shortcut already in use or invalid'
        }
        this.registrationErrors.push(error)
        console.error(`FloatShortcuts: Failed to register ${name} (${accelerator})`)
      }
    } catch (error) {
      // Exception during registration (Requirement 5.5)
      const errorInfo = {
        accelerator,
        name,
        error: error.message
      }
      this.registrationErrors.push(errorInfo)
      console.error(`FloatShortcuts: Exception registering ${name} (${accelerator}):`, error)
    }
  }

  /**
   * Handler for toggle visibility shortcut
   * Requirements: 5.1, 5.2
   */
  _handleToggleVisibility () {
    try {
      if (this.window.isVisible()) {
        this.window.hide()
      } else {
        this.window.show()
        this.window.focus()
      }
    } catch (error) {
      console.error('FloatShortcuts: Error toggling visibility:', error)
    }
  }

  /**
   * Handler for toggle always-on-top shortcut
   * Requirements: 5.3
   */
  _handleToggleAlwaysOnTop () {
    try {
      const currentState = this.floatManager.isAlwaysOnTop()
      const newState = !currentState

      const success = this.floatManager.setAlwaysOnTop(newState)

      if (success) {
        // Save the new state
        this.settings.set('alwaysOnTop', newState)
        this.settings.save()
      }
    } catch (error) {
      console.error('FloatShortcuts: Error toggling always-on-top:', error)
    }
  }

  /**
   * Handler for toggle PIP shortcut
   * Requirements: 5.4
   */
  _handleTogglePIP () {
    try {
      this.floatManager.togglePIPMode()

      // Save the state
      this.floatManager.saveState(this.settings)
    } catch (error) {
      console.error('FloatShortcuts: Error toggling PIP mode:', error)
    }
  }

  /**
   * Handler for applying window profiles
   * Requirements: 6.3
   * @param {string} profileName - The name of the profile to apply
   */
  _handleApplyProfile (profileName) {
    try {
      if (!this.floatProfiles) {
        console.warn('FloatShortcuts: FloatProfiles not available')
        return
      }

      const success = this.floatProfiles.applyProfile(profileName)

      if (success) {
        console.log(`FloatShortcuts: Applied profile "${profileName}"`)
      } else {
        console.error(`FloatShortcuts: Failed to apply profile "${profileName}"`)
      }
    } catch (error) {
      console.error(`FloatShortcuts: Error applying profile "${profileName}":`, error)
    }
  }

  /**
   * Unregisters all global shortcuts
   * Requirements: 5.5
   */
  unregisterShortcuts () {
    try {
      // Unregister all shortcuts
      globalShortcut.unregisterAll()

      console.log('FloatShortcuts: Unregistered all shortcuts')

      // Clear tracking arrays
      this.registeredShortcuts = []
      this.registrationErrors = []
    } catch (error) {
      console.error('FloatShortcuts: Error unregistering shortcuts:', error)
    }
  }

  /**
   * Updates a specific shortcut
   * @param {string} action - The action name ('toggleVisibility', 'toggleAlwaysOnTop', 'togglePIP')
   * @param {string} accelerator - The new keyboard shortcut
   * @returns {boolean} - True if successful
   */
  updateShortcut (action, accelerator) {
    try {
      // Validate action
      const validActions = ['toggleVisibility', 'toggleAlwaysOnTop', 'togglePIP']
      if (!validActions.includes(action)) {
        console.error('FloatShortcuts: Invalid action:', action)
        return false
      }

      // Update settings
      this.settings.set(`globalShortcuts.${action}`, accelerator)
      this.settings.save()

      // Re-register all shortcuts
      this.unregisterShortcuts()
      this.registerShortcuts()

      return true
    } catch (error) {
      console.error('FloatShortcuts: Error updating shortcut:', error)
      return false
    }
  }

  /**
   * Gets all registered shortcuts
   * @returns {Array} - Array of registered shortcuts
   */
  getRegisteredShortcuts () {
    return [...this.registeredShortcuts]
  }

  /**
   * Gets registration errors
   * @returns {Array} - Array of registration errors
   */
  getRegistrationErrors () {
    return [...this.registrationErrors]
  }
}

module.exports = FloatShortcuts
