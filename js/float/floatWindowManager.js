/**
 * FloatWindowManager
 *
 * Manages window-level Float features including transparency, always-on-top,
 * and Picture-in-Picture mode for Float Browser.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 12.2, 12.3, 12.4
 */

class FloatWindowManager {
  /**
   * Creates a FloatWindowManager instance
   * @param {BrowserWindow} browserWindow - The Electron BrowserWindow instance to manage
   */
  constructor (browserWindow) {
    if (!browserWindow) {
      throw new Error('FloatWindowManager requires a BrowserWindow instance')
    }

    this.window = browserWindow

    // State tracking
    this.state = {
      opacity: 1.0,
      alwaysOnTop: false,
      isPIP: false,
      savedBounds: null // Stores bounds before entering PIP mode
    }

    // PIP mode dimensions
    this.PIP_WIDTH = 400
    this.PIP_HEIGHT = 300
  }

  /**
   * Sets the window opacity
   * @param {number} value - Opacity value between 0.3 and 1.0
   * @returns {boolean} - True if successful, false otherwise
   * Requirements: 2.2, 2.3, 12.2
   */
  setOpacity (value) {
    // Validate opacity value
    if (typeof value !== 'number' || isNaN(value)) {
      console.error('FloatWindowManager: Invalid opacity value - must be a number')
      return false
    }

    if (value < 0.3 || value > 1.0) {
      console.error('FloatWindowManager: Opacity must be between 0.3 and 1.0')
      return false
    }

    const previousOpacity = this.state.opacity

    try {
      this.window.setOpacity(value)
      this.state.opacity = value
      return true
    } catch (error) {
      console.error('FloatWindowManager: Failed to set opacity:', error)
      // Revert to previous value on failure
      this.state.opacity = previousOpacity
      return false
    }
  }

  /**
   * Gets the current window opacity
   * @returns {number} - Current opacity value (0.3 to 1.0)
   * Requirements: 2.2
   */
  getOpacity () {
    return this.state.opacity
  }

  /**
   * Sets the always-on-top state
   * @param {boolean} enabled - Whether to enable always-on-top
   * @returns {boolean} - True if successful, false otherwise
   * Requirements: 3.2, 3.3, 12.3
   */
  setAlwaysOnTop (enabled) {
    if (typeof enabled !== 'boolean') {
      console.error('FloatWindowManager: Invalid always-on-top value - must be boolean')
      return false
    }

    try {
      // Use 'floating' level for always-on-top to work across spaces
      // This ensures the window stays on top in all macOS contexts
      this.window.setAlwaysOnTop(enabled, 'floating')
      this.state.alwaysOnTop = enabled
      return true
    } catch (error) {
      console.error('FloatWindowManager: Failed to set always-on-top:', error)
      return false
    }
  }

  /**
   * Gets the current always-on-top state
   * @returns {boolean} - Current always-on-top state
   * Requirements: 3.2
   */
  isAlwaysOnTop () {
    return this.state.alwaysOnTop
  }

  /**
   * Toggles Picture-in-Picture mode
   * @returns {boolean} - New PIP state (true if now in PIP mode)
   * Requirements: 4.2, 4.3, 4.4, 4.5
   */
  togglePIPMode () {
    try {
      if (this.state.isPIP) {
        // Exit PIP mode - restore previous bounds
        if (this.state.savedBounds) {
          this.window.setBounds(this.state.savedBounds)
          this.state.savedBounds = null
        }
        this.state.isPIP = false
      } else {
        // Enter PIP mode - save current bounds and resize
        this.state.savedBounds = this.window.getBounds()

        // Set PIP dimensions while maintaining current position
        const currentBounds = this.window.getBounds()
        this.window.setBounds({
          x: currentBounds.x,
          y: currentBounds.y,
          width: this.PIP_WIDTH,
          height: this.PIP_HEIGHT
        })

        this.state.isPIP = true
      }

      return this.state.isPIP
    } catch (error) {
      console.error('FloatWindowManager: Failed to toggle PIP mode:', error)
      return this.state.isPIP
    }
  }

  /**
   * Gets the current PIP mode state
   * @returns {boolean} - True if in PIP mode
   * Requirements: 4.2
   */
  isPIPMode () {
    return this.state.isPIP
  }

  /**
   * Saves the current window state to settings
   * @param {Object} floatSettings - FloatSettings instance for persistence
   * Requirements: 2.5, 3.5, 12.4
   */
  saveState (floatSettings) {
    if (!floatSettings) {
      console.warn('FloatWindowManager: No settings instance provided for saveState')
      return
    }

    try {
      const currentBounds = this.window.getBounds()

      floatSettings.set('opacity', this.state.opacity)
      floatSettings.set('alwaysOnTop', this.state.alwaysOnTop)
      floatSettings.set('lastWindowBounds', {
        width: currentBounds.width,
        height: currentBounds.height,
        x: currentBounds.x,
        y: currentBounds.y
      })

      // Save PIP state and saved bounds if in PIP mode
      if (this.state.isPIP && this.state.savedBounds) {
        floatSettings.set('isPIP', true)
        floatSettings.set('pipSavedBounds', this.state.savedBounds)
      } else {
        floatSettings.set('isPIP', false)
      }

      floatSettings.save()
    } catch (error) {
      console.error('FloatWindowManager: Failed to save state:', error)
    }
  }

  /**
   * Restores window state from settings
   * @param {Object} floatSettings - FloatSettings instance for loading state
   * Requirements: 2.5, 3.5, 12.4
   */
  restoreState (floatSettings) {
    if (!floatSettings) {
      console.warn('FloatWindowManager: No settings instance provided for restoreState')
      return
    }

    try {
      // Restore opacity
      const savedOpacity = floatSettings.get('opacity', 0.95)
      this.setOpacity(savedOpacity)

      // Restore always-on-top
      const savedAlwaysOnTop = floatSettings.get('alwaysOnTop', false)
      this.setAlwaysOnTop(savedAlwaysOnTop)

      // Restore PIP state
      const wasPIP = floatSettings.get('isPIP', false)
      if (wasPIP) {
        const pipSavedBounds = floatSettings.get('pipSavedBounds', null)
        if (pipSavedBounds) {
          this.state.savedBounds = pipSavedBounds
          this.state.isPIP = true

          // Apply PIP dimensions
          const currentBounds = this.window.getBounds()
          this.window.setBounds({
            x: currentBounds.x,
            y: currentBounds.y,
            width: this.PIP_WIDTH,
            height: this.PIP_HEIGHT
          })
        }
      }
    } catch (error) {
      console.error('FloatWindowManager: Failed to restore state:', error)
    }
  }

  /**
   * Gets the current state object (for debugging/testing)
   * @returns {Object} - Current state
   */
  getState () {
    return { ...this.state }
  }
}

module.exports = FloatWindowManager
