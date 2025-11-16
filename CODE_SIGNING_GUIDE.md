# Float Browser Code Signing & Notarization Guide

## Overview

This guide covers the complete process of code signing and notarizing Float Browser for macOS distribution. Code signing ensures users can trust the app, while notarization provides Apple's verification that the app is free of malware.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Code Signing Setup](#code-signing-setup)
3. [Notarization Setup](#notarization-setup)
4. [Testing](#testing)
5. [Building](#building)
6. [Troubleshooting](#troubleshooting)
7. [Distribution](#distribution)

---

## Prerequisites

### Required

- **macOS**: Code signing and notarization require macOS
- **Xcode Command Line Tools**: Install with `xcode-select --install`
- **Apple Developer Account**: Paid membership ($99/year)
- **Node.js 16+**: For building the app

### Optional but Recommended

- **Developer ID Certificate**: For distribution outside the Mac App Store
- **Notarization Credentials**: For automated notarization

---

## Code Signing Setup

### Step 1: Get a Developer ID Certificate

1. **Join Apple Developer Program**
   - Go to https://developer.apple.com/programs/
   - Enroll in the Apple Developer Program ($99/year)
   - Wait for approval (usually 24-48 hours)

2. **Create Certificate**
   - Go to https://developer.apple.com/account/resources/certificates/list
   - Click the "+" button to create a new certificate
   - Select "Developer ID Application"
   - Follow the instructions to create a Certificate Signing Request (CSR)
   - Upload the CSR and download the certificate

3. **Install Certificate**
   - Double-click the downloaded certificate file
   - It will be added to your Keychain
   - Verify installation:
     ```bash
     security find-identity -v -p codesigning
     ```
   - You should see a line like:
     ```
     1) XXXXXXXXXX "Developer ID Application: Your Name (TEAMID)"
     ```

### Step 2: Configure Entitlements

Float Browser requires specific entitlements for full functionality. These are already configured in `resources/entitlements.mac.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- Required for Chromium/V8 JavaScript engine -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    
    <!-- Required for Electron -->
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    
    <!-- Network access -->
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
    
    <!-- Media access -->
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
    
    <!-- Additional permissions -->
    <key>com.apple.security.personal-information.location</key>
    <true/>
    <key>com.apple.security.print</key>
    <true/>
    <key>com.apple.security.automation.apple-events</key>
    <true/>
  </dict>
</plist>
```

### Step 3: Verify Build Configuration

The build configuration is already set up in `scripts/createPackage.js` and `scripts/buildMacDMG.js`:

- **App ID**: `com.floatbrowser.app`
- **Product Name**: `Float Browser`
- **Hardened Runtime**: Enabled
- **Entitlements**: `resources/entitlements.mac.plist`

### Step 4: Test Code Signing

Run the signing test script:

```bash
npm run testSigning
```

This will check:
- ✅ Developer ID certificate is installed
- ✅ Entitlements file is valid
- ✅ Build configuration is correct
- ✅ Built app is properly signed

---

## Notarization Setup

### Step 1: Get Notarization Credentials

1. **Apple ID**
   - Your Apple Developer account email address

2. **App-Specific Password**
   - Go to https://appleid.apple.com
   - Sign in with your Apple ID
   - Navigate to "Security" section
   - Under "App-Specific Passwords", click "Generate Password"
   - Enter a label: "Float Browser Notarization"
   - Copy the generated password (format: `xxxx-xxxx-xxxx-xxxx`)
   - **Important**: Save this password securely - you can't view it again

3. **Team ID**
   - Go to https://developer.apple.com/account
   - Sign in with your Apple ID
   - Navigate to "Membership" section
   - Your Team ID is displayed (10 characters, e.g., `22AZDZ6WBU`)

### Step 2: Configure Environment Variables

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your credentials**
   ```bash
   APPLE_ID=your-apple-id@example.com
   APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
   APPLE_TEAM_ID=XXXXXXXXXX
   ```

3. **Enable notarization (optional)**
   ```bash
   # Add this line to enable notarization
   ENABLE_NOTARIZATION=true
   ```

**Security Note**: The `.env` file is in `.gitignore` and will not be committed to version control.

### Step 3: Verify Notarization Configuration

Run the notarization test script:

```bash
npm run testNotarization
```

This will check:
- ✅ Credentials are set in .env
- ✅ notarytool is available
- ✅ Credentials are valid with Apple
- ✅ Build configuration includes notarization
- ✅ Notarization process can be simulated

---

## Testing

### Test Code Signing

```bash
# Run the signing test
npm run testSigning

# Expected output:
# ✅ Developer ID Certificate
# ✅ Entitlements Configuration
# ✅ Build Configuration
# ✅ Notarization Script
# ✅ Environment Variables
# ✅ Built App Signature
```

### Test Notarization

```bash
# Run the notarization test
npm run testNotarization

# Expected output:
# ✅ Notarization Credentials
# ✅ notarytool Available
# ✅ Credentials Valid with Apple
# ✅ Built App Ready
# ✅ Build Configuration
# ✅ Notarization Process
```

### Manual Verification

After building, verify the app manually:

```bash
# Verify signature
codesign --verify --deep --strict --verbose=2 "dist/app/mac-universal/Float Browser.app"

# Check signature details
codesign -dv --verbose=4 "dist/app/mac-universal/Float Browser.app"

# Test Gatekeeper
spctl --assess --verbose=4 --type execute "dist/app/mac-universal/Float Browser.app"

# Check if notarized
xcrun stapler validate "dist/app/mac-universal/Float Browser.app"
```

---

## Building

### Build Without Notarization (Default)

This is the default and recommended for development:

```bash
npm run buildMacDMGUniversal
```

Output:
- ✅ Code-signed with Developer ID
- ✅ Works on your Mac
- ⚠️  Not notarized (users may see a warning on first launch)

### Build With Notarization

To enable notarization, add to `.env`:

```bash
ENABLE_NOTARIZATION=true
```

Then build:

```bash
npm run buildMacDMGUniversal
```

This will:
1. Build the app
2. Sign with Developer ID
3. Submit to Apple for notarization
4. Wait for Apple's response (5-15 minutes)
5. Staple the notarization ticket
6. Create the DMG

**Note**: Notarization may fail if the app has issues. See [Troubleshooting](#troubleshooting) below.

### Build for Specific Architectures

```bash
# Intel only
npm run buildMacDMGIntel

# Apple Silicon only
npm run buildMacDMGArm

# Universal (Intel + Apple Silicon) - Recommended
npm run buildMacDMGUniversal
```

---

## Troubleshooting

### Code Signing Issues

#### "No Developer ID Certificate found"

**Cause**: Certificate not installed in Keychain

**Solution**:
1. Download certificate from https://developer.apple.com/account/resources/certificates/list
2. Double-click to install
3. Verify: `security find-identity -v -p codesigning`

#### "Code signing failed"

**Cause**: Certificate expired or invalid

**Solution**:
1. Check certificate expiration in Keychain Access
2. Renew certificate if expired
3. Ensure you have the private key for the certificate

#### "Entitlements validation failed"

**Cause**: Invalid entitlements file

**Solution**:
1. Validate XML: `plutil -lint resources/entitlements.mac.plist`
2. Check for typos in entitlement keys
3. Ensure all required entitlements are present

### Notarization Issues

#### "Invalid credentials"

**Cause**: Incorrect Apple ID, password, or Team ID

**Solution**:
1. Verify Apple ID is correct
2. Generate a new app-specific password
3. Verify Team ID matches your developer account
4. Check for extra spaces or quotes in `.env` file

#### "Notarization failed: Invalid"

**Cause**: Apple rejected the app

**Solution**:
1. Get the submission ID from the error message
2. Download the detailed log:
   ```bash
   xcrun notarytool log <submission-id> \
     --apple-id your@email.com \
     --password xxxx-xxxx-xxxx-xxxx \
     --team-id XXXXXXXXXX
   ```
3. Review the log for specific errors
4. Common issues:
   - Unsigned components
   - Invalid entitlements
   - Bundle structure problems
   - Hardened runtime issues

#### "Notarization timed out"

**Cause**: Apple's servers are slow or overloaded

**Solution**:
1. Wait and try again later
2. Check Apple's system status: https://developer.apple.com/system-status/
3. The signed app is still in `dist/app/mac-universal/`

### Gatekeeper Issues

#### "App cannot be opened because the developer cannot be verified"

**Cause**: App is not notarized

**Workaround for users**:
1. Right-click the app
2. Select "Open"
3. Click "Open" in the security dialog
4. After first launch, app will open normally

**Permanent solution**:
1. Enable notarization: `ENABLE_NOTARIZATION=true` in `.env`
2. Rebuild: `npm run buildMacDMGUniversal`
3. Wait for notarization to complete

---

## Distribution

### Recommended Distribution Method

1. **Build universal DMG with notarization**
   ```bash
   # Enable notarization in .env
   echo "ENABLE_NOTARIZATION=true" >> .env
   
   # Build
   npm run buildMacDMGUniversal
   ```

2. **Verify the build**
   ```bash
   # Check signature
   codesign --verify --deep --strict "dist/app/mac-universal/Float Browser.app"
   
   # Check notarization
   spctl --assess --verbose=4 --type execute "dist/app/mac-universal/Float Browser.app"
   ```

3. **Test on both architectures**
   - Test on Intel Mac
   - Test on Apple Silicon Mac
   - Verify no security warnings

4. **Distribute the DMG**
   - Upload to website
   - Create GitHub release
   - Share download link

### Distribution Checklist

- [ ] Build universal DMG
- [ ] Code sign with Developer ID
- [ ] Notarize with Apple
- [ ] Test on Intel Mac
- [ ] Test on Apple Silicon Mac
- [ ] Verify Gatekeeper acceptance
- [ ] Test installation from DMG
- [ ] Test all Float features
- [ ] Create release notes
- [ ] Upload to distribution platform

### File Naming

- Universal DMG: `Float Browser-2.0.0-universal.dmg`
- Intel DMG: `Float Browser-2.0.0.dmg`
- ARM64 DMG: `Float Browser-2.0.0-arm64.dmg`

---

## Security Best Practices

### Protecting Credentials

1. **Never commit .env to version control**
   - ✅ `.env` is in `.gitignore`
   - ✅ Only commit `.env.example`

2. **Use app-specific passwords**
   - ✅ Not your main Apple ID password
   - ✅ Can be revoked if compromised
   - ✅ Limited to notarization only

3. **Protect your certificate**
   - ✅ Stored in macOS Keychain
   - ✅ Protected by login password
   - ✅ Can be exported for backup (password protected)

### CI/CD Integration

For automated builds:

1. Store credentials as secrets in your CI system
2. Create `.env` file during build:
   ```bash
   echo "APPLE_ID=$APPLE_ID" > .env
   echo "APPLE_APP_SPECIFIC_PASSWORD=$APPLE_PASSWORD" >> .env
   echo "APPLE_TEAM_ID=$APPLE_TEAM_ID" >> .env
   echo "ENABLE_NOTARIZATION=true" >> .env
   ```
3. Run build: `npm run buildMacDMGUniversal`
4. Upload DMG as artifact

---

## Additional Resources

### Apple Documentation

- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Resolving Common Notarization Issues](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues)
- [Hardened Runtime](https://developer.apple.com/documentation/security/hardened_runtime)

### Electron Documentation

- [Code Signing](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- [Mac App Store Submission](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide)

### electron-builder Documentation

- [macOS Configuration](https://www.electron.build/configuration/mac)
- [Notarization](https://www.electron.build/configuration/mac#notarization)
- [Code Signing](https://www.electron.build/code-signing)

### Tools

- [@electron/notarize](https://github.com/electron/notarize)
- [electron-builder](https://www.electron.build/)
- [Apple Developer Portal](https://developer.apple.com)

---

## Support

### Getting Help

1. **Check this guide first**
2. **Run test scripts**:
   - `npm run testSigning`
   - `npm run testNotarization`
3. **Review error messages carefully**
4. **Check Apple's system status**: https://developer.apple.com/system-status/
5. **Search electron-builder issues**: https://github.com/electron-userland/electron-builder/issues
6. **Open an issue on GitHub** with full error output

### Common Commands Reference

```bash
# Test signing configuration
npm run testSigning

# Test notarization configuration
npm run testNotarization

# Build without notarization (default)
npm run buildMacDMGUniversal

# Build with notarization (set ENABLE_NOTARIZATION=true in .env)
npm run buildMacDMGUniversal

# Verify signature
codesign --verify --deep --strict "dist/app/mac-universal/Float Browser.app"

# Check signature details
codesign -dv --verbose=4 "dist/app/mac-universal/Float Browser.app"

# Test Gatekeeper
spctl --assess --verbose=4 --type execute "dist/app/mac-universal/Float Browser.app"

# Check notarization
xcrun stapler validate "dist/app/mac-universal/Float Browser.app"

# Get notarization log
xcrun notarytool log <submission-id> \
  --apple-id your@email.com \
  --password xxxx-xxxx-xxxx-xxxx \
  --team-id XXXXXXXXXX
```

---

## Current Status

**Code Signing**: ✅ Fully configured and tested  
**Notarization**: ✅ Configured, disabled by default  
**Build System**: ✅ Automated with electron-builder  
**Testing**: ✅ Test scripts available  
**Documentation**: ✅ Complete

**Last Updated**: November 16, 2024  
**Float Browser Version**: 2.0.0  
**Based on**: Min Browser v1.35.2

