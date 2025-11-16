/**
 * FloatSettings
 *
 * Manages Float-specific settings and persistence for Float Browser.
 * Integrates with Min Browser's settings system while maintaining
 * separation of Float-specific configuration.
 *
 * Requirements: 2.5, 3.5, 9.1, 9.2, 9.3, 12.5
 *
 * Note: This module relies on fs, path, and writeFileAtomic being already
 * required in the concatenated build (from main.js and settingsMain.js)
 */

class FloatSettings {
  /**
   * Creates a FloatSettings instance
   * @param {string} userDataPath - Path to user data directory
   */
  constructor (userDataPath) {
    if (!userDataPath) {
      throw new Error('FloatSettings requires a userDataPath')
    }

    this.filePath = path.join(userDataPath, 'float-settings.json')
    this.settings = {}
    this.fileWritePromise = null

    // Initialize with defaults
    this._initializeDefaults()

    // Load existing settings
    this.load()
  }

  /**
   * Initialize default settings
   * Requirements: 9.2, 9.3, 6.1
   */
  _initializeDefaults () {
    this.defaults = {
      // Opacity settings (Requirement 2.5, 9.2)
      opacity: 0.95,
      defaultOpacity: 0.95,

      // Always-on-top settings (Requirement 3.5, 9.3)
      alwaysOnTop: true,
      defaultAlwaysOnTop: true,

      // Global shortcuts (Requirement 5.1, 9.4)
      globalShortcuts: {
        toggleVisibility: 'CommandOrControl+Shift+F',
        toggleAlwaysOnTop: 'CommandOrControl+Shift+A',
        togglePIP: 'CommandOrControl+Shift+P'
      },

      // Window profiles (Requirement 6.1, 9.5)
      windowProfiles: {
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
      },

      // Window state persistence (Requirement 2.5, 3.5, 4.5)
      lastWindowBounds: null,
      isPIP: false,
      pipSavedBounds: null,

      // PIP dimensions
      pipBounds: {
        width: 400,
        height: 300
      }
    }
  }

