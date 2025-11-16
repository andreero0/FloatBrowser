/**
 * FloatControls
 *
 * Provides UI controls for Float features integrated into Min's navbar.
 * Controls match Min's visual design language and interaction patterns.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 2.1, 2.3, 2.4, 2.5, 3.1, 3.2, 3.4, 3.5, 4.1, 4.2
 */

const { ipcRenderer } = require('electron')

class FloatControls {
  /**
   * Creates a FloatControls instance
   */
  constructor () {
    this.navbar = document.getElementById('navbar')
    this.container = null
    this.opacitySlider = null
    this.opacityLabel = null
    this.alwaysOnTopButton = null
    this.pipButton = null

    // State tracking
    this.state = {
      opacity: 100,
      alwaysOnTop: false,
      isPIP: false
    }

    // Performance optimization: throttle timer for opacity changes
    this.opacityThrottleTimer = null
  }

  /**
   * Initializes Float controls and inserts them into Min's navbar
   * Requirements: 7.1, 7.2, 7.3
   */
  initialize () {
    console.log('FloatControls: Initializing...')
    // Create the Float controls container
    this.createControlsContainer()

    // Create individual controls
    this.createOpacityControl()
    this.createAlwaysOnTopButton()
    this.createPIPButton()

    // Insert into navbar (before the right actions)
    const rightActions = this.navbar.querySelector('.navbar-right-actions')
    if (rightActions) {
      this.navbar.insertBefore(this.container, rightActions)
    } else {
      this.navbar.appendChild(this.container)
    }

    // Set up event handlers
    this.setupEventHandlers()
    console.log('FloatControls: Event handlers set up')

    // Load initial state from main process
    this.loadInitialState()
    console.log('FloatControls: Initialization complete')
  }

  /**
   * Creates the main container for Float controls
   * Requirements: 7.1
   */
  createControlsContainer () {
    this.container = document.createElement('div')
    this.container.id = 'float-controls'
    this.container.className = 'float-controls'
    this.container.style.display = 'flex'
    this.container.style.alignItems = 'center'
    this.container.style.gap = '0.5rem'
    this.container.style.marginLeft = '0.5rem'
    this.container.style.marginRight = '0.5rem'
  }

  /**
   * Creates the opacity slider control
   * Requirements: 7.2, 2.1, 2.4, 7.4
   */
  createOpacityControl () {
    console.log('FloatControls: Creating opacity control')
    const opacityControl = document.createElement('div')
    opacityControl.className = 'float-opacity-control'
    opacityControl.style.display = 'flex'
    opacityControl.style.alignItems = 'center'
    opacityControl.style.gap = '0.25rem'

    // Create slider
    this.opacitySlider = document.createElement('input')
    this.opacitySlider.type = 'range'
    this.opacitySlider.id = 'float-opacity-slider'
    this.opacitySlider.min = '30'
    this.opacitySlider.max = '100'
    this.opacitySlider.value = '100'
    this.opacitySlider.title = 'Window Opacity'
    // Width and height are controlled by CSS for proper styling
    this.opacitySlider.style.cursor = 'pointer'
    console.log('FloatControls: Opacity slider created')

    // Create label to display percentage
    this.opacityLabel = document.createElement('span')
    this.opacityLabel.className = 'float-opacity-label'
    this.opacityLabel.textContent = '100%'
    this.opacityLabel.style.fontSize = '13px'
    this.opacityLabel.style.minWidth = '40px'
    this.opacityLabel.style.opacity = '0.8'

    opacityControl.appendChild(this.opacitySlider)
    opacityControl.appendChild(this.opacityLabel)

    this.container.appendChild(opacityControl)
  }

  /**
   * Creates the always-on-top toggle button
   * Requirements: 7.3, 3.1, 3.4, 7.4
   */
  createAlwaysOnTopButton () {
    this.alwaysOnTopButton = document.createElement('button')
    this.alwaysOnTopButton.id = 'float-always-on-top-button'
    this.alwaysOnTopButton.className = 'navbar-action-button i carbon:pin'
    this.alwaysOnTopButton.title = 'Always on Top (Cmd+Shift+A)'
    this.alwaysOnTopButton.tabIndex = -1
    this.alwaysOnTopButton.style.fontSize = '1.4em'

    this.container.appendChild(this.alwaysOnTopButton)
  }

  /**
   * Creates the PIP mode toggle button
   * Requirements: 7.4, 4.1, 7.4
   */
  createPIPButton () {
    this.pipButton = document.createElement('button')
    this.pipButton.id = 'float-pip-button'
    this.pipButton.className = 'navbar-action-button i carbon:fit-to-screen'
    this.pipButton.title = 'Picture-in-Picture (Cmd+Shift+P)'
    this.pipButton.tabIndex = -1
    this.pipButton.style.fontSize = '1.4em'

    this.container.appendChild(this.pipButton)
  }

  /**
   * Sets up event handlers for all controls
   * Requirements: 7.5, 2.3, 3.2, 4.2
   */
  setupEventHandlers () {
    // Opacity slider input event
    this.opacitySlider.addEventListener('input', (e) => {
      this.onOpacityChange(parseInt(e.target.value))
    })

    // Always-on-top button click event
    this.alwaysOnTopButton.addEventListener('click', () => {
      this.onAlwaysOnTopClick()
    })

    // PIP button click event
    this.pipButton.addEventListener('click', () => {
      this.onPIPClick()
    })

    // Listen for state changes from main process
    ipcRenderer.on('float:state-changed', (event, newState) => {
      this.updateUIState(newState)
    })
  }

