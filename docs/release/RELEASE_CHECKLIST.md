---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)**

---

# Float Browser v2.0.0 - Release Checklist

## Release Information

**Version**: 2.0.0  
**Release Date**: November 16, 2025  
**Build Type**: Universal Binary (Intel + Apple Silicon)  
**Package Format**: DMG  
**Distribution Type**: Beta / Production

---

## Pre-Release Checklist

### Code Quality

- [x] All code follows StandardJS style
- [x] No linting errors
- [x] All Float modules implemented
- [x] All Min Browser features preserved
- [x] Code is well-documented
- [x] FLOAT_MODIFICATIONS.md is up to date

### Testing

- [x] Unit tests pass (floatWindowManager, floatSettings, floatProfiles)
- [x] Integration tests pass (Min features, UI integration, performance, compatibility)
- [x] Manual testing complete (all Float features)
- [x] No critical bugs
- [x] Performance requirements met (<10% overhead)
- [x] Memory usage acceptable

### Documentation

- [x] README.md updated with Float Browser info
- [x] USER_GUIDE.md complete
- [x] SHORTCUTS.md complete
- [x] TROUBLESHOOTING.md complete
- [x] BUILD_GUIDE.md complete
- [x] CODE_SIGNING_GUIDE.md complete
- [x] FLOAT_ARCHITECTURE.md complete
- [x] MIN_UPDATE_GUIDE.md complete
- [x] RELEASE_NOTES.md complete

### Build Configuration

- [x] package.json updated (name, version, description)
- [x] Version number correct (2.0.0)
- [x] App ID correct (com.floatbrowser.app)
- [x] Product name correct (Float Browser)
- [x] Icon files present
- [x] Entitlements configured
- [x] Build scripts tested

---

## Build Checklist

### Pre-Build

- [x] Clean previous builds (`rm -rf dist/app`)
- [x] Install dependencies (`npm install`)
- [x] Run linter (`npm test`)
- [x] Build all components (`npm run build`)

### Build Process

- [x] Build universal DMG (`npm run buildMacDMGUniversal`)
- [x] Build completes without errors
- [x] DMG file created in dist/app/
- [x] File size reasonable (~200 MB)

### Post-Build Verification

- [x] DMG mounts successfully
- [x] App bundle structure correct
- [x] Universal binary confirmed (x86_64 + arm64)
- [x] Code signature present
- [x] All Float files included
- [x] App launches successfully
- [x] Version number correct

---

## Code Signing Checklist

### Certificate Setup

- [x] Apple Developer account active
- [ ] Developer ID Application certificate installed (⚠️ Currently using Development cert)
- [x] Certificate verified in Keychain
- [x] Team ID configured in .env

### Signing Configuration

- [x] Entitlements file present (resources/entitlements.mac.plist)
- [x] Hardened runtime enabled
- [x] Build script configured for signing
- [x] Test signing script passes (`npm run testSigning`)

### Signing Verification

- [x] App is signed (`codesign --verify`)
- [x] Signature is valid
- [x] Hardened runtime enabled
- [x] Entitlements applied
- [ ] Gatekeeper accepts (⚠️ Requires Developer ID cert)

---

## Notarization Checklist

### Credentials Setup

- [x] Apple ID configured in .env
- [x] App-specific password generated
- [x] Team ID configured
- [ ] ENABLE_NOTARIZATION set to true (⚠️ Currently disabled)

### Notarization Configuration

- [x] notarytool available
- [x] Credentials valid
- [x] Build script configured for notarization
- [x] Test notarization script available (`npm run testNotarization`)

### Notarization Verification

- [ ] App submitted to Apple (⚠️ Not notarized)
- [ ] Notarization successful
- [ ] Ticket stapled to app
- [ ] Gatekeeper accepts without warnings

---

## Installation Testing Checklist

### DMG Testing

- [x] DMG mounts on macOS
- [x] DMG contains app and Applications symlink
- [x] DMG window layout correct
- [x] DMG icon displays correctly