  /**
   * Gets a setting value
   * @param {string} key - Setting key (supports dot notation for nested keys)
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Setting value or default
   * Requirements: 9.1
   */
  get (key, defaultValue) {
    if (!key) {
      return defaultValue
    }

    // Support dot notation for nested keys (e.g., 'windowProfiles.small')
    const keys = key.split('.')
    let value = this.settings

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Key doesn't exist, try defaults
        value = this.defaults
        for (const dk of keys) {
          if (value && typeof value === 'object' && dk in value) {
            value = value[dk]
          } else {
            return defaultValue !== undefined ? defaultValue : null
          }
        }
        return value
      }
    }

    return value
  }

  /**
   * Sets a setting value
   * @param {string} key - Setting key (supports dot notation for nested keys)
   * @param {*} value - Value to set
   * @returns {boolean} - True if successful
   * Requirements: 9.1
   */
  set (key, value) {
    if (!key) {
      console.error('FloatSettings: Cannot set value without key')
      return false
    }

    // Support dot notation for nested keys
    const keys = key.split('.')
    const lastKey = keys.pop()
    let target = this.settings

    // Navigate to the parent object, creating nested objects as needed
    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {}
      }
      target = target[k]
    }

    // Set the value
    target[lastKey] = value
    return true
  }

  /**
   * Saves settings to disk
   * Uses atomic write to prevent corruption
   * Requirements: 2.5, 3.5, 12.4
   */
  save () {
    // Queue writes to prevent corruption from simultaneous writes
    const newFileWrite = () => {
      return new Promise((resolve, reject) => {
        try {
          const data = JSON.stringify(this.settings, null, 2)
          writeFileAtomic(this.filePath, data, {}, (err) => {
            if (err) {
              console.error('FloatSettings: Failed to save settings:', err)
              reject(err)
            } else {
              resolve()
            }
          })
        } catch (error) {
          console.error('FloatSettings: Failed to stringify settings:', error)
          reject(error)
        }
      })
    }

    const ongoingFileWrite = () => {
      return this.fileWritePromise || Promise.resolve()
    }

    // Chain writes to ensure they happen sequentially
    this.fileWritePromise = ongoingFileWrite()
      .then(newFileWrite)
      .then(() => {
        this.fileWritePromise = null
      })
      .catch((error) => {
        console.error('FloatSettings: Save failed:', error)
        this.fileWritePromise = null
      })
  }

  /**
   * Loads settings from disk
   * Requirements: 2.5, 3.5, 12.5
   */
  load () {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf-8')
      if (fileData) {
        this.settings = JSON.parse(fileData)

        // Validate loaded settings
        if (!this._validateSettings()) {
          console.warn('FloatSettings: Loaded settings failed validation, resetting to defaults')
          this.resetToDefaults()
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, use defaults
        this.settings = JSON.parse(JSON.stringify(this.defaults))
      } else if (error instanceof SyntaxError) {
        // Corrupted JSON file (Requirement 12.5)
        console.error('FloatSettings: Settings file corrupted, resetting to defaults')
        this.resetToDefaults()
      } else {
        console.error('FloatSettings: Failed to load settings:', error)
        this.settings = JSON.parse(JSON.stringify(this.defaults))
      }
    }
  }

  /**
   * Validates settings structure and values
   * Requirements: 12.5
   * @returns {boolean} - True if settings are valid
   */
  _validateSettings () {
    try {
      // Validate opacity values
      const opacity = this.settings.opacity
      if (opacity !== undefined && (typeof opacity !== 'number' || opacity < 0.3 || opacity > 1.0)) {
        console.warn('FloatSettings: Invalid opacity value:', opacity)
        return false
      }

      const defaultOpacity = this.settings.defaultOpacity
      if (defaultOpacity !== undefined && (typeof defaultOpacity !== 'number' || defaultOpacity < 0.3 || defaultOpacity > 1.0)) {
        console.warn('FloatSettings: Invalid defaultOpacity value:', defaultOpacity)
        return false
      }

      // Validate window bounds if present
      if (this.settings.lastWindowBounds) {
        const bounds = this.settings.lastWindowBounds
        if (!this._validateBounds(bounds)) {
          console.warn('FloatSettings: Invalid lastWindowBounds')
          return false
        }
      }

      if (this.settings.pipSavedBounds) {
        const bounds = this.settings.pipSavedBounds
        if (!this._validateBounds(bounds)) {
          console.warn('FloatSettings: Invalid pipSavedBounds')
          return false
        }
      }

      // Validate window profiles
      if (this.settings.windowProfiles) {
        for (const [key, profile] of Object.entries(this.settings.windowProfiles)) {
          if (!this._validateProfile(profile)) {
            console.warn('FloatSettings: Invalid profile:', key)
            return false
          }
        }
      }

      return true
    } catch (error) {
      console.error('FloatSettings: Validation error:', error)
      return false
    }
  }

  /**
   * Validates window bounds object
   * Requirements: 12.5
   * @param {Object} bounds - Bounds object to validate
   * @returns {boolean} - True if valid
   */
  _validateBounds (bounds) {
    if (!bounds || typeof bounds !== 'object') {
      return false
    }

    const { width, height, x, y } = bounds

    // Width and height must be positive numbers
    if (typeof width !== 'number' || width <= 0 || width > 10000) {
      return false
    }
    if (typeof height !== 'number' || height <= 0 || height > 10000) {
      return false
    }

    // x and y must be numbers (can be negative for multi-monitor setups)
    if (x !== undefined && (typeof x !== 'number' || x < -10000 || x > 10000)) {
      return false
    }
    if (y !== undefined && (typeof y !== 'number' || y < -10000 || y > 10000)) {
      return false
    }

    return true
  }

  /**
   * Validates a window profile
   * Requirements: 12.5
   * @param {Object} profile - Profile object to validate
   * @returns {boolean} - True if valid
   */
  _validateProfile (profile) {
    if (!profile || typeof profile !== 'object') {
      return false
    }

    const { name, width, height, opacity, alwaysOnTop } = profile

    // Name must be a non-empty string
    if (typeof name !== 'string' || name.length === 0) {
      return false
    }

    // Width and height must be positive numbers
    if (typeof width !== 'number' || width <= 0 || width > 10000) {
      return false
    }
    if (typeof height !== 'number' || height <= 0 || height > 10000) {
      return false
    }

    // Opacity must be between 0.3 and 1.0
    if (typeof opacity !== 'number' || opacity < 0.3 || opacity > 1.0) {
      return false
    }

    // alwaysOnTop must be boolean
    if (typeof alwaysOnTop !== 'boolean') {
      return false
    }

    return true
  }

  /**
   * Resets all settings to defaults
   * Requirements: 12.5
   */
  resetToDefaults () {
    this.settings = JSON.parse(JSON.stringify(this.defaults))
    this.save()
  }

  /**
   * Gets all settings (for debugging/export)
   * @returns {Object} - All settings
   */
  getAll () {
    return JSON.parse(JSON.stringify(this.settings))
  }

  /**
   * Gets the file path where settings are stored
   * @returns {string} - File path
   */
  getFilePath () {
    return this.filePath
  }
}

module.exports = FloatSettings
