/**
 * Integration Test Runner
 * 
 * Runs all Float Browser integration tests
 */

const minFeaturesTests = require('./minFeatures.test.js')
const uiIntegrationTests = require('./uiIntegration.test.js')
const performanceTests = require('./performance.test.js')
const compatibilityTests = require('./compatibility.test.js')

console.log('='.repeat(60))
console.log('Running Float Browser Integration Tests')
console.log('='.repeat(60))
console.log()

let allPassed = true

// Run Min Features tests
console.log('1. Min Browser Features Integration Tests')
console.log('-'.repeat(60))
const minFeaturesResult = minFeaturesTests.runTests()
allPassed = allPassed && minFeaturesResult
console.log()

// Run UI Integration tests
console.log('2. UI Integration Tests')
console.log('-'.repeat(60))
const uiIntegrationResult = uiIntegrationTests.runTests()
allPassed = allPassed && uiIntegrationResult
console.log()

// Run Performance tests
console.log('3. Performance Integration Tests')
console.log('-'.repeat(60))
const performanceResult = performanceTests.runTests()
allPassed = allPassed && performanceResult
console.log()

// Run Compatibility tests
console.log('4. Compatibility Integration Tests')
console.log('-'.repeat(60))
const compatibilityResult = compatibilityTests.runTests()
allPassed = allPassed && compatibilityResult
console.log()

// Final summary
console.log('='.repeat(60))
if (allPassed) {
  console.log('✓ ALL INTEGRATION TESTS PASSED')
} else {
  console.log('✗ SOME INTEGRATION TESTS FAILED')
}
console.log('='.repeat(60))

process.exit(allPassed ? 0 : 1)