### Installation Testing

- [x] App can be dragged to Applications
- [x] App launches from Applications folder
- [x] App icon displays in Dock
- [x] App appears in Launchpad

### First Launch Testing

- [x] App launches successfully
- [x] Welcome screen appears (if first launch)
- [x] No crash on startup
- [x] All UI elements visible
- [ ] No Gatekeeper warnings (⚠️ Requires Developer ID + notarization)

### Feature Testing

- [x] Opacity slider works (30-100%)
- [x] Always-on-top toggle works
- [x] PIP mode toggle works
- [x] Global shortcuts work (Cmd+Shift+F, A, P)
- [x] Window profiles work (Cmd+1, 2, 3)
- [x] Float menu items work
- [x] Float settings work
- [x] All Min Browser features work

---

## Compatibility Testing Checklist

### Architecture Testing

- [x] Runs on Intel Macs (x86_64)
- [x] Runs on Apple Silicon Macs (arm64)
- [x] Universal binary verified

### macOS Version Testing

- [ ] macOS 10.13 High Sierra (if available)
- [ ] macOS 10.14 Mojave (if available)
- [ ] macOS 10.15 Catalina (if available)
- [ ] macOS 11 Big Sur (if available)
- [ ] macOS 12 Monterey (if available)
- [ ] macOS 13 Ventura (if available)
- [ ] macOS 14 Sonoma (if available)
- [x] macOS 15 Sequoia (current)

### Multi-Monitor Testing

- [ ] Works with multiple monitors
- [ ] Always-on-top works across monitors
- [ ] Window profiles work with different displays

### Spaces/Mission Control Testing

- [ ] Always-on-top works across Spaces
- [ ] Window persists in Mission Control
- [ ] Shortcuts work from any Space

---

## Documentation Checklist

### User Documentation

- [x] README.md
  - [x] Float Browser description
  - [x] Features overview
  - [x] Installation instructions
  - [x] Attribution to Min Browser
  - [x] License information

- [x] docs/USER_GUIDE.md
  - [x] Getting started
  - [x] Float features explained
  - [x] Screenshots/examples
  - [x] Tips and tricks

- [x] docs/SHORTCUTS.md
  - [x] All Float shortcuts
  - [x] All Min shortcuts
  - [x] Quick reference table

- [x] docs/TROUBLESHOOTING.md
  - [x] Common issues
  - [x] Solutions
  - [x] How to report bugs

### Developer Documentation

- [x] BUILD_GUIDE.md
  - [x] Build requirements
  - [x] Build instructions
  - [x] Platform-specific notes

- [x] CODE_SIGNING_GUIDE.md
  - [x] Certificate setup
  - [x] Signing process
  - [x] Notarization process
  - [x] Troubleshooting

- [x] FLOAT_ARCHITECTURE.md
  - [x] Architecture overview
  - [x] Module descriptions
  - [x] Integration points

- [x] FLOAT_MODIFICATIONS.md
  - [x] List of modified Min files
  - [x] List of new Float files
  - [x] Integration points

- [x] MIN_UPDATE_GUIDE.md
  - [x] How to pull Min updates
  - [x] Files to watch
  - [x] Merge strategy

### Release Documentation

- [x] RELEASE_NOTES.md
  - [x] Version number
  - [x] Release date
  - [x] New features
  - [x] Known issues
  - [x] System requirements

- [x] RELEASE_PACKAGE_STATUS.md
  - [x] Build status
  - [x] Signing status
  - [x] Distribution readiness

- [x] INSTALLATION_TEST_REPORT.md
  - [x] Test results
  - [x] Installation verification
  - [x] Feature verification

---

## Distribution Checklist

### Package Preparation

- [x] DMG file created
- [x] DMG file tested
- [x] File size acceptable
- [x] Filename correct (Float Browser-2.0.0-universal.dmg)

### Distribution Files

- [x] DMG file
- [x] README.md
- [x] RELEASE_NOTES.md
- [x] LICENSE.txt
- [ ] SHA256 checksum file (optional)
- [ ] GPG signature (optional)

