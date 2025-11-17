---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](README.md)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# Float Browser Build Configuration Summary

This document summarizes the build configuration changes made for Float Browser v2.0.

## Completed Tasks

### Task 23.1: Update package.json ✅

Updated `package.json` with Float Browser branding:
- **Name**: `float-browser`
- **Version**: `2.0.0`
- **Product Name**: `Float Browser`
- **Description**: "A transparent, always-on-top browser based on Min Browser"
- **Added dependency**: `@electron/notarize` for macOS notarization

### Task 23.2: Configure electron-builder ✅

#### Updated `scripts/createPackage.js`
- **App ID**: `com.floatbrowser.app`
- **Product Name**: `Float Browser`
- **Hardened Runtime**: Enabled for macOS security
- **Entitlements**: Added `resources/entitlements.mac.plist`
- **DMG Configuration**: Added DMG creation settings
- **Notarization**: Added `afterSign` hook pointing to `scripts/notarize.js`

#### Created `resources/entitlements.mac.plist`
Entitlements file for macOS code signing with permissions for:
- JIT compilation (required for Chromium)
- Network access (client and server)
- Camera and microphone
- Location services
- Address book, calendars, photos
- Printing and automation

#### Created `scripts/notarize.js`
Automated notarization script that:
- Checks for required environment variables (APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID)
- Uses Apple's notarytool for notarization
- Gracefully skips if credentials not available
- Provides clear error messages

#### Updated `scripts/buildMac.js`
- Changed app name references from "Min.app" to "Float Browser.app"
- Updated output file names to use "float-browser" prefix

#### Created `scripts/buildMacDMG.js`
New script for building DMG installers with:
- Support for Intel (x64), ARM64, and Universal architectures
- DMG window configuration (540x380)
- Application icon and drag-to-Applications layout
- Full code signing and notarization integration
- x64ArchFiles configuration to handle fsevents.node in universal builds

### Task 23.3: Create universal binary ✅

#### Added npm scripts to `package.json`
```json
"buildMacDMGIntel": "npm run build && node ./scripts/buildMacDMG.js --platform=x86"
"buildMacDMGArm": "npm run build && node ./scripts/buildMacDMG.js --platform=arm64"
"buildMacDMGUniversal": "npm run build && node ./scripts/buildMacDMG.js --platform=universal"
```

#### Universal Binary Support
- Configured electron-builder to create universal binaries (x64 + ARM64)
- Single DMG works on both Intel and Apple Silicon Macs
- Recommended for distribution to support all Mac users

## Build Commands

### Development
```bash
npm run build        # Build all components
npm run start        # Build and start with hot reload
```

### macOS Zip Archives
```bash
npm run buildMacIntel    # Intel x64 zip
npm run buildMacArm      # Apple Silicon ARM64 zip
```

### macOS DMG Installers
```bash
npm run buildMacDMGIntel      # Intel DMG
npm run buildMacDMGArm        # ARM64 DMG
npm run buildMacDMGUniversal  # Universal DMG (recommended)
```

### Other Platforms
```bash
npm run buildWindows    # Windows installers
npm run buildDebian     # Debian package
npm run buildRedhat     # RPM package
npm run buildAppImage   # Linux AppImage
```

## Code Signing Setup

### Required Environment Variables

**Using .env file (Recommended):**

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:
   ```bash
   APPLE_ID=your-apple-id@example.com
   APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
   APPLE_TEAM_ID=XXXXXXXXXX
   ```

The `.env` file is automatically loaded during builds and is excluded from git.

**Alternative: Shell environment variables:**

```bash
export APPLE_ID="your-apple-id@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="XXXXXXXXXX"
```

### How to Get Credentials

1. **Apple ID**: Your Apple Developer account email
2. **App-Specific Password**: 
   - Go to appleid.apple.com
   - Sign in and generate app-specific password
