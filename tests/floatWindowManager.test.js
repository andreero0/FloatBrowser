/**
 * FloatWindowManager Tests
 * 
 * Tests for opacity, always-on-top, PIP mode, and state persistence
 * Requirements: 2.2, 2.3, 3.2, 4.2, 12.2, 12.3
 */

const assert = require('assert')
const FloatWindowManager = require('../js/float/floatWindowManager')

// Mock BrowserWindow for testing
class MockBrowserWindow {
  constructor () {
    this._opacity = 1.0
    this._alwaysOnTop = false
    this._bounds = { x: 100, y: 100, width: 1000, height: 700 }
  }

  setOpacity (value) {
    if (value < 0 || value > 1) {
      throw new Error('Invalid opacity value')
    }
    this._opacity = value
  }

  getOpacity () {
    return this._opacity
  }

  setAlwaysOnTop (enabled, level) {
    this._alwaysOnTop = enabled
    this._alwaysOnTopLevel = level
  }

  isAlwaysOnTop () {
    return this._alwaysOnTop
  }

  setBounds (bounds) {
    this._bounds = { ...this._bounds, ...bounds }
  }

  getBounds () {
    return { ...this._bounds }
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
  console.log('Running FloatWindowManager tests...\n')

  let passed = 0
  let failed = 0

  // Test 1: Constructor validation
  try {
    assert.throws(() => {
      new FloatWindowManager()
    }, /requires a BrowserWindow/)
    console.log('✓ Test 1: Constructor requires BrowserWindow')
    passed++
  } catch (error) {
    console.error('✗ Test 1 failed:', error.message)
    failed++
  }

  // Test 2: Valid opacity values
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setOpacity(0.5), true)
    assert.strictEqual(manager.getOpacity(), 0.5)
    assert.strictEqual(mockWindow._opacity, 0.5)
    