### Distribution Platforms

- [ ] GitHub Release
  - [ ] Create release tag (v2.0.0)
  - [ ] Upload DMG
  - [ ] Add release notes
  - [ ] Mark as pre-release (if beta)

- [ ] Website
  - [ ] Upload DMG
  - [ ] Update download page
  - [ ] Add release announcement

- [ ] Social Media
  - [ ] Prepare announcement
  - [ ] Prepare screenshots
  - [ ] Prepare demo video (optional)

---

## Communication Checklist

### Release Announcement

- [ ] Write release announcement
- [ ] Include feature highlights
- [ ] Include screenshots
- [ ] Include download link
- [ ] Include installation instructions
- [ ] Include known issues

### User Communication

- [ ] Email to beta testers (if applicable)
- [ ] Post on website/blog
- [ ] Post on social media
- [ ] Update documentation site

### Developer Communication

- [ ] Update GitHub README
- [ ] Create GitHub release
- [ ] Update project status
- [ ] Thank contributors

---

## Post-Release Checklist

### Monitoring

- [ ] Monitor for crash reports
- [ ] Monitor for bug reports
- [ ] Monitor for user feedback
- [ ] Monitor download statistics

### Support

- [ ] Respond to user questions
- [ ] Triage bug reports
- [ ] Update documentation as needed
- [ ] Plan for next release

### Maintenance

- [ ] Create issue tracker for bugs
- [ ] Plan bug fix releases
- [ ] Plan feature updates
- [ ] Monitor Min Browser updates

---

## Release Types

### Beta Release (Current Status)

**Ready**: ✅ YES

Requirements:
- [x] Code complete
- [x] Testing complete
- [x] Documentation complete
- [x] Build created
- [x] Installation tested
- [x] Code-signed (Development cert acceptable)
- [ ] Notarized (not required for beta)

Distribution:
- Known users only
- Include Gatekeeper workaround instructions
- Collect feedback
- Iterate based on feedback

### Production Release

**Ready**: ⚠️ NEEDS DEVELOPER ID CERTIFICATE

Additional Requirements:
- [ ] Developer ID Application certificate
- [ ] Notarization enabled and successful
- [ ] Tested on multiple macOS versions
- [ ] Tested on clean systems
- [ ] No Gatekeeper warnings
- [ ] Public announcement prepared

Distribution:
- Public download
- GitHub release
- Website
- Social media announcement

---

## Current Status Summary

### ✅ Complete

- Code implementation
- Testing (unit, integration, manual)
- Documentation (user and developer)
- Build process
- Installation testing
- Beta release package

### ⚠️ Needs Attention for Production

- Developer ID Application certificate
- Notarization
- Multi-version macOS testing
- Public distribution setup

### 📋 Next Steps

**For Beta Release** (Ready Now):
1. Distribute DMG to beta testers
2. Include installation instructions with Gatekeeper workaround
3. Collect feedback
4. Fix any critical issues

**For Production Release** (1-2 days):
1. Obtain Developer ID Application certificate
2. Enable notarization (ENABLE_NOTARIZATION=true)
3. Rebuild with production signing
4. Test on multiple macOS versions
5. Verify no Gatekeeper warnings
6. Prepare public announcement
7. Distribute publicly

---

## Sign-Off

### Beta Release

- [x] Code complete
- [x] Testing complete
- [x] Documentation complete
- [x] Build complete
- [x] Installation tested
- [x] Ready for beta distribution

**Beta Release Status**: ✅ **APPROVED**

### Production Release

- [x] Code complete
- [x] Testing complete
- [x] Documentation complete
- [x] Build complete
- [x] Installation tested
- [ ] Developer ID certificate
- [ ] Notarization complete
- [ ] Multi-version testing

**Production Release Status**: ⚠️ **PENDING CERTIFICATE**

---

**Checklist Version**: 1.0  
**Last Updated**: November 16, 2025  
**Float Browser Version**: 2.0.0
