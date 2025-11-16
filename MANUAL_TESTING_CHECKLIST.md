# Float Browser v2.0 - Quick Testing Checklist

Use this checklist for quick verification of all Float features.

## Pre-Flight Check
- [ ] Build completed successfully: `npm run build`
- [ ] Application launches without errors
- [ ] No console errors on startup

---

## Feature Tests (Task 20.1)

### Opacity Control
- [ ] Opacity slider visible in toolbar
- [ ] Slider range: 30% to 100%
- [ ] Percentage display updates correctly
- [ ] Window transparency changes smoothly
- [ ] Opacity persists after restart

### Always-On-Top
- [ ] Toggle button visible in toolbar
- [ ] Button shows active state when enabled
- [ ] Window stays on top of other apps
- [ ] Works across macOS Spaces
- [ ] Works with Mission Control
- [ ] State persists after restart

### PIP Mode
- [ ] Toggle button visible in toolbar
- [ ] Window resizes to 400x300 when enabled
- [ ] Window restores to previous size when disabled
- [ ] All browser features work in PIP mode
- [ ] Button shows active state when enabled

### Global Shortcuts
- [ ] Cmd+Shift+F toggles visibility from any app
- [ ] Cmd+Shift+A toggles always-on-top from any app
- [ ] Cmd+Shift+P toggles PIP mode from any app
- [ ] Shortcuts work when Float Browser is not focused

### Window Profiles
- [ ] Cmd+1 applies Small profile (400x300, 80%, on-top)
- [ ] Cmd+2 applies Medium profile (800x600, 90%, on-top)
- [ ] Cmd+3 applies Large profile (1200x800, 100%, not on-top)
- [ ] Profiles apply within 100ms

### Float Menu
- [ ] Float menu appears in menu bar
- [ ] "Always on Top" item works (shows checkbox)
- [ ] "Picture-in-Picture Mode" item works
- [ ] Opacity submenu has presets (100%, 90%, 80%, 70%, 50%)
- [ ] All opacity presets work
- [ ] Window Profiles submenu lists all profiles
- [ ] Profile menu items work
- [ ] Keyboard shortcuts shown in menu

### Settings Integration
- [ ] Float Browser section appears in settings
- [ ] Default Opacity slider works
- [ ] Default Always-on-Top checkbox works
- [ ] Settings persist after restart
- [ ] Settings UI matches Min's style

---

## Error Scenario Tests (Task 20.2)

### Corrupted Settings
- [ ] Browser starts with corrupted settings file
- [ ] Default settings applied automatically
- [ ] No crash or error dialog
- [ ] User notified about reset (if implemented)

### Invalid Values
- [ ] Invalid opacity values rejected
- [ ] Invalid window bounds handled
- [ ] Browser uses safe defaults
- [ ] No crashes from invalid data

### Registration Failures
- [ ] Browser starts if shortcuts already registered
- [ ] Error logged (not shown to user)
- [ ] Other shortcuts still work
- [ ] No crash

### Window Management Failures
- [ ] Operations on minimized window handled
- [ ] Errors logged appropriately
- [ ] User notified if operation fails
- [ ] Features work after window restored

### Performance Under Stress
- [ ] Rapid opacity changes don't cause artifacts
- [ ] No flickering or stuttering
- [ ] Browser remains responsive
- [ ] No memory leaks

---

## Compatibility Tests

### Multi-Monitor
- [ ] Always-on-top works on all monitors
- [ ] Window can be moved between monitors
- [ ] All features work on all monitors

### macOS Integration
- [ ] Works with Spaces
- [ ] Works with Mission Control
- [ ] Works with fullscreen apps
- [ ] No Gatekeeper warnings (if signed)

### Min Browser Features
- [ ] Tab management works
- [ ] Bookmarks work
- [ ] History works
- [ ] Address bar works
- [ ] Reader mode works
- [ ] Download manager works
- [ ] All Min shortcuts work (no conflicts)

---

## Performance Verification

- [ ] Opacity changes < 50ms
- [ ] Profile changes < 100ms
- [ ] Memory usage < 10% increase vs Min
- [ ] Startup time < 500ms increase vs Min
- [ ] Frame rate > 30fps at all opacity levels

---

## Final Checks

- [ ] No console errors during testing
- [ ] No crashes or freezes
- [ ] All UI elements properly styled
- [ ] All tooltips show correct shortcuts
- [ ] Documentation matches actual behavior

---

## Test Environment

**Date**: _______________  
**Build**: _______________  
**macOS**: _______________  
**Hardware**: _______________  

**Result**: PASS / FAIL

**Critical Issues**: _______________________________________________

**Notes**: _______________________________________________
