/**
 * FloatProfiles
 *
 * Manages window size profiles for Float Browser, allowing users to quickly
 * switch between predefined or custom window configurations.
 *
 * Requirements: 6.1, 6.2, 6.4, 6.5
 */

class FloatProfiles {
  /**
   * Creates a FloatProfiles instance
   * @param {FloatWindowManager} floatWindowManager - Window manager instance
   * @param {FloatSettings} floatSettings - Settings instance
   */
  constructor (floatWindowManager, floatSettings) {
    if (!floatWindowManager) {
      throw new Error('FloatProfiles requires a FloatWindowManager instance')
    }
    if (!floatSettings) {
      throw new Error('FloatProfiles requires a FloatSettings instance')
    }

    this.windowManager = floatWindowManager
    this.settings = floatSettings

    // Load profiles from settings
    this._loadProfiles()
  }

  /**
   * Loads profiles from settings
   * Requirements: 6.1, 6.2, 6.4
   * @private
   */
  _loadProfiles () {
    // Get profiles from settings, or use defaults if not present
    const savedProfiles = this.settings.get('windowProfiles', null)

    if (savedProfiles && typeof savedProfiles === 'object') {
      this.profiles = savedProfiles
    } else {
      // Initialize with default profiles
      this.profiles = this._getDefaultProfiles()
      this.settings.set('windowProfiles', this.profiles)
      this.settings.save()
    }
  }

  /**
   * Gets default profiles
   * Requirements: 6.1
   * @private
   * @returns {Object} - Default profiles
   */
  _getDefaultProfiles () {
    return {
      small: {
        name: 'Small',
        width: 400,
        height: 300,
        opacity: 0.8,
        alwaysOnTop: true
      },
      medium: {
        name: 'Medium',
        width: 800,
        height: 600,
        opacity: 0.9,
        alwaysOnTop: true
      },
      large: {
        name: 'Large',
        width: 1200,
        height: 800,
        opacity: 1.0,
        alwaysOnTop: false
      }
    }
  }

  /**
   * Gets all profiles
   * Requirements: 6.2
   * @returns {Object} - All profiles as an object with profile names as keys
   */
  getProfiles () {
    return JSON.parse(JSON.stringify(this.profiles))
  }

  /**
   * Gets a specific profile by name
   * Requirements: 6.2
   * @param {string} name - Profile name (key)
   * @returns {Object|null} - Profile object or null if not found
   */
  getProfile (name) {
    if (!name || typeof name !== 'string') {
      console.error('FloatProfiles: Invalid profile name')
      return null
    }

    const profile = this.profiles[name]
    if (!profile) {
      console.warn('FloatProfiles: Profile not found:', name)
      return null
    }

    return JSON.parse(JSON.stringify(profile))
  }

  /**
   * Creates a new custom profile
   * Requirements: 6.2, 6.4
   * @param {string} name - Profile name (key)
   * @param {Object} config - Profile configuration
   * @param {string} config.name - Display name
   * @param {number} config.width - Window width
   * @param {number} config.height - Window height
   * @param {number} config.opacity - Opacity (0.3 to 1.0)
   * @param {boolean} config.alwaysOnTop - Always-on-top state
   * @returns {boolean} - True if successful
   */
  createProfile (name, config) {
    if (!name || typeof name !== 'string') {
      console.error('FloatProfiles: Invalid profile name')
      return false
    }

    // Check if profile already exists
    if (this.profiles[name]) {
      console.error('FloatProfiles: Profile already exists:', name)
      return false
    }

    // Validate config
    if (!this._validateProfileConfig(config)) {
      console.error('FloatProfiles: Invalid profile configuration')
      return false
    }

    try {
      // Create profile
      this.profiles[name] = {
        name: config.name,
        width: config.width,
        height: config.height,
        opacity: config.opacity,
        alwaysOnTop: config.alwaysOnTop
      }

      // Save to settings
      this.settings.set('windowProfiles', this.profiles)
      this.settings.save()

      return true
    } catch (error) {
      console.error('FloatProfiles: Failed to create profile:', error)
      return false
    }
  }

