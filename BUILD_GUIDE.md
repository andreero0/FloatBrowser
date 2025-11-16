# Float Browser Build Guide

This guide explains how to build Float Browser for different platforms and architectures.

## Prerequisites

- Node.js 16+ and npm
- For macOS builds: macOS with Xcode Command Line Tools
- For code signing: Apple Developer account and certificates
- For notarization: Apple ID, app-specific password, and Team ID

## Build Commands

### Development Build

```bash
npm install
npm run build
npm run start
```

### macOS Builds

#### Build for Intel (x64)
```bash
npm run buildMacIntel
```
Creates: `dist/app/float-browser-v2.0.0-mac-x86.zip`

#### Build for Apple Silicon (ARM64)
```bash
npm run buildMacArm
```
Creates: `dist/app/float-browser-v2.0.0-mac-arm64.zip`

#### Build DMG for Intel
```bash
npm run buildMacDMGIntel
```
Creates: `dist/app/Float Browser-2.0.0.dmg` (Intel only)

#### Build DMG for Apple Silicon
```bash
npm run buildMacDMGArm
```
Creates: `dist/app/Float Browser-2.0.0-arm64.dmg` (ARM64 only)

#### Build Universal DMG (Intel + Apple Silicon)
```bash
npm run buildMacDMGUniversal
```
Creates: `dist/app/Float Browser-2.0.0-universal.dmg` (Universal binary)

**Recommended**: Use the universal build for distribution as it works on both Intel and Apple Silicon Macs.

### Windows Builds

```bash
npm run buildWindows
```
Creates:
- `dist/app/Min-v2.0.0-windows.zip` (x64)
- `dist/app/Min-v2.0.0-windows-ia32.zip` (32-bit)
- `dist/app/Min-v2.0.0-windows-arm64.zip` (ARM64)
- Installers in `dist/app/`

### Linux Builds

#### Debian/Ubuntu
```bash
npm run buildDebian
```

#### RedHat/Fedora
```bash
npm run buildRedhat
```

#### AppImage
```bash
npm run buildAppImage
```

## Code Signing and Notarization (macOS)

**For detailed instructions, see [CODE_SIGNING_GUIDE.md](CODE_SIGNING_GUIDE.md)**

### Quick Setup

1. **Get Apple Developer Certificate**
   - Join Apple Developer Program
   - Create a Developer ID Application certificate
   - Install certificate in Keychain

2. **Create App-Specific Password**
   - Go to appleid.apple.com
   - Sign in with your Apple ID
   - Generate an app-specific password

3. **Configure Environment Variables**

**Option A: Using .env file (Recommended)**

Copy the example file and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
APPLE_ID=your-apple-id@example.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID=XXXXXXXXXX
```

The `.env` file is automatically loaded during builds and is excluded from git.

**Option B: Using shell environment variables**

```bash
export APPLE_ID="your-apple-id@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="XXXXXXXXXX"
```

Add these to your `~/.zshrc` or `~/.bash_profile` for persistence.

### Building with Code Signing

When the environment variables are set, the build process will automatically:
1. Sign the application with your Developer ID certificate
2. Notarize the application with Apple
3. Staple the notarization ticket to the DMG

```bash
npm run buildMacDMGUniversal
```

The notarization process can take 5-15 minutes. The build will wait for Apple's servers to complete notarization.

### Manual Code Signing

If you need to sign manually:

```bash
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name (TEAMID)" "dist/app/mac/Float Browser.app"
```

### Verify Signing

```bash
codesign --verify --deep --strict --verbose=2 "dist/app/mac/Float Browser.app"
spctl -a -t exec -vv "dist/app/mac/Float Browser.app"
```

### Manual Notarization

If automatic notarization fails, you can notarize manually:

```bash
# Create a zip of the app
ditto -c -k --keepParent "dist/app/mac/Float Browser.app" "FloatBrowser.zip"

# Submit for notarization
xcrun notarytool submit FloatBrowser.zip \
  --apple-id "your-apple-id@example.com" \
  --password "xxxx-xxxx-xxxx-xxxx" \
  --team-id "XXXXXXXXXX" \
  --wait

# Staple the ticket
xcrun stapler staple "dist/app/mac/Float Browser.app"
```

## Build Configuration

### electron-builder Configuration

The build configuration is in `scripts/createPackage.js` and `scripts/buildMacDMG.js`:

- **App ID**: `com.floatbrowser.app`
- **Product Name**: `Float Browser`
- **Entitlements**: `resources/entitlements.mac.plist`
- **Notarization**: `scripts/notarize.js`

### Entitlements

The `resources/entitlements.mac.plist` file includes entitlements for:
- JIT compilation (required for Chromium)
- Network access (client and server)
- Camera and microphone access
- Location services
- Address book, calendars, photos
- Printing
- Apple Events automation

These are required for full browser functionality.

## Testing Builds

### Test on Intel Mac
```bash
open "dist/app/mac/Float Browser.app"
```

### Test on Apple Silicon Mac
```bash
open "dist/app/mac-arm64/Float Browser.app"
```

### Test Universal Binary
```bash
# Check architectures included
lipo -info "dist/app/mac-universal/Float Browser.app/Contents/MacOS/Float Browser"

# Should show: x86_64 arm64
```

### Test DMG Installation
```bash
open "dist/app/Float Browser-2.0.0-universal.dmg"
# Drag to Applications folder
# Launch from Applications
```

### Verify Gatekeeper
```bash
spctl --assess --verbose=4 --type execute "dist/app/mac/Float Browser.app"
# Should show: accepted
```

## Troubleshooting

### Build Fails with "Module not found"
```bash
rm -rf node_modules
npm install
npm run build
```

### Code Signing Fails
- Verify certificate is installed: `security find-identity -v -p codesigning`
- Check certificate is valid and not expired
- Ensure you have the private key for the certificate

### Notarization Fails
- Verify environment variables are set correctly
- Check Apple ID has 2FA enabled
- Verify app-specific password is correct
- Check Team ID matches your developer account

### Universal Binary Fails
- Ensure you're on macOS (universal builds require macOS)
- Check Xcode Command Line Tools are installed: `xcode-select --install`
- Verify electron-builder supports universal builds: `npm list electron-builder`
- If you see errors about fsevents.node, the x64ArchFiles configuration handles this automatically

### DMG Creation Fails
- Check disk space (DMG creation requires temporary space)
- Verify icon files exist in `icons/` directory
- Check `resources/` directory exists

## Distribution

### Recommended Distribution Method

1. Build universal DMG:
   ```bash
   npm run buildMacDMGUniversal
   ```

2. Test on both Intel and Apple Silicon Macs

3. Distribute the DMG file:
   - Upload to website
   - Create GitHub release
   - Share download link

### File Naming

- Universal DMG: `Float Browser-2.0.0-universal.dmg`
- Intel DMG: `Float Browser-2.0.0.dmg`
- ARM64 DMG: `Float Browser-2.0.0-arm64.dmg`

### Release Checklist

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

## Build Output

All builds are created in the `dist/app/` directory:

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

## Additional Resources

- [electron-builder Documentation](https://www.electron.build/)
- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)

## Support

For build issues:
1. Check this guide first
2. Review error messages carefully
3. Check electron-builder documentation
4. Open an issue on GitHub with full error output
