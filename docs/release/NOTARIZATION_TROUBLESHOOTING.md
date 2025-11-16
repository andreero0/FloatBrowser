---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)**

---

# Notarization Troubleshooting

## Current Status

Float Browser builds are **code-signed** with a Developer ID certificate but **notarization is disabled by default** due to Apple rejecting the initial submission with status "Invalid".

## What This Means

### Code Signing (✅ Working)
- App is signed with Developer ID certificate
- Signature can be verified with `codesign`
- App will run on your Mac without issues

### Notarization (⚠️ Disabled)
- App has not been approved by Apple's notarization service
- Users may see a warning on first launch: "Float Browser cannot be verified"
- Users can still open the app by right-clicking and selecting "Open"

## Why Notarization Failed

Apple rejected the app with status "Invalid". Common causes:

1. **Entitlements Issues**
   - Missing or incorrect entitlements
   - Entitlements not matching app capabilities

2. **Code Signing Issues**
   - Unsigned or incorrectly signed components
   - Mixed signatures (some parts signed, others not)

3. **Bundle Structure Issues**
   - Invalid Info.plist
   - Missing required files
   - Incorrect bundle identifiers

4. **Hardened Runtime Issues**
   - Missing runtime exceptions
   - Incompatible runtime settings

## Getting Detailed Error Information

To see why Apple rejected the notarization:

```bash
# Get the submission ID from the error message
# In your case: 2cbfaf28-4be4-4e37-bce2-5d556db49810

xcrun notarytool log 2cbfaf28-4be4-4e37-bce2-5d556db49810 \
  --apple-id appdev@technocoreint.com \
  --password ainr-bjjo-gpov-ljqt \
  --team-id 22AZDZ6WBU
```

This will download a JSON file with detailed error information about what Apple found wrong with the app.

## Building Without Notarization

The default build now skips notarization:

```bash
npm run buildMacDMGUniversal
```

This creates a code-signed DMG that:
- ✅ Is signed with your Developer ID
- ✅ Works on your Mac
- ✅ Can be distributed
- ⚠️ Shows a warning on first launch for other users

## Enabling Notarization for Testing

To test notarization again after fixing issues:

1. Add to your `.env` file:
   ```bash
   ENABLE_NOTARIZATION=true
   ```

2. Build:
   ```bash
   npm run buildMacDMGUniversal
   ```

3. Wait 5-15 minutes for Apple's response

4. If it fails, get the log:
   ```bash
   xcrun notarytool log <submission-id> \
     --apple-id appdev@technocoreint.com \
     --password ainr-bjjo-gpov-ljqt \
     --team-id 22AZDZ6WBU
   ```

## Common Fixes

### Fix 1: Update Entitlements

The current entitlements in `resources/entitlements.mac.plist` may be too permissive. Try a minimal set:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
  </dict>
</plist>
```

### Fix 2: Verify All Components Are Signed

```bash
codesign --verify --deep --strict --verbose=2 "dist/app/mac-universal/Float Browser.app"
```

If this fails, some components aren't signed correctly.

### Fix 3: Check for Unsigned Frameworks

```bash
find "dist/app/mac-universal/Float Browser.app" -name "*.dylib" -o -name "*.framework" | while read file; do
  echo "Checking: $file"
  codesign -dv "$file" 2>&1 | grep -q "Signature" || echo "  ⚠️  NOT SIGNED"
done
```

### Fix 4: Verify Bundle Identifier

Check that the bundle ID matches the appId in the build config:

```bash
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" \
  "dist/app/mac-universal/Float Browser.app/Contents/Info.plist"
```

Should output: `com.floatbrowser.app`

### Fix 5: Check Electron Fuses

The app uses Electron fuses. Verify they're set correctly:

```bash
npx @electron/fuses read --app "dist/app/mac-universal/Float Browser.app"
```

## Workaround for Users

Until notarization is working, users can install the app by:

1. Download and open the DMG
2. Drag Float Browser to Applications
3. Right-click Float Browser in Applications
4. Select "Open"
5. Click "Open" in the security dialog

After the first launch, the app will open normally.

## Alternative: Staple a Notarization Ticket Manually

If you can get the app notarized through another method:

```bash
# After successful notarization
xcrun stapler staple "dist/app/mac-universal/Float Browser.app"

# Verify stapling
xcrun stapler validate "dist/app/mac-universal/Float Browser.app"

# Rebuild DMG with stapled app
# (You'll need to manually create the DMG)
```

## Testing Gatekeeper

Test how macOS Gatekeeper will treat your app:

```bash
# Check if app will be allowed
spctl --assess --verbose=4 --type execute "dist/app/mac-universal/Float Browser.app"

# For DMG
spctl --assess --verbose=4 --type install "dist/app/Float Browser-2.0.0-universal.dmg"
```

Expected output without notarization:
```
accepted
source=Developer ID
```

Expected output with notarization:
```
accepted
source=Notarized Developer ID
```

## Next Steps

1. **Get detailed error log** from Apple using the submission ID
2. **Review the errors** and identify specific issues
3. **Fix the issues** (usually entitlements or signing)
4. **Test notarization** again with `ENABLE_NOTARIZATION=true`
5. **Repeat** until Apple accepts the submission

## Resources

- [CODE_SIGNING_GUIDE.md](CODE_SIGNING_GUIDE.md) - Complete guide to code signing and notarization
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Resolving Common Notarization Issues](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues)
- [Electron Code Signing](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- [electron-builder Notarization](https://www.electron.build/configuration/mac#notarization)

## Testing

Run the test scripts to verify your configuration:

```bash
# Test code signing
npm run testSigning

# Test notarization
npm run testNotarization
```

## Support

For help with notarization:
1. Run `npm run testNotarization` to check your configuration
2. Get the detailed error log from Apple
3. Review the specific errors
4. See [CODE_SIGNING_GUIDE.md](CODE_SIGNING_GUIDE.md) for detailed troubleshooting
5. Search for similar issues in electron-builder GitHub issues
6. Check Electron documentation for code signing requirements

---

**Current Build Status**: Code-signed ✅ | Notarized ❌ (disabled by default)
**Workaround**: Users can right-click and select "Open" on first launch
**To Enable**: Add `ENABLE_NOTARIZATION=true` to `.env` file
**Next Action**: Get detailed error log from Apple to diagnose the issue