  /**
   * Handles opacity slider changes
   * Requirements: 2.3, 7.5, 10.1, 10.5
   * Performance: Throttled to 60fps for smooth updates
   */
  onOpacityChange (value) {
    console.log('FloatControls: Opacity slider changed to:', value)
    // Update label immediately for responsive feel
    this.opacityLabel.textContent = value + '%'
    this.state.opacity = value

    // Throttle IPC calls to 60fps (16ms) for performance
    if (this.opacityThrottleTimer) {
      clearTimeout(this.opacityThrottleTimer)
    }

    this.opacityThrottleTimer = setTimeout(() => {
      const opacityValue = value / 100
      console.log('FloatControls: Sending IPC to set opacity to:', opacityValue)
      ipcRenderer.invoke('float:set-opacity', opacityValue)
        .then(result => {
          console.log('FloatControls: Opacity set result:', result)
        })
        .catch(error => {
          console.error('FloatControls: Failed to set opacity:', error)
        })
    }, 16) // 16ms = 60fps
  }

  /**
   * Handles always-on-top button clicks
   * Requirements: 3.2, 7.5
   */
  onAlwaysOnTopClick () {
    console.log('FloatControls: Always-on-top button clicked')
    const newState = !this.state.alwaysOnTop
    console.log('FloatControls: Toggling always-on-top to:', newState)

    ipcRenderer.invoke('float:set-always-on-top', newState)
      .then(success => {
        console.log('FloatControls: Always-on-top result:', success)
        if (success) {
          this.state.alwaysOnTop = newState
          this.updateAlwaysOnTopButtonState()
        }
      })
      .catch(error => {
        console.error('FloatControls: Failed to toggle always-on-top:', error)
      })
  }

  /**
   * Handles PIP button clicks
   * Requirements: 4.2, 7.5
   */
  onPIPClick () {
    console.log('FloatControls: PIP button clicked')
    ipcRenderer.invoke('float:toggle-pip')
      .then(newPIPState => {
        console.log('FloatControls: PIP result:', newPIPState)
        this.state.isPIP = newPIPState
        this.updatePIPButtonState()
      })
      .catch(error => {
        console.error('FloatControls: Failed to toggle PIP:', error)
      })
  }

  /**
   * Loads initial state from main process
   * Requirements: 7.6, 2.5, 3.5
   */
  loadInitialState () {
    // Get opacity
    ipcRenderer.invoke('float:get-opacity')
      .then(opacity => {
        const opacityPercent = Math.round(opacity * 100)
        this.state.opacity = opacityPercent
        this.opacitySlider.value = opacityPercent
        this.opacityLabel.textContent = opacityPercent + '%'
      })
      .catch(error => {
        console.error('FloatControls: Failed to get opacity:', error)
      })

    // Get always-on-top state
    ipcRenderer.invoke('float:get-always-on-top')
      .then(alwaysOnTop => {
        this.state.alwaysOnTop = alwaysOnTop
        this.updateAlwaysOnTopButtonState()
      })
      .catch(error => {
        console.error('FloatControls: Failed to get always-on-top state:', error)
      })

    // Get PIP state
    ipcRenderer.invoke('float:get-pip-state')
      .then(isPIP => {
        this.state.isPIP = isPIP
        this.updatePIPButtonState()
      })
      .catch(error => {
        console.error('FloatControls: Failed to get PIP state:', error)
      })
  }

  /**
   * Updates UI to reflect state changes
   * Requirements: 7.6, 2.5, 3.5
   */
  updateUIState (newState) {
    if (newState.opacity !== undefined) {
      const opacityPercent = Math.round(newState.opacity * 100)
      this.state.opacity = opacityPercent
      this.opacitySlider.value = opacityPercent
      this.opacityLabel.textContent = opacityPercent + '%'
    }

    if (newState.alwaysOnTop !== undefined) {
      this.state.alwaysOnTop = newState.alwaysOnTop
      this.updateAlwaysOnTopButtonState()
    }

    if (newState.isPIP !== undefined) {
      this.state.isPIP = newState.isPIP
      this.updatePIPButtonState()
    }
  }

  /**
   * Public method to update state (called from menu renderer)
   * Requirements: 8.4
   */
  updateState (newState) {
    this.updateUIState(newState)
  }

  /**
   * Updates the always-on-top button visual state
   * Requirements: 3.4, 7.4
   */
  updateAlwaysOnTopButtonState () {
    if (this.state.alwaysOnTop) {
      this.alwaysOnTopButton.style.opacity = '1'
      this.alwaysOnTopButton.style.color = 'royalblue'
    } else {
      this.alwaysOnTopButton.style.opacity = '0.6'
      this.alwaysOnTopButton.style.color = ''
    }
  }

  /**
   * Updates the PIP button visual state
   * Requirements: 7.4
   */
  updatePIPButtonState () {
    if (this.state.isPIP) {
      this.pipButton.style.opacity = '1'
      this.pipButton.style.color = 'royalblue'
    } else {
      this.pipButton.style.opacity = '0.6'
      this.pipButton.style.color = ''
    }
  }

  /**
   * Gets the current state (for debugging)
   * @returns {Object} - Current state
   */
  getState () {
    return { ...this.state }
  }
}

module.exports = FloatControls
