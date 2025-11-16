#!/usr/bin/env node

/**
 * Test Code Signing Configuration
 * 
 * This script verifies that code signing is properly configured for Float Browser.
 * It checks for certificates, validates entitlements, and tests signing.
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

function checkCertificate () {
  log('\n📜 Checking for Developer ID Certificate...', 'cyan')
  
  const result = exec('security find-identity -v -p codesigning')
  
  if (!result) {
    log('❌ Failed to query certificates', 'red')
    return false
  }
  
  const lines = result.split('\n').filter(line => line.includes('Developer ID Application'))
  
  if (lines.length === 0) {
    log('❌ No Developer ID Application certificate found', 'red')
    log('   Install a certificate from https://developer.apple.com/account/resources/certificates/list', 'yellow')
    return false
  }
  
  log('✅ Found Developer ID Application certificate(s):', 'green')
  lines.forEach(line => {
    const match = line.match(/"([^"]+)"/)
    if (match) {
      log(`   ${match[1]}`, 'blue')
    }
  })
  
  return true
}

function checkEntitlements () {
  log('\n📋 Checking Entitlements File...', 'cyan')
  
  const entitlementsPath = path.join(__dirname, '..', 'resources', 'entitlements.mac.plist')
  
  if (!fs.existsSync(entitlementsPath)) {
    log('❌ Entitlements file not found at resources/entitlements.mac.plist', 'red')
    return false
  }
  
  log('✅ Entitlements file exists', 'green')
  
  // Validate XML
  const result = exec(`plutil -lint "${entitlementsPath}"`)
  
  if (!result || !result.includes('OK')) {
    log('❌ Entitlements file is not valid XML', 'red')
    return false
  }
  
  log('✅ Entitlements file is valid XML', 'green')
  
  // Check for required entitlements
  const content = fs.readFileSync(entitlementsPath, 'utf8')
  const requiredEntitlements = [
    'com.apple.security.cs.allow-jit',
    'com.apple.security.network.client'
  ]
  
  let allPresent = true
  requiredEntitlements.forEach(entitlement => {
    if (content.includes(entitlement)) {
      log(`   ✅ ${entitlement}`, 'green')
    } else {
      log(`   ❌ Missing: ${entitlement}`, 'red')
      allPresent = false
    }
  })
  
  return allPresent
}

function checkBuildConfig () {
  log('\n⚙️  Checking Build Configuration...', 'cyan')
  
  const packagePath = path.join(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  // Check package.json
  if (packageJson.name !== 'float-browser') {
    log('❌ package.json name should be "float-browser"', 'red')
    return false
  }
  log('✅ package.json name is correct', 'green')
  
  if (packageJson.productName !== 'Float Browser') {
    log('❌ package.json productName should be "Float Browser"', 'red')
    return false
  }
  log('✅ package.json productName is correct', 'green')
  
  // Check for @electron/notarize dependency
  if (!packageJson.devDependencies['@electron/notarize']) {
    log('❌ @electron/notarize not found in devDependencies', 'red')
    return false
  }
  log('✅ @electron/notarize is installed', 'green')
  
  // Check createPackage.js
  const createPackagePath = path.join(__dirname, 'createPackage.js')
  const createPackageContent = fs.readFileSync(createPackagePath, 'utf8')
  
  if (!createPackageContent.includes('com.floatbrowser.app')) {
    log('❌ createPackage.js should use appId "com.floatbrowser.app"', 'red')
    return false
  }
  log('✅ createPackage.js appId is correct', 'green')
  
  if (!createPackageContent.includes('hardenedRuntime: true')) {
    log('❌ createPackage.js should enable hardenedRuntime', 'red')
    return false
  }
  log('✅ createPackage.js has hardenedRuntime enabled', 'green')
  
  if (!createPackageContent.includes('entitlements.mac.plist')) {
    log('❌ createPackage.js should reference entitlements.mac.plist', 'red')
    return false
  }
  log('✅ createPackage.js references entitlements', 'green')
  
  return true
}

function checkNotarizationScript () {
  log('\n🔐 Checking Notarization Script...', 'cyan')
  
  const notarizePath = path.join(__dirname, 'notarize.js')
  
  if (!fs.existsSync(notarizePath)) {
    log('❌ notarize.js not found', 'red')
    return false
  }
  log('✅ notarize.js exists', 'green')
  
  const content = fs.readFileSync(notarizePath, 'utf8')
  
  if (!content.includes('@electron/notarize')) {
    log('❌ notarize.js should use @electron/notarize', 'red')
    return false
  }
  log('✅ notarize.js uses @electron/notarize', 'green')
  
  if (!content.includes('notarytool')) {
    log('❌ notarize.js should use notarytool', 'red')
    return false
  }
  log('✅ notarize.js uses notarytool', 'green')
  
  return true
}

function checkEnvironmentVariables () {
  log('\n🔑 Checking Environment Variables...', 'cyan')
  
  const envPath = path.join(__dirname, '..', '.env')
  
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env file not found (optional for signing, required for notarization)', 'yellow')
    log('   Copy .env.example to .env and add your credentials', 'yellow')
    return false
  }
  
  log('✅ .env file exists', 'green')
  
  // Load .env
  require('dotenv').config({ path: envPath })
  
  const hasAppleId = !!process.env.APPLE_ID
  const hasPassword = !!process.env.APPLE_APP_SPECIFIC_PASSWORD
  const hasTeamId = !!process.env.APPLE_TEAM_ID
  
  if (hasAppleId) {
    log('✅ APPLE_ID is set', 'green')
  } else {
    log('⚠️  APPLE_ID not set', 'yellow')
  }
  
  if (hasPassword) {
    log('✅ APPLE_APP_SPECIFIC_PASSWORD is set', 'green')
  } else {
    log('⚠️  APPLE_APP_SPECIFIC_PASSWORD not set', 'yellow')
  }
  
  if (hasTeamId) {
    log('✅ APPLE_TEAM_ID is set', 'green')
  } else {
    log('⚠️  APPLE_TEAM_ID not set', 'yellow')
  }
  
  return hasAppleId && hasPassword && hasTeamId
}

function testSigningOnBuild () {
  log('\n🔨 Testing Signing on Built App...', 'cyan')
  
  // Check for built app
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
    log('⚠️  No built app found. Run a build first:', 'yellow')
    log('   npm run buildMacDMGIntel', 'yellow')
    log('   npm run buildMacDMGArm', 'yellow')
    log('   npm run buildMacDMGUniversal', 'yellow')
    return false
  }
  
  log(`✅ Found built app: ${path.basename(path.dirname(appPath))}`, 'green')
  
  // Verify signature
  log('\n   Verifying signature...', 'blue')
  const verifyResult = exec(`codesign --verify --deep --strict --verbose=2 "${appPath}" 2>&1`)
  
  if (!verifyResult || verifyResult.includes('invalid') || verifyResult.includes('failed')) {
    log('   ❌ Signature verification failed', 'red')
    if (verifyResult) {
      log(`   ${verifyResult}`, 'red')
    }
    return false
  }
  
  log('   ✅ Signature is valid', 'green')
  
  // Check signature details
  log('\n   Checking signature details...', 'blue')
  const detailsResult = exec(`codesign -dv --verbose=4 "${appPath}" 2>&1`)
  
  if (detailsResult) {
    const lines = detailsResult.split('\n')
    const authority = lines.find(l => l.includes('Authority=Developer ID Application'))
    const identifier = lines.find(l => l.includes('Identifier='))
    const runtime = lines.find(l => l.includes('runtime'))
    
    if (authority) {
      log(`   ✅ ${authority.trim()}`, 'green')
    } else {
      log('   ⚠️  Not signed with Developer ID', 'yellow')
    }
    
    if (identifier) {
      log(`   ✅ ${identifier.trim()}`, 'green')
    }
    
    if (runtime) {
      log('   ✅ Hardened Runtime enabled', 'green')
    } else {
      log('   ⚠️  Hardened Runtime not detected', 'yellow')
    }
  }
  
  // Check Gatekeeper assessment
  log('\n   Testing Gatekeeper assessment...', 'blue')
  const gatekeeperResult = exec(`spctl --assess --verbose=4 --type execute "${appPath}" 2>&1`)
  
  if (gatekeeperResult) {
    if (gatekeeperResult.includes('accepted')) {
      log('   ✅ Gatekeeper accepts the app', 'green')
      
      if (gatekeeperResult.includes('Notarized Developer ID')) {
        log('   ✅ App is notarized', 'green')
      } else if (gatekeeperResult.includes('Developer ID')) {
        log('   ✅ App is signed with Developer ID', 'green')
        log('   ℹ️  App is not notarized (users may see a warning)', 'blue')
      }
    } else {
      log('   ❌ Gatekeeper rejects the app', 'red')
    }
  }
  
  return true
}

function printSummary (results) {
  log('\n' + '='.repeat(60), 'cyan')
  log('SUMMARY', 'cyan')
  log('='.repeat(60), 'cyan')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : (result.warning ? '⚠️ ' : '❌')
    const color = result.passed ? 'green' : (result.warning ? 'yellow' : 'red')
    log(`${icon} ${result.name}`, color)
  })
  
  log('\n' + '='.repeat(60), 'cyan')
  
  if (passed === total) {
    log('🎉 All checks passed! Code signing is properly configured.', 'green')
    return true
  } else {
    const failed = results.filter(r => !r.passed && !r.warning).length
    const warnings = results.filter(r => r.warning).length
    
    if (failed > 0) {
      log(`❌ ${failed} check(s) failed. Please fix the issues above.`, 'red')
    }
    if (warnings > 0) {
      log(`⚠️  ${warnings} warning(s). These are optional but recommended.`, 'yellow')
    }
    return false
  }
}

// Main execution
async function main () {
  log('='.repeat(60), 'cyan')
  log('Float Browser - Code Signing Test', 'cyan')
  log('='.repeat(60), 'cyan')
  
  const results = []
  
  // Run checks
  results.push({
    name: 'Developer ID Certificate',
    passed: checkCertificate()
  })
  
  results.push({
    name: 'Entitlements Configuration',
    passed: checkEntitlements()
  })
  
  results.push({
    name: 'Build Configuration',
    passed: checkBuildConfig()
  })
  
  results.push({
    name: 'Notarization Script',
    passed: checkNotarizationScript()
  })
  
  const envResult = checkEnvironmentVariables()
  results.push({
    name: 'Environment Variables',
    passed: envResult,
    warning: !envResult
  })
  
  const signingResult = testSigningOnBuild()
  results.push({
    name: 'Built App Signature',
    passed: signingResult,
    warning: !signingResult
  })
  
  // Print summary
  const success = printSummary(results)
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1)
}

main()
