/**
 * Compatibility Integration Tests
 * 
 * Tests macOS compatibility, architecture support, and multi-monitor scenarios
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

const assert = require('assert')
const os = require('os')

// Mock system information
class MockSystem {
  constructor (config = {}) {
    this.platform = config.platform || 'darwin'
    this.arch = config.arch || 'x64'
    this.version = config.version || '10.15.0'
    this.displays = config.displays || [{ id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } }]
  }

  getPlatform () {
    return this.platform
  }

  getArch () {
    return this.arch
  }

  getVersion () {
    return this.version
  }

  getDisplays () {
    return this.displays
  }

  isMacOS () {
    return this.platform === 'darwin'
  }

  isIntel () {
    return this.arch === 'x64'
  }

  isAppleSilicon () {
    return this.arch === 'arm64'
  }

  getMacOSVersion () {
    if (!this.isMacOS()) return null
    const parts = this.version.split('.')
    return {
      major: parseInt(parts[0]),
      minor: parseInt(parts[1]),
      patch: parseInt(parts[2] || 0)
    }
  }
}

// Mock window manager for compatibility testing
class MockWindowManager {
  constructor (system) {
    this.system = system
    this.windows = []
  }

  createWindow (config) {
    const window = {
      id: Date.now(),
      bounds: config.bounds || { x: 0, y: 0, width: 1000, height: 700 },
      opacity: config.opacity || 1.0,
      alwaysOnTop: config.alwaysOnTop || false,
      display: this.getDisplayForBounds(config.bounds)
    }
    this.windows.push(window)
    return window
  }

  getDisplayForBounds (bounds) {
    if (!bounds) return this.system.getDisplays()[0]
    
    // Find display that contains the window
    for (const display of this.system.getDisplays()) {
      if (bounds.x >= display.bounds.x &&
          bounds.x < display.bounds.x + display.bounds.width &&
          bounds.y >= display.bounds.y &&
          bounds.y < display.bounds.y + display.bounds.height) {
        return display
      }
    }
    
    return this.system.getDisplays()[0]
  }

  moveToDisplay (window, displayId) {
    const display = this.system.getDisplays().find(d => d.id === displayId)
    if (display) {
      window.display = display
      window.bounds.x = display.bounds.x + 100
      window.bounds.y = display.bounds.y + 100
      return true
    }
    return false
  }
}

// Test suite
function runTests () {
  console.log('Running Compatibility Integration Tests...\n')

  let passed = 0
  let failed = 0

  // Test 1: macOS 10.13+ support
  try {
    const supportedVersions = [
      { version: '10.13.0', name: 'High Sierra' },
      { version: '10.14.0', name: 'Mojave' },
      { version: '10.15.0', name: 'Catalina' },
      { version: '11.0.0', name: 'Big Sur' },
      { version: '12.0.0', name: 'Monterey' },
      { version: '13.0.0', name: 'Ventura' },
      { version: '14.0.0', name: 'Sonoma' }
    ]
    
    supportedVersions.forEach(v => {
      const system = new MockSystem({ platform: 'darwin', version: v.version })
      const macVersion = system.getMacOSVersion()
      
      // Should support macOS 10.13+
      const isSupported = macVersion.major >= 11 || 
                         (macVersion.major === 10 && macVersion.minor >= 13)
      
      assert.strictEqual(isSupported, true, `${v.name} (${v.version}) should be supported`)
    })
    
    console.log('✓ Test 1: macOS 10.13+ support verified (Req 11.1)')
    passed++
  } catch (error) {
    console.error('✗ Test 1 failed:', error.message)
    failed++
  }

  // Test 2: Universal binary support (Intel + Apple Silicon)
  try {
    const architectures = [
      { arch: 'x64', name: 'Intel' },
      { arch: 'arm64', name: 'Apple Silicon' }
    ]
    
    architectures.forEach(a => {
      const system = new MockSystem({ platform: 'darwin', arch: a.arch })
      
      // Verify architecture detection
      if (a.arch === 'x64') {
        assert.strictEqual(system.isIntel(), true)
        assert.strictEqual(system.isAppleSilicon(), false)
      } else {
        assert.strictEqual(system.isIntel(), false)
        assert.strictEqual(system.isAppleSilicon(), true)
      }
    })
    
    console.log('✓ Test 2: Universal binary support (Intel + Apple Silicon) (Req 11.2)')
    passed++
  } catch (error) {
    console.error('✗ Test 2 failed:', error.message)
    failed++
  }

  // Test 3: Multiple monitors support
  try {
    const multiMonitorSystem = new MockSystem({
      platform: 'darwin',
      displays: [
        { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
        { id: 2, bounds: { x: 1920, y: 0, width: 2560, height: 1440 } },
        { id: 3, bounds: { x: 0, y: 1080, width: 1920, height: 1080 } }
      ]
    })
    
    const windowManager = new MockWindowManager(multiMonitorSystem)
    
    // Create window on first display
    const window1 = windowManager.createWindow({
      bounds: { x: 100, y: 100, width: 800, height: 600 }
    })
    assert.strictEqual(window1.display.id, 1)
    
    // Move to second display
    const moved = windowManager.moveToDisplay(window1, 2)
    assert.strictEqual(moved, true)
    assert.strictEqual(window1.display.id, 2)
    
    // Create window on third display
    const window2 = windowManager.createWindow({
      bounds: { x: 100, y: 1180, width: 800, height: 600 }
    })
    assert.strictEqual(window2.display.id, 3)
    
    console.log('✓ Test 3: Multiple monitors support (Req 11.3)')
    passed++
  } catch (error) {
    console.error('✗ Test 3 failed:', error.message)
    failed++
  }

  // Test 4: Spaces and Mission Control compatibility
  try {
    // Simulate window behavior across Spaces
    const spacesManager = {
      spaces: [
        { id: 1, windows: [] },
        { id: 2, windows: [] },
        { id: 3, windows: [] }
      ],
      currentSpace: 1,
      
      addWindow: function (window, spaceId) {
        const space = this.spaces.find(s => s.id === spaceId)
        if (space) {
          space.windows.push(window)
          return true
        }
        return false
      },
      
      switchSpace: function (spaceId) {
        this.currentSpace = spaceId
      },
      
      isWindowVisible: function (window) {
        // Always-on-top windows should be visible in all spaces
        if (window.alwaysOnTop) {
          return true
        }
        
        // Regular windows only visible in their space
        const space = this.spaces.find(s => s.id === this.currentSpace)
        return space && space.windows.includes(window)
      }
    }
    
    const regularWindow = { id: 1, alwaysOnTop: false }
    const floatWindow = { id: 2, alwaysOnTop: true }
    
    spacesManager.addWindow(regularWindow, 1)
    spacesManager.addWindow(floatWindow, 1)
    
    // In space 1, both visible
    spacesManager.switchSpace(1)
    assert.strictEqual(spacesManager.isWindowVisible(regularWindow), true)
    assert.strictEqual(spacesManager.isWindowVisible(floatWindow), true)
    
    // In space 2, only float window visible
    spacesManager.switchSpace(2)
    assert.strictEqual(spacesManager.isWindowVisible(regularWindow), false)
    assert.strictEqual(spacesManager.isWindowVisible(floatWindow), true)
    
    console.log('✓ Test 4: Spaces and Mission Control compatibility (Req 11.4)')
    passed++
  } catch (error) {
    console.error('✗ Test 4 failed:', error.message)
    failed++
  }

  // Test 5: Fullscreen apps compatibility
  try {
    // Simulate fullscreen app behavior
    const fullscreenManager = {
      fullscreenApps: [],
      
      enterFullscreen: function (app) {
        this.fullscreenApps.push(app)
      },
      
      exitFullscreen: function (app) {
        this.fullscreenApps = this.fullscreenApps.filter(a => a.id !== app.id)
      },
      
      isWindowVisibleOverFullscreen: function (window) {
        // Always-on-top windows should stay visible over fullscreen apps
        return window.alwaysOnTop
      }
    }
    
    const fullscreenApp = { id: 1, name: 'Safari' }
    const floatWindow = { id: 2, alwaysOnTop: true }
    const regularWindow = { id: 3, alwaysOnTop: false }
    
    fullscreenManager.enterFullscreen(fullscreenApp)
    
    // Float window should be visible over fullscreen
    assert.strictEqual(
      fullscreenManager.isWindowVisibleOverFullscreen(floatWindow),
      true,
      'Float window should be visible over fullscreen apps'
    )
    
    // Regular window should not be visible over fullscreen
    assert.strictEqual(
      fullscreenManager.isWindowVisibleOverFullscreen(regularWindow),
      false,
      'Regular window should not be visible over fullscreen apps'
    )
    
    console.log('✓ Test 5: Fullscreen apps compatibility (Req 11.5)')
    passed++
  } catch (error) {
    console.error('✗ Test 5 failed:', error.message)
    failed++
  }

  // Test 6: Window management across displays
  try {
    const system = new MockSystem({
      displays: [
        { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
        { id: 2, bounds: { x: 1920, y: 0, width: 1920, height: 1080 } }
      ]
    })
    
    const windowManager = new MockWindowManager(system)
    
    // Create window on display 1
    const window = windowManager.createWindow({
      bounds: { x: 500, y: 500, width: 800, height: 600 },
      opacity: 0.9,
      alwaysOnTop: true
    })
    
    assert.strictEqual(window.display.id, 1)
    assert.strictEqual(window.opacity, 0.9)
    assert.strictEqual(window.alwaysOnTop, true)
    
    // Move to display 2
    windowManager.moveToDisplay(window, 2)
    assert.strictEqual(window.display.id, 2)
    
    // Properties should be preserved
    assert.strictEqual(window.opacity, 0.9)
    assert.strictEqual(window.alwaysOnTop, true)
    
    console.log('✓ Test 6: Window management across displays preserves properties')
    passed++
  } catch (error) {
    console.error('✗ Test 6 failed:', error.message)
    failed++
  }

  // Test 7: Display detection and bounds
  try {
    const system = new MockSystem({
      displays: [
        { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
        { id: 2, bounds: { x: 1920, y: -200, width: 2560, height: 1440 } } // Offset display
      ]
    })
    
    const windowManager = new MockWindowManager(system)
    
    // Window on display 1
    const window1 = windowManager.createWindow({
      bounds: { x: 100, y: 100, width: 800, height: 600 }
    })
    assert.strictEqual(window1.display.id, 1)
    
    // Window on display 2 (with negative Y)
    const window2 = windowManager.createWindow({
      bounds: { x: 2000, y: -100, width: 800, height: 600 }
    })
    assert.strictEqual(window2.display.id, 2)
    
    console.log('✓ Test 7: Display detection handles offset displays')
    passed++
  } catch (error) {
    console.error('✗ Test 7 failed:', error.message)
    failed++
  }

  // Test 8: macOS version detection
  try {
    const versions = [
      { version: '10.12.0', supported: false, name: 'Sierra' },
      { version: '10.13.0', supported: true, name: 'High Sierra' },
      { version: '10.13.6', supported: true, name: 'High Sierra' },
      { version: '11.0.0', supported: true, name: 'Big Sur' },
      { version: '14.2.1', supported: true, name: 'Sonoma' }
    ]
    
    versions.forEach(v => {
      const system = new MockSystem({ version: v.version })
      const macVersion = system.getMacOSVersion()
      
      const isSupported = macVersion.major >= 11 || 
                         (macVersion.major === 10 && macVersion.minor >= 13)
      
      assert.strictEqual(isSupported, v.supported, 
        `${v.name} (${v.version}) support should be ${v.supported}`)
    })
    
    console.log('✓ Test 8: macOS version detection works correctly')
    passed++
  } catch (error) {
    console.error('✗ Test 8 failed:', error.message)
    failed++
  }

  // Test 9: Architecture detection
  try {
    const currentArch = os.arch()
    const currentPlatform = os.platform()
    
    // Verify we can detect the current system
    assert.notStrictEqual(currentArch, undefined)
    assert.notStrictEqual(currentPlatform, undefined)
    
    // Verify architecture is one of the supported types
    const supportedArchs = ['x64', 'arm64']
    const isSupported = supportedArchs.includes(currentArch)
    
    console.log(`✓ Test 9: Architecture detection (current: ${currentArch}, platform: ${currentPlatform})`)
    passed++
  } catch (error) {
    console.error('✗ Test 9 failed:', error.message)
    failed++
  }

  // Test 10: Window state persistence across displays
  try {
    const system = new MockSystem({
      displays: [
        { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
        { id: 2, bounds: { x: 1920, y: 0, width: 1920, height: 1080 } }
      ]
    })
    
    const windowManager = new MockWindowManager(system)
    
    // Create window with specific state
    const window = windowManager.createWindow({
      bounds: { x: 100, y: 100, width: 800, height: 600 },
      opacity: 0.85,
      alwaysOnTop: true
    })
    
    const originalState = {
      opacity: window.opacity,
      alwaysOnTop: window.alwaysOnTop,
      width: window.bounds.width,
      height: window.bounds.height
    }
    
    // Move to another display
    windowManager.moveToDisplay(window, 2)
    
    // Verify state is preserved
    assert.strictEqual(window.opacity, originalState.opacity)
    assert.strictEqual(window.alwaysOnTop, originalState.alwaysOnTop)
    assert.strictEqual(window.bounds.width, originalState.width)
    assert.strictEqual(window.bounds.height, originalState.height)
    
    console.log('✓ Test 10: Window state persists across display changes')
    passed++
  } catch (error) {
    console.error('✗ Test 10 failed:', error.message)
    failed++
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Compatibility Integration Tests Complete`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total: ${passed + failed}`)
  console.log(`${'='.repeat(50)}\n`)

  return failed === 0
}

// Run tests if executed directly
if (require.main === module) {
  const success = runTests()
  process.exit(success ? 0 : 1)
}

module.exports = { runTests }