    console.log('✓ Test 2: Valid opacity values (0.3-1.0)')
    passed++
  } catch (error) {
    console.error('✗ Test 2 failed:', error.message)
    failed++
  }

  // Test 3: Invalid opacity values - too low
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setOpacity(0.2), false)
    assert.strictEqual(manager.getOpacity(), 1.0) // Should remain at default
    
    console.log('✓ Test 3: Rejects opacity < 0.3')
    passed++
  } catch (error) {
    console.error('✗ Test 3 failed:', error.message)
    failed++
  }

  // Test 4: Invalid opacity values - too high
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setOpacity(1.5), false)
    assert.strictEqual(manager.getOpacity(), 1.0) // Should remain at default
    
    console.log('✓ Test 4: Rejects opacity > 1.0')
    passed++
  } catch (error) {
    console.error('✗ Test 4 failed:', error.message)
    failed++
  }

  // Test 5: Invalid opacity values - non-number
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setOpacity('0.5'), false)
    assert.strictEqual(manager.setOpacity(null), false)
    assert.strictEqual(manager.setOpacity(undefined), false)
    
    console.log('✓ Test 5: Rejects non-number opacity values')
    passed++
  } catch (error) {
    console.error('✗ Test 5 failed:', error.message)
    failed++
  }

  // Test 6: Opacity boundary values
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setOpacity(0.3), true)
    assert.strictEqual(manager.getOpacity(), 0.3)
    
    assert.strictEqual(manager.setOpacity(1.0), true)
    assert.strictEqual(manager.getOpacity(), 1.0)
    
    console.log('✓ Test 6: Accepts boundary values (0.3 and 1.0)')
    passed++
  } catch (error) {
    console.error('✗ Test 6 failed:', error.message)
    failed++
  }

  // Test 7: Always-on-top toggle
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.isAlwaysOnTop(), false)
    
    assert.strictEqual(manager.setAlwaysOnTop(true), true)
    assert.strictEqual(manager.isAlwaysOnTop(), true)
    assert.strictEqual(mockWindow._alwaysOnTop, true)
    assert.strictEqual(mockWindow._alwaysOnTopLevel, 'floating')
    
    assert.strictEqual(manager.setAlwaysOnTop(false), true)
    assert.strictEqual(manager.isAlwaysOnTop(), false)
    
    console.log('✓ Test 7: Always-on-top toggle works')
    passed++
  } catch (error) {
    console.error('✗ Test 7 failed:', error.message)
    failed++
  }

  // Test 8: Always-on-top invalid values
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    assert.strictEqual(manager.setAlwaysOnTop('true'), false)
    assert.strictEqual(manager.setAlwaysOnTop(1), false)
    assert.strictEqual(manager.setAlwaysOnTop(null), false)
    
    console.log('✓ Test 8: Rejects non-boolean always-on-top values')
    passed++
  } catch (error) {
    console.error('✗ Test 8 failed:', error.message)
    failed++
  }

  // Test 9: PIP mode toggle - enter PIP
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    const originalBounds = mockWindow.getBounds()
    
    assert.strictEqual(manager.isPIPMode(), false)
    
    const result = manager.togglePIPMode()
    assert.strictEqual(result, true)
    assert.strictEqual(manager.isPIPMode(), true)
    
    const newBounds = mockWindow.getBounds()
    assert.strictEqual(newBounds.width, 400)
    assert.strictEqual(newBounds.height, 300)
    assert.strictEqual(newBounds.x, originalBounds.x) // Position preserved
    assert.strictEqual(newBounds.y, originalBounds.y)
    
    console.log('✓ Test 9: PIP mode entry works')
    passed++
  } catch (error) {
    console.error('✗ Test 9 failed:', error.message)
    failed++
  }

  // Test 10: PIP mode toggle - exit PIP
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    const originalBounds = mockWindow.getBounds()
    
    // Enter PIP
    manager.togglePIPMode()
    
    // Exit PIP
    const result = manager.togglePIPMode()
    assert.strictEqual(result, false)
    assert.strictEqual(manager.isPIPMode(), false)
    
    const restoredBounds = mockWindow.getBounds()
    assert.strictEqual(restoredBounds.width, originalBounds.width)
    assert.strictEqual(restoredBounds.height, originalBounds.height)
    assert.strictEqual(restoredBounds.x, originalBounds.x)
    assert.strictEqual(restoredBounds.y, originalBounds.y)
    
    console.log('✓ Test 10: PIP mode exit restores bounds')
    passed++
  } catch (error) {
    console.error('✗ Test 10 failed:', error.message)
    failed++
  }

  // Test 11: State persistence - save
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    const mockSettings = new MockFloatSettings()
    
    manager.setOpacity(0.8)
    manager.setAlwaysOnTop(true)
    
    manager.saveState(mockSettings)
    
    assert.strictEqual(mockSettings.get('opacity'), 0.8)
    assert.strictEqual(mockSettings.get('alwaysOnTop'), true)
    assert.notStrictEqual(mockSettings.get('lastWindowBounds'), null)
    
    console.log('✓ Test 11: State persistence - save works')
    passed++
  } catch (error) {
    console.error('✗ Test 11 failed:', error.message)
    failed++
  }

  // Test 12: State persistence - restore
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    const mockSettings = new MockFloatSettings()
    
    mockSettings.set('opacity', 0.7)
    mockSettings.set('alwaysOnTop', true)
    
    manager.restoreState(mockSettings)
    
    assert.strictEqual(manager.getOpacity(), 0.7)
    assert.strictEqual(manager.isAlwaysOnTop(), true)
    
    console.log('✓ Test 12: State persistence - restore works')
    passed++
  } catch (error) {
    console.error('✗ Test 12 failed:', error.message)
    failed++
  }

  // Test 13: State persistence - PIP mode save/restore
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    const mockSettings = new MockFloatSettings()
    
    // Enter PIP mode
    manager.togglePIPMode()
    manager.saveState(mockSettings)
    
    assert.strictEqual(mockSettings.get('isPIP'), true)
    assert.notStrictEqual(mockSettings.get('pipSavedBounds'), null)
    
    console.log('✓ Test 13: PIP state persistence works')
    passed++
  } catch (error) {
    console.error('✗ Test 13 failed:', error.message)
    failed++
  }

  // Test 14: getState returns current state
  try {
    const mockWindow = new MockBrowserWindow()
    const manager = new FloatWindowManager(mockWindow)
    
    manager.setOpacity(0.9)
    manager.setAlwaysOnTop(true)
    
    const state = manager.getState()
    assert.strictEqual(state.opacity, 0.9)
    assert.strictEqual(state.alwaysOnTop, true)
    assert.strictEqual(state.isPIP, false)
    
    console.log('✓ Test 14: getState returns current state')
    passed++
  } catch (error) {
    console.error('✗ Test 14 failed:', error.message)
    failed++
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`)
  console.log(`FloatWindowManager Tests Complete`)
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