3. **Team ID**: 
   - Go to developer.apple.com
   - Account → Membership → Team ID

### Automatic Process

When environment variables are set, the build automatically:
1. Signs the app with Developer ID certificate
2. Submits to Apple for notarization
3. Waits for notarization to complete
4. Staples the notarization ticket to the DMG

### Without Credentials

If credentials are not set:
- Build completes successfully
- App is signed with ad-hoc signature (for local testing)
- Notarization is skipped
- Warning message is displayed

## File Structure

### New Files Created
```
resources/
└── entitlements.mac.plist          # macOS entitlements

scripts/
├── notarize.js                     # Notarization automation
└── buildMacDMG.js                  # DMG build script

BUILD_GUIDE.md                      # Comprehensive build guide
FLOAT_BUILD_CONFIGURATION.md        # This file
```

### Modified Files
```
package.json                        # Updated branding and scripts
scripts/createPackage.js            # Added Float configuration
scripts/buildMac.js                 # Updated app name references
```

## Build Output

All builds are created in `dist/app/`:

```
dist/app/
├── Float Browser-2.0.0-universal.dmg    # Universal DMG (recommended)
├── Float Browser-2.0.0.dmg              # Intel DMG
├── Float Browser-2.0.0-arm64.dmg        # ARM64 DMG
├── float-browser-v2.0.0-mac-x86.zip     # Intel zip
├── float-browser-v2.0.0-mac-arm64.zip   # ARM64 zip
├── mac/                                  # Intel app bundle
├── mac-arm64/                            # ARM64 app bundle
└── mac-universal/                        # Universal app bundle
```

## Requirements Satisfied

### Requirement 14.1: Code Signing ✅
- Configured hardened runtime
- Added entitlements file
- Integrated with Developer ID certificate

### Requirement 14.2: Notarization ✅
- Created notarization script
- Integrated with build process
- Supports environment variable configuration

### Requirement 14.3: DMG Creation ✅
- Created DMG build script
- Configured DMG layout and appearance
- Updated product name and branding

### Requirement 11.2: Universal Binary ✅
- Configured x64 + ARM64 support
- Created universal build script
- Single binary works on all Macs

## Testing

### Verify Build Configuration
```bash
# Check package.json
cat package.json | grep -A 5 '"name"'

# Check entitlements exist
ls -la resources/entitlements.mac.plist

# Check notarization script
ls -la scripts/notarize.js

# Check DMG build script
ls -la scripts/buildMacDMG.js
```

### Test Build (without signing)
```bash
npm run build
npm run buildMacDMGIntel
```

### Test Build (with signing)
```bash
export APPLE_ID="your-apple-id@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="XXXXXXXXXX"

npm run buildMacDMGUniversal
```

### Verify Universal Binary
```bash
lipo -info "dist/app/mac-universal/Float Browser.app/Contents/MacOS/Float Browser"
# Should show: Architectures in the fat file: x86_64 arm64
```

## Next Steps

### For Development
1. Continue using `npm run start` for development
2. Test builds locally with `npm run buildMacDMGIntel`

### For Distribution
1. Set up Apple Developer account
2. Create Developer ID certificate
3. Generate app-specific password
4. Set environment variables
5. Build universal DMG: `npm run buildMacDMGUniversal`
6. Test on both Intel and Apple Silicon Macs
7. Distribute DMG file

## Documentation

- **BUILD_GUIDE.md**: Comprehensive guide for building and distributing
- **FLOAT_BUILD_CONFIGURATION.md**: This summary document
- **package.json**: Build scripts and configuration
- **scripts/**: Build automation scripts

## Support

For build issues, refer to:
1. BUILD_GUIDE.md (detailed troubleshooting)
2. electron-builder documentation
3. Apple developer documentation
4. GitHub issues

---

**Status**: All build configuration tasks completed ✅
**Version**: Float Browser v2.0.0
**Based on**: Min Browser v1.35.2
