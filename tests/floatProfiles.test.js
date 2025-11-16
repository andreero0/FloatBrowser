/**
 * FloatProfiles Tests
 * 
 * Tests for profile creation, application, deletion, and default profiles
 * Requirements: 6.1, 6.2, 6.5
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Make fs and path globally available
global.fs = fs
global.path = path

// Mock writeFileAtomic for testing
global.writeFileAtomic = function (filePath, data, options, callback) {
  fs.writeFile(filePath, data, callback)
}

const FloatProfiles = require('../js/float/floatProfiles')

// Mock BrowserWindow for testing
class MockBrowserWindow {
  constructor () {
    this._opacity = 1.0
    this._alwaysOnTop = false
    this._bounds = { x: 100, y: 100, width: 1000, height: 700 }
  }

  setOpacity (value) {
    this._opacity = value
  }

  setAlwaysOnTop (enabled, level) {
    this._alwaysOnTop = enabled
  }

  setBounds (bounds) {
    this._bounds = { ...this._bounds, ...bounds }
  }

  getBounds () {
    return { ...this._bounds }
  }
}

// Mock FloatWindowManager for testing
class MockFloatWindowManager {
  constructor (window) {
    this.window = window || new MockBrowserWindow()
    this.state = {
      opacity: 1.0,
      alwaysOnTop: false
    }
  }

  setOpacity (value) {
    this.state.opacity = value
    this.window.setOpacity(value)
    return true
  }

  setAlwaysOnTop (enabled) {
    this.state.alwaysOnTop = enabled
    this.window.setAlwaysOnTop(enabled)
    return true
  }

  getOpacity () {
    return this.state.opacity
  }

  isAlwaysOnTop () {
    return this.state.alwaysOnTop
  }
}

// Mock FloatSettings for testing
class MockFloatSettings {
  constructor () {
    this.data = {}
  }

  get (key, defaultValue) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue
  }

  set (key, value) {
    this.data[key] = value
  }

  save () {
    // Mock save
  }
}

// Test suite
function runTests () {
  console.log('Running FloatProfiles tests...\n')

  let passed = 0
  let failed = 0

  // Test 1: Constructor validation - requires FloatWindowManager
  try {
    assert.throws(() => {
      new FloatProfiles()
    }, /requires a FloatWindowManager/)
    console.log('✓ Test 1: Constructor requires FloatWindowManager')
    passed++
  } catch (error) {
    console.error('✗ Test 1 failed:', error.message)
    failed++
  }

  // Test 2: Constructor validation - requires FloatSettings
  try {
    const mockWindowManager = new MockFloatWindowManager()
    assert.throws(() => {
      new FloatProfiles(mockWindowManager)
    }, /requires a FloatSettings/)
    console.log('✓ Test 2: Constructor requires FloatSettings')
    passed++
  } catch (error) {
    console.error('✗ Test 2 failed:', error.message)
    failed++
  }

  // Test 3: Default profiles exist
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const allProfiles = profiles.getProfiles()
    assert.notStrictEqual(allProfiles.small, undefined)
    assert.notStrictEqual(allProfiles.medium, undefined)
    assert.notStrictEqual(allProfiles.large, undefined)
    
    console.log('✓ Test 3: Default profiles exist (small, medium, large)')
    passed++
  } catch (error) {
    console.error('✗ Test 3 failed:', error.message)
    failed++
  }

  // Test 4: Default profile values
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const small = profiles.getProfile('small')
    assert.strictEqual(small.width, 400)
    assert.strictEqual(small.height, 300)
    assert.strictEqual(small.opacity, 0.8)
    assert.strictEqual(small.alwaysOnTop, true)
    
    const medium = profiles.getProfile('medium')
    assert.strictEqual(medium.width, 800)
    assert.strictEqual(medium.height, 600)
    assert.strictEqual(medium.opacity, 0.9)
    
    const large = profiles.getProfile('large')
    assert.strictEqual(large.width, 1200)
    assert.strictEqual(large.height, 800)
    assert.strictEqual(large.opacity, 1.0)
    assert.strictEqual(large.alwaysOnTop, false)
    
    console.log('✓ Test 4: Default profile values are correct')
    passed++
  } catch (error) {
    console.error('✗ Test 4 failed:', error.message)
    failed++
  }

  // Test 5: getProfile returns null for non-existent profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    assert.strictEqual(profiles.getProfile('nonexistent'), null)
    assert.strictEqual(profiles.getProfile(''), null)
    
    console.log('✓ Test 5: getProfile returns null for non-existent profile')
    passed++
  } catch (error) {
    console.error('✗ Test 5 failed:', error.message)
    failed++
  }

  // Test 6: Create custom profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.createProfile('custom', {
      name: 'Custom Profile',
      width: 600,
      height: 400,
      opacity: 0.85,
      alwaysOnTop: true
    })
    
    assert.strictEqual(result, true)
    
    const custom = profiles.getProfile('custom')
    assert.notStrictEqual(custom, null)
    assert.strictEqual(custom.name, 'Custom Profile')
    assert.strictEqual(custom.width, 600)
    assert.strictEqual(custom.height, 400)
    assert.strictEqual(custom.opacity, 0.85)
    assert.strictEqual(custom.alwaysOnTop, true)
    
    console.log('✓ Test 6: Create custom profile works')
    passed++
  } catch (error) {
    console.error('✗ Test 6 failed:', error.message)
    failed++
  }

  // Test 7: Cannot create duplicate profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.createProfile('small', {
      name: 'Duplicate',
      width: 500,
      height: 400,
      opacity: 0.9,
      alwaysOnTop: true
    })
    
    assert.strictEqual(result, false)
    
    console.log('✓ Test 7: Cannot create duplicate profile')
    passed++
  } catch (error) {
    console.error('✗ Test 7 failed:', error.message)
    failed++
  }

  // Test 8: Create profile validation - invalid config
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    // Invalid opacity
    assert.strictEqual(profiles.createProfile('invalid1', {
      name: 'Invalid',
      width: 600,
      height: 400,
      opacity: 1.5, // Too high
      alwaysOnTop: true
    }), false)
    
    // Invalid width
    assert.strictEqual(profiles.createProfile('invalid2', {
      name: 'Invalid',
      width: -100, // Negative
      height: 400,
      opacity: 0.9,
      alwaysOnTop: true
    }), false)
    
    // Missing required field
    assert.strictEqual(profiles.createProfile('invalid3', {
      name: 'Invalid',
      width: 600,
      // height missing
      opacity: 0.9,
      alwaysOnTop: true
    }), false)
    
    console.log('✓ Test 8: Create profile validates configuration')
    passed++
  } catch (error) {
    console.error('✗ Test 8 failed:', error.message)
    failed++
  }

  // Test 9: Update existing profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.updateProfile('small', {
      name: 'Small Updated',
      width: 500,
      height: 350,
      opacity: 0.75,
      alwaysOnTop: false
    })
    
    assert.strictEqual(result, true)
    
    const updated = profiles.getProfile('small')
    assert.strictEqual(updated.name, 'Small Updated')
    assert.strictEqual(updated.width, 500)
    assert.strictEqual(updated.height, 350)
    assert.strictEqual(updated.opacity, 0.75)
    assert.strictEqual(updated.alwaysOnTop, false)
    
    console.log('✓ Test 9: Update profile works')
    passed++
  } catch (error) {
    console.error('✗ Test 9 failed:', error.message)
    failed++
  }

  // Test 10: Cannot update non-existent profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.updateProfile('nonexistent', {
      name: 'Test',
      width: 600,
      height: 400,
      opacity: 0.9,
      alwaysOnTop: true
    })
    
    assert.strictEqual(result, false)
    
    console.log('✓ Test 10: Cannot update non-existent profile')
    passed++
  } catch (error) {
    console.error('✗ Test 10 failed:', error.message)
    failed++
  }

  // Test 11: Delete profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    // Create a profile to delete
    profiles.createProfile('todelete', {
      name: 'To Delete',
      width: 600,
      height: 400,
      opacity: 0.9,
      alwaysOnTop: true
    })
    
    assert.notStrictEqual(profiles.getProfile('todelete'), null)
    
    const result = profiles.deleteProfile('todelete')
    assert.strictEqual(result, true)
    assert.strictEqual(profiles.getProfile('todelete'), null)
    
    console.log('✓ Test 11: Delete profile works')
    passed++
  } catch (error) {
    console.error('✗ Test 11 failed:', error.message)
    failed++
  }

  // Test 12: Delete non-existent profile returns false
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.deleteProfile('nonexistent')
    assert.strictEqual(result, false)
    
    console.log('✓ Test 12: Delete non-existent profile returns false')
    passed++
  } catch (error) {
    console.error('✗ Test 12 failed:', error.message)
    failed++
  }

  // Test 13: Apply profile updates window
  try {
    const mockWindow = new MockBrowserWindow()
    const mockWindowManager = new MockFloatWindowManager(mockWindow)
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.applyProfile('small')
    assert.strictEqual(result, true)
    
    const bounds = mockWindow.getBounds()
    assert.strictEqual(bounds.width, 400)
    assert.strictEqual(bounds.height, 300)
    assert.strictEqual(mockWindowManager.getOpacity(), 0.8)
    assert.strictEqual(mockWindowManager.isAlwaysOnTop(), true)
    
    console.log('✓ Test 13: Apply profile updates window')
    passed++
  } catch (error) {
    console.error('✗ Test 13 failed:', error.message)
    failed++
  }

  // Test 14: Apply profile saves current profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    profiles.applyProfile('medium')
    
    assert.strictEqual(mockSettings.get('currentProfile'), 'medium')
    
    console.log('✓ Test 14: Apply profile saves current profile name')
    passed++
  } catch (error) {
    console.error('✗ Test 14 failed:', error.message)
    failed++
  }

  // Test 15: Apply non-existent profile returns false
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const result = profiles.applyProfile('nonexistent')
    assert.strictEqual(result, false)
    
    console.log('✓ Test 15: Apply non-existent profile returns false')
    passed++
  } catch (error) {
    console.error('✗ Test 15 failed:', error.message)
    failed++
  }

  // Test 16: getCurrentProfile returns current profile
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    assert.strictEqual(profiles.getCurrentProfile(), null)
    
    profiles.applyProfile('large')
    assert.strictEqual(profiles.getCurrentProfile(), 'large')
    
    console.log('✓ Test 16: getCurrentProfile returns current profile')
    passed++
  } catch (error) {
    console.error('✗ Test 16 failed:', error.message)
    failed++
  }

  // Test 17: resetToDefaults restores default profiles
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    // Modify a profile
    profiles.updateProfile('small', {
      name: 'Modified',
      width: 999,
      height: 999,
      opacity: 0.5,
      alwaysOnTop: false
    })
    
    // Reset to defaults
    const result = profiles.resetToDefaults()
    assert.strictEqual(result, true)
    
    // Verify defaults restored
    const small = profiles.getProfile('small')
    assert.strictEqual(small.width, 400)
    assert.strictEqual(small.height, 300)
    assert.strictEqual(small.opacity, 0.8)
    
    console.log('✓ Test 17: resetToDefaults restores default profiles')
    passed++
  } catch (error) {
    console.error('✗ Test 17 failed:', error.message)
    failed++
  }

  // Test 18: Profile application performance (< 100ms requirement)
  try {
    const mockWindowManager = new MockFloatWindowManager()
    const mockSettings = new MockFloatSettings()
    const profiles = new FloatProfiles(mockWindowManager, mockSettings)
    
    const startTime = Date.now()
    profiles.applyProfile('medium')
    const elapsed = Date.now() - startTime
    
    // Should be much faster than 100ms, but allow some margin
    assert.strictEqual(elapsed < 100, true)
    
    console.log(`✓ Test 18: Profile application is fast (${elapsed}ms < 100ms)`)
    passed++
  } catch (error) {
    console.error('✗ Test 18 failed:', error.message)
    failed++
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`)
  console.log(`FloatProfiles Tests Complete`)
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
