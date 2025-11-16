/**
 * Test Runner
 * 
 * Runs all Float Browser tests (unit and integration)
 */

const floatWindowManagerTests = require('./floatWindowManager.test.js')
const floatSettingsTests = require('./floatSettings.test.js')
const floatProfilesTests = require('./floatProfiles.test.js')
const minFeaturesTests = require('./integration/minFeatures.test.js')
const uiIntegrationTests = require('./integration/uiIntegration.test.js')
const performanceTests = require('./integration/performance.test.js')
const compatibilityTests = require('./integration/compatibility.test.js')

console.log('='.repeat(60))
console.log('Running Float Browser Tests')
console.log('='.repeat(60))
console.log()

let allPassed = true

// Unit Tests
console.log('UNIT TESTS')
console.log('='.repeat(60))
console.log()

// Run FloatWindowManager tests
console.log('1. FloatWindowManager Tests')
console.log('-'.repeat(60))
const windowManagerResult = floatWindowManagerTests.runTests()
allPassed = allPassed && windowManagerResult
console.log()

// Run FloatSettings tests
console.log('2. FloatSettings Tests')
console.log('-'.repeat(60))
const settingsResult = floatSettingsTests.runTests()
allPassed = allPassed && settingsResult
console.log()

// Run FloatProfiles tests
console.log('3. FloatProfiles Tests')
console.log('-'.repeat(60))
const profilesResult = floatProfilesTests.runTests()
allPassed = allPassed && profilesResult
console.log()

// Integration Tests
console.log('INTEGRATION TESTS')
console.log('='.repeat(60))
console.log()

// Run Min Features tests
console.log('4. Min Browser Features Integration Tests')
console.log('-'.repeat(60))
const minFeaturesResult = minFeaturesTests.runTests()
allPassed = allPassed && minFeaturesResult
console.log()

// Run UI Integration tests
console.log('5. UI Integration Tests')
console.log('-'.repeat(60))
const uiIntegrationResult = uiIntegrationTests.runTests()
allPassed = allPassed && uiIntegrationResult
console.log()

// Run Performance tests
console.log('6. Performance Integration Tests')
console.log('-'.repeat(60))
const performanceResult = performanceTests.runTests()
allPassed = allPassed && performanceResult
console.log()

// Run Compatibility tests
console.log('7. Compatibility Integration Tests')
console.log('-'.repeat(60))
const compatibilityResult = compatibilityTests.runTests()
allPassed = allPassed && compatibilityResult
console.log()

// Final summary
console.log('='.repeat(60))
if (allPassed) {
  console.log('✓ ALL TESTS PASSED')
  console.log('  - Unit Tests: 3/3')
  console.log('  - Integration Tests: 4/4')
} else {
  console.log('✗ SOME TESTS FAILED')
}
console.log('='.repeat(60))

process.exit(allPassed ? 0 : 1)
