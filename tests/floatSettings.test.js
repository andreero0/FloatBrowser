/**
 * FloatSettings Tests
 * 
 * Tests for get/set methods, default values, validation, and corrupted settings handling
 * Requirements: 9.1, 9.2, 9.3, 12.5
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Make fs and path globally available (as they are in the main process build)
global.fs = fs
global.path = path

// Mock writeFileAtomic for testing
global.writeFileAtomic = function (filePath, data, options, callback) {
  fs.writeFile(filePath, data, callback)
}

const FloatSettings = require('../js/float/floatSettings')

// Helper to create temp directory for tests
function createTempDir () {
  const tempDir = path.join(os.tmpdir(), 'float-test-' + Date.now())
  fs.mkdirSync(tempDir, { recursive: true })
  return tempDir
}

// Helper to cleanup temp directory
function cleanupTempDir (dir) {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        fs.unlinkSync(path.join(dir, file))
      })
      fs.rmdirSync(dir)
    }
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

// Test suite
function runTests () {
  console.log('Running FloatSettings tests...\n')

  let passed = 0
  let failed = 0

  // Test 1: Constructor validation
  try {
    assert.throws(() => {
      new FloatSettings()
    }, /requires a userDataPath/)
    console.log('✓ Test 1: Constructor requires userDataPath')
    passed++
  } catch (error) {
    console.error('✗ Test 1 failed:', error.message)
    failed++
  }

  // Test 2: Default values initialization
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.get('opacity'), 0.95)
    assert.strictEqual(settings.get('defaultOpacity'), 0.95)
    assert.strictEqual(settings.get('alwaysOnTop'), true)
    assert.strictEqual(settings.get('defaultAlwaysOnTop'), true)
    
    const shortcuts = settings.get('globalShortcuts')
    assert.notStrictEqual(shortcuts, null)
    assert.strictEqual(shortcuts.toggleVisibility, 'CommandOrControl+Shift+F')
    
    const profiles = settings.get('windowProfiles')
    assert.notStrictEqual(profiles, null)
    assert.notStrictEqual(profiles.small, undefined)
    assert.notStrictEqual(profiles.medium, undefined)
    assert.notStrictEqual(profiles.large, undefined)
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 2: Default values initialized correctly')
    passed++
  } catch (error) {
    console.error('✗ Test 2 failed:', error.message)
    failed++
  }

  // Test 3: Get method with simple keys
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.get('opacity'), 0.95)
    assert.strictEqual(settings.get('nonexistent', 'default'), 'default')
    assert.strictEqual(settings.get('nonexistent'), null)
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 3: Get method works with simple keys')
    passed++
  } catch (error) {
    console.error('✗ Test 3 failed:', error.message)
    failed++
  }

  // Test 4: Get method with dot notation
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.get('windowProfiles.small.width'), 400)
    assert.strictEqual(settings.get('windowProfiles.medium.height'), 600)
    assert.strictEqual(settings.get('globalShortcuts.toggleVisibility'), 'CommandOrControl+Shift+F')
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 4: Get method works with dot notation')
    passed++
  } catch (error) {
    console.error('✗ Test 4 failed:', error.message)
    failed++
  }

  // Test 5: Set method with simple keys
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.set('opacity', 0.8), true)
    assert.strictEqual(settings.get('opacity'), 0.8)
    
    assert.strictEqual(settings.set('customKey', 'customValue'), true)
    assert.strictEqual(settings.get('customKey'), 'customValue')
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 5: Set method works with simple keys')
    passed++
  } catch (error) {
    console.error('✗ Test 5 failed:', error.message)
    failed++
  }

  // Test 6: Set method with dot notation
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.set('windowProfiles.small.width', 500), true)
    assert.strictEqual(settings.get('windowProfiles.small.width'), 500)
    
    assert.strictEqual(settings.set('nested.deep.value', 'test'), true)
    assert.strictEqual(settings.get('nested.deep.value'), 'test')
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 6: Set method works with dot notation')
    passed++
  } catch (error) {
    console.error('✗ Test 6 failed:', error.message)
    failed++
  }

  // Test 7: Set method validation
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    assert.strictEqual(settings.set('', 'value'), false)
    assert.strictEqual(settings.set(null, 'value'), false)
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 7: Set method validates input')
    passed++
  } catch (error) {
    console.error('✗ Test 7 failed:', error.message)
    failed++
  }

  // Test 8: Save and load persistence (using synchronous write for testing)
  try {
    const tempDir = createTempDir()
    
    // Create settings and modify values
    const settings1 = new FloatSettings(tempDir)
    settings1.set('opacity', 0.75)
    settings1.set('alwaysOnTop', false)
    settings1.set('customKey', 'testValue')
    
    // Write synchronously for testing
    const settingsFile = path.join(tempDir, 'float-settings.json')
    fs.writeFileSync(settingsFile, JSON.stringify(settings1.getAll(), null, 2))
    
    // Create new instance and verify values persisted
    const settings2 = new FloatSettings(tempDir)
    assert.strictEqual(settings2.get('opacity'), 0.75)
    assert.strictEqual(settings2.get('alwaysOnTop'), false)
    assert.strictEqual(settings2.get('customKey'), 'testValue')
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 8: Save and load persistence works')
    passed++
  } catch (error) {
    console.error('✗ Test 8 failed:', error.message)
    failed++
  }

  // Test 9: Validation - invalid opacity
  try {
    const tempDir = createTempDir()
    const settingsFile = path.join(tempDir, 'float-settings.json')
    
    // Write invalid settings file
    fs.writeFileSync(settingsFile, JSON.stringify({
      opacity: 1.5, // Invalid - too high
      alwaysOnTop: true
    }))
    
    // Load should reset to defaults due to validation failure
    const settings = new FloatSettings(tempDir)
    assert.strictEqual(settings.get('opacity'), 0.95) // Should be default
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 9: Validation rejects invalid opacity')
    passed++
  } catch (error) {
    console.error('✗ Test 9 failed:', error.message)
    failed++
  }

  // Test 10: Validation - invalid bounds
  try {
    const tempDir = createTempDir()
    const settingsFile = path.join(tempDir, 'float-settings.json')
    
    // Write invalid settings file
    fs.writeFileSync(settingsFile, JSON.stringify({
      opacity: 0.95,
      lastWindowBounds: {
        width: -100, // Invalid - negative
        height: 600,
        x: 0,
        y: 0
      }
    }))
    
    // Load should reset to defaults due to validation failure
    const settings = new FloatSettings(tempDir)
    assert.strictEqual(settings.get('lastWindowBounds'), null) // Should be default
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 10: Validation rejects invalid bounds')
    passed++
  } catch (error) {
    console.error('✗ Test 10 failed:', error.message)
    failed++
  }

  // Test 11: Validation - invalid profile
  try {
    const tempDir = createTempDir()
    const settingsFile = path.join(tempDir, 'float-settings.json')
    
    // Write invalid settings file
    fs.writeFileSync(settingsFile, JSON.stringify({
      opacity: 0.95,
      windowProfiles: {
        small: {
          name: 'Small',
          width: 400,
          height: 300,
          opacity: 2.0, // Invalid - too high
          alwaysOnTop: true
        }
      }
    }))
    
    // Load should reset to defaults due to validation failure
    const settings = new FloatSettings(tempDir)
    const profiles = settings.get('windowProfiles')
    assert.strictEqual(profiles.small.opacity, 0.8) // Should be default
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 11: Validation rejects invalid profile')
    passed++
  } catch (error) {
    console.error('✗ Test 11 failed:', error.message)
    failed++
  }

  // Test 12: Corrupted JSON handling
  try {
    const tempDir = createTempDir()
    const settingsFile = path.join(tempDir, 'float-settings.json')
    
    // Write corrupted JSON file
    fs.writeFileSync(settingsFile, '{ invalid json }')
    
    // Load should reset to defaults
    const settings = new FloatSettings(tempDir)
    assert.strictEqual(settings.get('opacity'), 0.95) // Should be default
    assert.strictEqual(settings.get('alwaysOnTop'), true) // Should be default
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 12: Corrupted JSON resets to defaults')
    passed++
  } catch (error) {
    console.error('✗ Test 12 failed:', error.message)
    failed++
  }

  // Test 13: resetToDefaults method
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    // Modify settings
    settings.set('opacity', 0.5)
    settings.set('alwaysOnTop', false)
    settings.set('customKey', 'test')
    
    // Reset to defaults
    settings.resetToDefaults()
    
    assert.strictEqual(settings.get('opacity'), 0.95)
    assert.strictEqual(settings.get('alwaysOnTop'), true)
    assert.strictEqual(settings.get('customKey'), null) // Custom key should be gone
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 13: resetToDefaults works')
    passed++
  } catch (error) {
    console.error('✗ Test 13 failed:', error.message)
    failed++
  }

  // Test 14: getAll method
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    settings.set('testKey', 'testValue')
    
    const allSettings = settings.getAll()
    assert.notStrictEqual(allSettings, null)
    assert.strictEqual(typeof allSettings, 'object')
    assert.strictEqual(allSettings.testKey, 'testValue')
    assert.strictEqual(allSettings.opacity, 0.95)
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 14: getAll returns all settings')
    passed++
  } catch (error) {
    console.error('✗ Test 14 failed:', error.message)
    failed++
  }

  // Test 15: getFilePath method
  try {
    const tempDir = createTempDir()
    const settings = new FloatSettings(tempDir)
    
    const filePath = settings.getFilePath()
    assert.strictEqual(filePath, path.join(tempDir, 'float-settings.json'))
    
    cleanupTempDir(tempDir)
    console.log('✓ Test 15: getFilePath returns correct path')
    passed++
  } catch (error) {
    console.error('✗ Test 15 failed:', error.message)
    failed++
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`)
  console.log(`FloatSettings Tests Complete`)
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
