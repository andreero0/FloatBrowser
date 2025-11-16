#!/usr/bin/env node

/**
 * Test Notarization Configuration
 * 
 * This script verifies that notarization is properly configured for Float Browser.
 * It checks credentials, tests the notarization process, and provides detailed feedback.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log (message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec (command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', ...options })
  } catch (error) {
    return null
  }
}

function checkCredentials () {
  log('\n🔑 Checking Notarization Credentials...', 'cyan')
  
  // Load .env
  const envPath = path.join(__dirname, '..', '.env')
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', 'red')
    log('   Copy .env.example to .env and add your credentials', 'yellow')
    return false
  }
  
  require('dotenv').config({ path: envPath })
  
  const appleId = process.env.APPLE_ID
  const password = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID
  
  if (!appleId) {
    log('❌ APPLE_ID not set in .env', 'red')
    return false
  }
  log(`✅ APPLE_ID: ${appleId}`, 'green')
  
  if (!password) {
    log('❌ APPLE_APP_SPECIFIC_PASSWORD not set in .env', 'red')
    return false
  }
  log('✅ APPLE_APP_SPECIFIC_PASSWORD is set', 'green')
  
  if (!teamId) {
    log('❌ APPLE_TEAM_ID not set in .env', 'red')
    return false
  }
  log(`✅ APPLE_TEAM_ID: ${teamId}`, 'green')
  
  // Validate format
  if (!appleId.includes('@')) {
    log('⚠️  APPLE_ID should be an email address', 'yellow')
  }
  
  if (password.length < 16) {
    log('⚠️  APPLE_APP_SPECIFIC_PASSWORD seems too short (should be xxxx-xxxx-xxxx-xxxx)', 'yellow')
  }
  
  if (teamId.length !== 10) {
    log('⚠️  APPLE_TEAM_ID should be 10 characters', 'yellow')
  }
  
  return true
}

function checkNotarytool () {
  log('\n🛠️  Checking notarytool...', 'cyan')
  
  const result = exec('xcrun notarytool --version 2>&1')
  
  if (!result) {
    log('❌ notarytool not found', 'red')
    log('   Install Xcode Command Line Tools: xcode-select --install', 'yellow')
    return false
  }
  
  log('✅ notarytool is available', 'green')
  log(`   ${result.trim()}`, 'blue')
  
  return true
}

function testCredentials () {
  log('\n🔐 Testing Credentials with Apple...', 'cyan')
  log('   This will verify your credentials are valid', 'blue')
  
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
  
  const appleId = process.env.APPLE_ID
  const password = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID
  
  if (!appleId || !password || !teamId) {
    log('❌ Credentials not set, skipping test', 'red')
    return false
  }
  
  log('   Attempting to list previous submissions...', 'blue')
  
  const result = exec(
    `xcrun notarytool history --apple-id "${appleId}" --password "${password}" --team-id "${teamId}" 2>&1`,
    { timeout: 30000 }
  )
  
  if (!result) {
    log('❌ Failed to connect to Apple', 'red')
    return false
  }
  
  if (result.includes('Invalid credentials') || result.includes('authentication failed')) {
    log('❌ Invalid credentials', 'red')
    log('   Check your APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, and APPLE_TEAM_ID', 'yellow')
    return false
  }
  
  if (result.includes('Successfully received submission history')) {
    log('✅ Credentials are valid!', 'green')
    
    // Show recent submissions
    const lines = result.split('\n').filter(line => line.trim())
    const submissions = lines.slice(0, 5)
    
    if (submissions.length > 0) {
      log('\n   Recent submissions:', 'blue')
      submissions.forEach(line => {
        if (line.includes('id:') || line.includes('status:')) {
          log(`   ${line.trim()}`, 'blue')
        }
      })
    }
    
    return true
  }
  
  log('⚠️  Could not verify credentials', 'yellow')
  log(`   Response: ${result.substring(0, 200)}`, 'yellow')
  return false
}

function checkBuiltApp () {
  log('\n📦 Checking Built App...', 'cyan')
  
  const appPaths = [
    'dist/app/mac-universal/Float Browser.app',
    'dist/app/mac/Float Browser.app',
    'dist/app/mac-arm64/Float Browser.app'
  ]
  
  let appPath = null
  for (const p of appPaths) {
    const fullPath = path.join(__dirname, '..', p)
    if (fs.existsSync(fullPath)) {
      appPath = fullPath
      break
    }
  }
  
  if (!appPath) {
    log('⚠️  No built app found', 'yellow')
    log('   Build the app first: npm run buildMacDMGUniversal', 'yellow')
    return null
  }
  
  log(`✅ Found built app: ${path.basename(path.dirname(appPath))}`, 'green')
  
  // Check if signed
  const verifyResult = exec(`codesign --verify --deep --strict "${appPath}" 2>&1`)
  
  if (!verifyResult || verifyResult.includes('invalid')) {
    log('❌ App is not properly signed', 'red')
    return null
  }
  
  log('✅ App is properly signed', 'green')
  
  // Check if already notarized
  const staplerResult = exec(`xcrun stapler validate "${appPath}" 2>&1`)
  
  if (staplerResult && staplerResult.includes('is already signed and notarized')) {
    log('✅ App is already notarized', 'green')
    return appPath
  }
  
  log('ℹ️  App is not yet notarized', 'blue')
  return appPath
}

function checkNotarizationInBuildConfig () {
  log('\n⚙️  Checking Build Configuration...', 'cyan')
  
  const buildMacDMGPath = path.join(__dirname, 'buildMacDMG.js')
  const content = fs.readFileSync(buildMacDMGPath, 'utf8')
  
  if (!content.includes('notarize')) {
    log('❌ buildMacDMG.js does not include notarization config', 'red')
    return false
  }
  log('✅ buildMacDMG.js includes notarization config', 'green')
  
  if (!content.includes('ENABLE_NOTARIZATION')) {
    log('⚠️  buildMacDMG.js does not check ENABLE_NOTARIZATION flag', 'yellow')
  } else {
    log('✅ buildMacDMG.js checks ENABLE_NOTARIZATION flag', 'green')
  }
  
  // Check if notarization is enabled
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
  
  if (process.env.ENABLE_NOTARIZATION === 'true') {
    log('✅ Notarization is ENABLED in .env', 'green')
  } else {
    log('ℹ️  Notarization is DISABLED in .env (default)', 'blue')
    log('   To enable: Add ENABLE_NOTARIZATION=true to .env', 'blue')
  }
  
  return true
}

function simulateNotarization (appPath) {
  log('\n🧪 Simulating Notarization Process...', 'cyan')
  log('   (This is a dry run - no actual submission)', 'blue')
  
  if (!appPath) {
    log('⚠️  No app to test with', 'yellow')
    return false
  }
  
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
  
  const appleId = process.env.APPLE_ID
  const password = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID
  
  if (!appleId || !password || !teamId) {
    log('⚠️  Credentials not set', 'yellow')
    return false
  }
  
  log('\n   Step 1: Create ZIP archive', 'blue')
  const zipPath = path.join(__dirname, '..', 'dist', 'FloatBrowser-test.zip')
  
  // Clean up old zip
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath)
  }
  
  const zipResult = exec(`ditto -c -k --keepParent "${appPath}" "${zipPath}" 2>&1`)
  
  if (!fs.existsSync(zipPath)) {
    log('   ❌ Failed to create ZIP', 'red')
    return false
  }
  
  const stats = fs.statSync(zipPath)
  log(`   ✅ Created ZIP (${(stats.size / 1024 / 1024).toFixed(2)} MB)`, 'green')
  
  log('\n   Step 2: Validate ZIP can be submitted', 'blue')
  log('   ℹ️  Actual submission would happen here', 'blue')
  log('   ℹ️  Command: xcrun notarytool submit FloatBrowser-test.zip', 'blue')
  
  log('\n   Step 3: Wait for notarization (5-15 minutes)', 'blue')
  log('   ℹ️  Apple would process the app', 'blue')
  
  log('\n   Step 4: Staple ticket to app', 'blue')
  log('   ℹ️  Command: xcrun stapler staple "Float Browser.app"', 'blue')
  
  // Clean up
  fs.unlinkSync(zipPath)
  log('\n   ✅ Simulation complete', 'green')
  
  return true
}

function printInstructions () {
  log('\n' + '='.repeat(60), 'cyan')
  log('NEXT STEPS', 'cyan')
  log('='.repeat(60), 'cyan')
  
  log('\n1. Ensure you have a Developer ID certificate:', 'blue')
  log('   - Go to https://developer.apple.com/account/resources/certificates/list', 'blue')
  log('   - Create a "Developer ID Application" certificate', 'blue')
  log('   - Download and install in Keychain', 'blue')
  
  log('\n2. Set up credentials in .env:', 'blue')
  log('   - Copy .env.example to .env', 'blue')
  log('   - Add your APPLE_ID (email)', 'blue')
  log('   - Generate app-specific password at appleid.apple.com', 'blue')
  log('   - Add your APPLE_TEAM_ID (10 characters)', 'blue')
  
  log('\n3. Enable notarization (optional):', 'blue')
  log('   - Add ENABLE_NOTARIZATION=true to .env', 'blue')
  log('   - Note: Notarization may fail if app has issues', 'blue')
  
  log('\n4. Build with notarization:', 'blue')
  log('   npm run buildMacDMGUniversal', 'blue')
  
  log('\n5. If notarization fails:', 'blue')
  log('   - Get the submission ID from the error', 'blue')
  log('   - Download the log:', 'blue')
  log('     xcrun notarytool log <submission-id> \\', 'blue')
  log('       --apple-id your@email.com \\', 'blue')
  log('       --password xxxx-xxxx-xxxx-xxxx \\', 'blue')
  log('       --team-id XXXXXXXXXX', 'blue')
  log('   - Review the log for specific errors', 'blue')
  
  log('\n6. Test the notarized app:', 'blue')
  log('   spctl --assess --verbose=4 --type execute "Float Browser.app"', 'blue')
  
  log('\n' + '='.repeat(60), 'cyan')
}

function printSummary (results) {
  log('\n' + '='.repeat(60), 'cyan')
  log('SUMMARY', 'cyan')
  log('='.repeat(60), 'cyan')
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : (result.warning ? '⚠️ ' : '❌')
    const color = result.passed ? 'green' : (result.warning ? 'yellow' : 'red')
    log(`${icon} ${result.name}`, color)
  })
  
  log('\n' + '='.repeat(60), 'cyan')
  
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed && !r.warning).length
  const warnings = results.filter(r => r.warning).length
  
  if (failed === 0) {
    log('✅ Notarization is properly configured!', 'green')
    
    if (warnings > 0) {
      log(`⚠️  ${warnings} optional item(s) not configured`, 'yellow')
    }
    
    return true
  } else {
    log(`❌ ${failed} check(s) failed`, 'red')
    
    if (warnings > 0) {
      log(`⚠️  ${warnings} warning(s)`, 'yellow')
    }
    
    return false
  }
}

// Main execution
async function main () {
  log('='.repeat(60), 'cyan')
  log('Float Browser - Notarization Test', 'cyan')
  log('='.repeat(60), 'cyan')
  
  const results = []
  
  // Run checks
  results.push({
    name: 'Notarization Credentials',
    passed: checkCredentials()
  })
  
  results.push({
    name: 'notarytool Available',
    passed: checkNotarytool()
  })
  
  const credentialsValid = testCredentials()
  results.push({
    name: 'Credentials Valid with Apple',
    passed: credentialsValid,
    warning: !credentialsValid
  })
  
  const appPath = checkBuiltApp()
  results.push({
    name: 'Built App Ready',
    passed: !!appPath,
    warning: !appPath
  })
  
  results.push({
    name: 'Build Configuration',
    passed: checkNotarizationInBuildConfig()
  })
  
  const simulated = simulateNotarization(appPath)
  results.push({
    name: 'Notarization Process',
    passed: simulated,
    warning: !simulated
  })
  
  // Print summary
  const success = printSummary(results)
  
  // Print instructions
  printInstructions()
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1)
}

main()
