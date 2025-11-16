#!/usr/bin/env node

/**
 * Float Browser Build Verification Script
 * 
 * Verifies that all Float Browser components are properly built
 * and ready for manual testing.
 */

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

function log (message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile (filePath, description) {
  const exists = fs.existsSync(filePath)
  if (exists) {
    log(`✓ ${description}`, 'green')
    return true
  } else {
    log(`✗ ${description} - NOT FOUND`, 'red')
    return false
  }
}

function checkFileContent (filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const found = content.includes(searchString)
    if (found) {
      log(`✓ ${description}`, 'green')
      return true
    } else {
      log(`✗ ${description} - NOT FOUND`, 'red')
      return false
    }
  } catch (error) {
    log(`✗ ${description} - ERROR: ${error.message}`, 'red')
    return false
  }
}

function main () {
  log('\n=== Float Browser Build Verification ===\n', 'blue')

  let allPassed = true

  // Check Float modules exist
  log('Checking Float modules...', 'yellow')
  allPassed &= checkFile('js/float/floatWindowManager.js', 'FloatWindowManager module')
  allPassed &= checkFile('js/float/floatControls.js', 'FloatControls module')
  allPassed &= checkFile('js/float/floatSettings.js', 'FloatSettings module')
  allPassed &= checkFile('js/float/floatShortcuts.js', 'FloatShortcuts module')
  allPassed &= checkFile('js/float/floatProfiles.js', 'FloatProfiles module')
  allPassed &= checkFile('js/float/floatMenu.js', 'FloatMenu module')

  // Check Float CSS exists
  log('\nChecking Float CSS...', 'yellow')
  allPassed &= checkFile('css/float/floatControls.css', 'Float controls CSS')

  // Check build outputs exist
  log('\nChecking build outputs...', 'yellow')
  allPassed &= checkFile('main.build.js', 'Main process build')
  allPassed &= checkFile('dist/bundle.js', 'Renderer process bundle')
  allPassed &= checkFile('dist/bundle.css', 'CSS bundle')

  // Check Float integration in main process
  log('\nChecking main process integration...', 'yellow')
  allPassed &= checkFileContent(
    'main.build.js',
    'floatWindowManager',
    'FloatWindowManager imported in main process'
  )
  allPassed &= checkFileContent(
    'main.build.js',
    'floatSettings',
    'FloatSettings imported in main process'
  )
  allPassed &= checkFileContent(
    'main.build.js',
    'floatShortcuts',
    'FloatShortcuts imported in main process'
  )

  // Check Float integration in renderer process
  log('\nChecking renderer process integration...', 'yellow')
  allPassed &= checkFileContent(
    'dist/bundle.js',
    'floatControls',
    'FloatControls imported in renderer process'
  )

  // Check CSS integration
  log('\nChecking CSS integration...', 'yellow')
  allPassed &= checkFileContent(
    'dist/bundle.css',
    'float-controls',
    'Float controls CSS included in bundle'
  )

  // Check package.json
  log('\nChecking package.json...', 'yellow')
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    if (pkg.name === 'float-browser') {
      log('✓ Package name is "float-browser"', 'green')
    } else {
      log(`✗ Package name is "${pkg.name}", expected "float-browser"`, 'red')
      allPassed = false
    }
    if (pkg.version.startsWith('2.')) {
      log(`✓ Version is ${pkg.version} (2.x.x)`, 'green')
    } else {
      log(`✗ Version is ${pkg.version}, expected 2.x.x`, 'red')
      allPassed = false
    }
  } catch (error) {
    log(`✗ Error reading package.json: ${error.message}`, 'red')
    allPassed = false
  }

  // Check test files exist
  log('\nChecking test files...', 'yellow')
  allPassed &= checkFile('tests/floatWindowManager.test.js', 'FloatWindowManager tests')
  allPassed &= checkFile('tests/floatSettings.test.js', 'FloatSettings tests')
  allPassed &= checkFile('tests/floatProfiles.test.js', 'FloatProfiles tests')
  allPassed &= checkFile('tests/integration/compatibility.test.js', 'Compatibility tests')
  allPassed &= checkFile('tests/integration/performance.test.js', 'Performance tests')
  allPassed &= checkFile('tests/integration/uiIntegration.test.js', 'UI integration tests')
  allPassed &= checkFile('tests/integration/minFeatures.test.js', 'Min features tests')

  // Check documentation
  log('\nChecking documentation...', 'yellow')
  allPassed &= checkFile('docs/testing/MANUAL_TESTING_GUIDE.md', 'Manual testing guide')
  allPassed &= checkFile('docs/testing/MANUAL_TESTING_CHECKLIST.md', 'Manual testing checklist')
  allPassed &= checkFile('docs/developer/MODIFICATIONS.md', 'Float modifications documentation')

  // Summary
  log('\n=== Verification Summary ===\n', 'blue')
  if (allPassed) {
    log('✓ All checks passed! Float Browser is ready for manual testing.', 'green')
    log('\nNext steps:', 'yellow')
    log('1. Start the application: npm run start')
    log('2. Follow the manual testing guide: docs/testing/MANUAL_TESTING_GUIDE.md')
    log('3. Use the checklist: docs/testing/MANUAL_TESTING_CHECKLIST.md')
    process.exit(0)
  } else {
    log('✗ Some checks failed. Please review the errors above.', 'red')
    log('\nTo fix:', 'yellow')
    log('1. Run: npm run build')
    log('2. Run this script again: node scripts/verifyFloatBuild.js')
    process.exit(1)
  }
}

main()
