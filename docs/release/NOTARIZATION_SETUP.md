---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)**

---

# Float Browser Notarization Setup

## Overview

Float Browser uses Apple's notarization service to ensure the app can be installed without security warnings on macOS.

## How It Works

The build system automatically handles notarization when Apple Developer credentials are provided:

1. **Credentials Detection**: Checks for credentials in `.env` file
2. **Code Signing**: Signs the app with your Developer ID certificate
3. **Notarization**: Submits to Apple's notarization service
4. **Waiting**: Waits for Apple's approval (5-15 minutes)
5. **Stapling**: Attaches the notarization ticket to the DMG

## Setup Instructions

### 1. Install dotenv (Already Done)

```bash
npm install
```

### 2. Create .env File

Copy the example file:
```bash
cp .env.example .env
```

### 3. Add Your Credentials

Edit `.env` with your Apple Developer credentials:

```bash
APPLE_ID=your-apple-id@example.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID=XXXXXXXXXX
```

### 4. Get Your Credentials

#### Apple ID
Your Apple Developer account email address.

#### App-Specific Password
1. Go to https://appleid.apple.com
2. Sign in with your Apple ID
3. Go to "Security" section
4. Under "App-Specific Passwords", click "Generate Password"
5. Enter a label (e.g., "Float Browser Notarization")
6. Copy the generated password (format: xxxx-xxxx-xxxx-xxxx)

#### Team ID
1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Go to "Membership" section
4. Your Team ID is displayed (10 characters, e.g., "22AZDZ6WBU")

## Building with Notarization

### Universal DMG (Recommended)

```bash
npm run buildMacDMGUniversal
```

This will:
- Build for both Intel and Apple Silicon
- Sign with your Developer ID
- Submit for notarization
- Wait for Apple's approval
- Create a notarized universal DMG

**Expected time**: 10-20 minutes (5-15 minutes for notarization)

### Intel or ARM64 Only

```bash
npm run buildMacDMGIntel    # Intel only
npm run buildMacDMGArm      # Apple Silicon only
```

## Build Output

### With Notarization

When credentials are provided, you'll see:

```
• signing         file=dist/app/mac-universal/Float Browser.app
• notarizing      Submitting to Apple...
• notarizing      Waiting for response...
• notarizing      Successfully notarized
• building        target=DMG
```

Output: `dist/app/Float Browser-2.0.0-universal.dmg` (fully notarized)

### Without Notarization

When credentials are not provided:

```
Notarization credentials not found in .env file - build will be signed but not notarized
• signing         file=dist/app/mac-universal/Float Browser.app
• building        target=DMG
```

Output: `dist/app/Float Browser-2.0.0-universal.dmg` (signed but not notarized)

## Verification

### Check if DMG is Notarized

```bash
spctl -a -vv -t install "dist/app/Float Browser-2.0.0-universal.dmg"
```

**Notarized output:**
```
accepted
source=Notarized Developer ID
```

**Not notarized output:**
```
accepted
source=Developer ID
```

### Check App Signature

```bash
codesign -dv --verbose=4 "dist/app/mac-universal/Float Browser.app"
```

Should show your Developer ID certificate.

### Check Universal Binary

```bash
lipo -info "dist/app/mac-universal/Float Browser.app/Contents/MacOS/Float Browser"
```

Should show: `Architectures in the fat file: x86_64 arm64`

## Troubleshooting

### "Notarization credentials not found"

**Cause**: `.env` file doesn't exist or credentials are missing

**Solution**:
1. Verify `.env` file exists: `ls -la .env`
2. Check credentials are set: `cat .env`
3. Ensure no typos in variable names

### "Notarization failed: Invalid credentials"

**Cause**: Incorrect Apple ID, password, or Team ID

**Solution**:
1. Verify Apple ID is correct
2. Generate a new app-specific password
3. Verify Team ID matches your developer account
4. Check for extra spaces or quotes in `.env` file

### "Notarization timed out"

**Cause**: Apple's servers are slow or overloaded

**Solution**:
1. Wait and try again later
2. Check Apple's system status: https://developer.apple.com/system-status/
3. The build will fail but the signed app is still in `dist/app/mac-universal/`

### "Certificate not found"

**Cause**: Developer ID certificate not installed in Keychain

**Solution**:
1. Open Keychain Access
2. Check for "Developer ID Application" certificate
3. If missing, download from https://developer.apple.com/account/resources/certificates/list
4. Double-click to install

### Build succeeds but shows warning on install

**Cause**: App is signed but not notarized

**Solution**:
1. Verify `.env` file has correct credentials
2. Rebuild with `npm run buildMacDMGUniversal`
3. Wait for notarization to complete

## Security Notes

### .env File Security

- ✅ `.env` is in `.gitignore` - won't be committed to git
- ✅ Contains sensitive credentials - keep it private
- ✅ Never share your app-specific password
- ✅ Never commit `.env` to version control

### App-Specific Password

- Use a unique password for Float Browser builds
- Can be revoked at appleid.apple.com if compromised
- Does not grant access to your Apple ID account
- Only works for notarization, not account access

### Certificate Security

- Developer ID certificate is stored in macOS Keychain
- Protected by your Mac's login password
- Can be exported for backup (password protected)
- Should not be shared or committed to git

## CI/CD Integration

For automated builds in CI/CD:

1. Store credentials as secrets in your CI system
2. Create `.env` file during build:
   ```bash
   echo "APPLE_ID=$APPLE_ID" > .env
   echo "APPLE_APP_SPECIFIC_PASSWORD=$APPLE_PASSWORD" >> .env
   echo "APPLE_TEAM_ID=$APPLE_TEAM_ID" >> .env
   ```
3. Run build: `npm run buildMacDMGUniversal`
4. Upload DMG as artifact

## Additional Resources

- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [electron-builder Notarization](https://www.electron.build/configuration/mac#notarization)
- [@electron/notarize Documentation](https://github.com/electron/notarize)
- [Apple Developer Portal](https://developer.apple.com)

## Support

If you encounter issues:

1. Check this guide first
2. Review BUILD_GUIDE.md for general build issues
3. Check electron-builder documentation
4. Open an issue on GitHub with full error output

---

**Current Status**: Notarization configured and ready to use
**Last Updated**: November 16, 2024