  /**
   * Updates an existing profile
   * Requirements: 6.2, 6.4
   * @param {string} name - Profile name (key)
   * @param {Object} config - Updated profile configuration
   * @returns {boolean} - True if successful
   */
  updateProfile (name, config) {
    if (!name || typeof name !== 'string') {
      console.error('FloatProfiles: Invalid profile name')
      return false
    }

    // Check if profile exists
    if (!this.profiles[name]) {
      console.error('FloatProfiles: Profile not found:', name)
      return false
    }

    // Validate config
    if (!this._validateProfileConfig(config)) {
      console.error('FloatProfiles: Invalid profile configuration')
      return false
    }

    try {
      // Update profile
      this.profiles[name] = {
        name: config.name,
        width: config.width,
        height: config.height,
        opacity: config.opacity,
        alwaysOnTop: config.alwaysOnTop
      }

      // Save to settings
      this.settings.set('windowProfiles', this.profiles)
      this.settings.save()

      return true
    } catch (error) {
      console.error('FloatProfiles: Failed to update profile:', error)
      return false
    }
  }

  /**
   * Deletes a profile
   * Requirements: 6.2, 6.4
   * @param {string} name - Profile name (key)
   * @returns {boolean} - True if successful
   */
  deleteProfile (name) {
    if (!name || typeof name !== 'string') {
      console.error('FloatProfiles: Invalid profile name')
      return false
    }

    // Check if profile exists
    if (!this.profiles[name]) {
      console.warn('FloatProfiles: Profile not found:', name)
      return false
    }

    try {
      // Delete profile
      delete this.profiles[name]

      // Save to settings
      this.settings.set('windowProfiles', this.profiles)
      this.settings.save()

      return true
    } catch (error) {
      console.error('FloatProfiles: Failed to delete profile:', error)
      return false
    }
  }

  /**
   * Applies a profile to the window
   * Requirements: 6.5
   * @param {string} name - Profile name (key)
   * @returns {boolean} - True if successful
   */
  applyProfile (name) {
    if (!name || typeof name !== 'string') {
      console.error('FloatProfiles: Invalid profile name')
      return false
    }

    const profile = this.profiles[name]
    if (!profile) {
      console.error('FloatProfiles: Profile not found:', name)
      return false
    }

    try {
      const startTime = Date.now()

      // Get the window instance
      const window = this.windowManager.window

      // Update window bounds
      const currentBounds = window.getBounds()
      window.setBounds({
        x: currentBounds.x,
        y: currentBounds.y,
        width: profile.width,
        height: profile.height
      })

      // Update opacity
      this.windowManager.setOpacity(profile.opacity)

      // Update always-on-top
      this.windowManager.setAlwaysOnTop(profile.alwaysOnTop)

      // Save current profile name
      this.settings.set('currentProfile', name)
      this.settings.save()

      const elapsed = Date.now() - startTime
      if (elapsed > 100) {
        console.warn(`FloatProfiles: Profile application took ${elapsed}ms (requirement: <100ms)`)
      }

      return true
    } catch (error) {
      console.error('FloatProfiles: Failed to apply profile:', error)
      return false
    }
  }

  /**
   * Validates profile configuration
   * @private
   * @param {Object} config - Profile configuration to validate
   * @returns {boolean} - True if valid
   */
  _validateProfileConfig (config) {
    if (!config || typeof config !== 'object') {
      return false
    }

    const { name, width, height, opacity, alwaysOnTop } = config

    // Name must be a non-empty string
    if (typeof name !== 'string' || name.length === 0) {
      console.error('FloatProfiles: Invalid name - must be non-empty string')
      return false
    }

    // Width must be a positive number
    if (typeof width !== 'number' || width <= 0 || width > 10000) {
      console.error('FloatProfiles: Invalid width - must be between 1 and 10000')
      return false
    }

    // Height must be a positive number
    if (typeof height !== 'number' || height <= 0 || height > 10000) {
      console.error('FloatProfiles: Invalid height - must be between 1 and 10000')
      return false
    }

    // Opacity must be between 0.3 and 1.0
    if (typeof opacity !== 'number' || opacity < 0.3 || opacity > 1.0) {
      console.error('FloatProfiles: Invalid opacity - must be between 0.3 and 1.0')
      return false
    }

    // alwaysOnTop must be boolean
    if (typeof alwaysOnTop !== 'boolean') {
      console.error('FloatProfiles: Invalid alwaysOnTop - must be boolean')
      return false
    }

    return true
  }

  /**
   * Gets the currently active profile name
   * @returns {string|null} - Current profile name or null
   */
  getCurrentProfile () {
    return this.settings.get('currentProfile', null)
  }

  /**
   * Resets profiles to defaults
   * @returns {boolean} - True if successful
   */
  resetToDefaults () {
    try {
      this.profiles = this._getDefaultProfiles()
      this.settings.set('windowProfiles', this.profiles)
      this.settings.save()
      return true
    } catch (error) {
      console.error('FloatProfiles: Failed to reset to defaults:', error)
      return false
    }
  }
}

module.exports = FloatProfiles
