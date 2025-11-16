# Float Browser v2.0 - Manual Testing Guide

## Overview

This guide provides step-by-step instructions for manually testing all Float Browser features. Follow each test case in order and document any issues found.

---

## Prerequisites

1. Build Float Browser: `npm run build`
2. Start the application: `npm run start`
3. Have multiple applications open for testing always-on-top behavior
4. Have multiple macOS Spaces configured (for testing across spaces)
5. Have a second monitor connected (optional, for multi-monitor testing)

---

## Test 20.1: Feature Testing

### Test 1: Opacity Slider (Requirement 2.1)

**Objective**: Verify opacity slider works correctly from 30% to 100%

**Steps**:
1. Launch Float Browser
2. Locate the opacity slider in the toolbar
3. Move slider to 100% - window should be fully opaque
4. Move slider to 50% - window should be semi-transparent
5. Move slider to 30% - window should be highly transparent
6. Verify percentage display updates as you move the slider
7. Open another application behind Float Browser
8. Verify you can see the application through Float Browser at lower opacity levels

**Expected Results**:
- ✓ Slider moves smoothly without lag
- ✓ Opacity changes apply within 50ms (should feel instant)
- ✓ Percentage display shows correct value (30-100%)
- ✓ Window transparency matches slider position
- ✓ Content behind browser is visible at lower opacity levels

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 2: Opacity Persistence (Requirement 2.5)

**Objective**: Verify opacity setting persists across restarts

**Steps**:
1. Set opacity to 75%
2. Quit Float Browser (Cmd+Q)
3. Relaunch Float Browser
4. Check opacity slider position and window transparency

**Expected Results**:
- ✓ Opacity slider shows 75%
- ✓ Window has 75% opacity
- ✓ Setting was restored from saved state

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 3: Always-On-Top Toggle (Requirement 3.2)

**Objective**: Verify always-on-top button works correctly

**Steps**:
1. Click the always-on-top button (pin icon) in toolbar
2. Open another application (e.g., Finder, Safari)
3. Click on the other application
4. Verify Float Browser stays on top
5. Click the always-on-top button again to disable
6. Click on the other application
7. Verify Float Browser goes behind the other application

**Expected Results**:
- ✓ Button shows active state when enabled (highlighted/different color)
- ✓ Browser stays on top of all other windows when enabled
- ✓ Browser behaves normally when disabled
- ✓ Tooltip shows "Always on Top (Cmd+Shift+A)"

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 4: Always-On-Top Across Spaces (Requirement 3.3)

**Objective**: Verify always-on-top works across macOS Spaces

**Steps**:
1. Enable always-on-top in Float Browser
2. Open Mission Control (F3 or swipe up with 3 fingers)
3. Switch to a different Space
4. Open an application in that Space
5. Verify Float Browser is still visible and on top

**Expected Results**:
- ✓ Float Browser remains visible across all Spaces
- ✓ Float Browser stays on top in all Spaces
- ✓ No flickering or disappearing when switching Spaces

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 5: Always-On-Top Persistence (Requirement 3.5)

**Objective**: Verify always-on-top state persists across restarts

**Steps**:
1. Enable always-on-top
2. Quit Float Browser (Cmd+Q)
3. Relaunch Float Browser
4. Open another application
5. Verify Float Browser stays on top

**Expected Results**:
- ✓ Always-on-top button shows active state
- ✓ Browser stays on top of other windows
- ✓ Setting was restored from saved state

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 6: PIP Mode Toggle (Requirement 4.2)

**Objective**: Verify PIP mode button works correctly

**Steps**:
1. Note current window size and position
2. Click the PIP mode button (compress icon) in toolbar
3. Verify window resizes to 400x300 pixels
4. Verify window is compact and usable
5. Click the PIP mode button again
6. Verify window restores to previous size and position

**Expected Results**:
- ✓ Window resizes to 400x300 when PIP enabled
- ✓ Window restores to original size when PIP disabled
- ✓ Button shows active state when PIP is enabled
- ✓ All browser functionality works in PIP mode
- ✓ Tooltip shows "Picture-in-Picture (Cmd+Shift+P)"

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 7: PIP Mode Functionality (Requirement 4.5)

**Objective**: Verify all browser features work in PIP mode

**Steps**:
1. Enable PIP mode
2. Navigate to a website
3. Open a new tab
4. Switch between tabs
5. Use the address bar
6. Adjust opacity slider
7. Toggle always-on-top

**Expected Results**:
- ✓ All UI controls are accessible
- ✓ Navigation works correctly
- ✓ Tabs work correctly
- ✓ All Float features work in PIP mode

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 8: Global Shortcut - Toggle Visibility (Requirement 5.1, 5.2)

**Objective**: Verify Cmd+Shift+F toggles window visibility from any app

**Steps**:
1. Float Browser is visible
2. Switch to another application (e.g., Finder)
3. Press Cmd+Shift+F
4. Verify Float Browser hides
5. Press Cmd+Shift+F again
6. Verify Float Browser shows and comes to front

**Expected Results**:
- ✓ Shortcut works from any application
- ✓ Window hides when visible
- ✓ Window shows when hidden
- ✓ Window comes to front when shown

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 9: Global Shortcut - Toggle Always-On-Top (Requirement 5.3)

**Objective**: Verify Cmd+Shift+A toggles always-on-top from any app

**Steps**:
1. Float Browser has always-on-top disabled
2. Switch to another application
3. Press Cmd+Shift+A
4. Switch back to Float Browser
5. Verify always-on-top button shows active state
6. Open another app and verify Float Browser stays on top
7. Press Cmd+Shift+A again from another app
8. Verify always-on-top is disabled

**Expected Results**:
- ✓ Shortcut works from any application
- ✓ Always-on-top toggles correctly
- ✓ UI button state updates correctly
- ✓ Behavior matches button state

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 10: Global Shortcut - Toggle PIP Mode (Requirement 5.4)

**Objective**: Verify Cmd+Shift+P toggles PIP mode from any app

**Steps**:
1. Float Browser is in normal mode
2. Switch to another application
3. Press Cmd+Shift+P
4. Switch back to Float Browser
5. Verify window is in PIP mode (400x300)
6. Press Cmd+Shift+P again from another app
7. Verify window restores to normal size

**Expected Results**:
- ✓ Shortcut works from any application
- ✓ PIP mode toggles correctly
- ✓ UI button state updates correctly
- ✓ Window size changes correctly

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 11: Window Profiles - Small (Requirement 6.1, 6.5)

**Objective**: Verify Small profile applies correctly

**Steps**:
1. Press Cmd+1 (or use Float menu > Window Profiles > Small)
2. Verify window resizes to 400x300
3. Verify opacity is set to 80%
4. Verify always-on-top is enabled

**Expected Results**:
- ✓ Window size: 400x300 pixels
- ✓ Opacity: 80%
- ✓ Always-on-top: enabled
- ✓ Changes apply within 100ms

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 12: Window Profiles - Medium (Requirement 6.1, 6.5)

**Objective**: Verify Medium profile applies correctly

**Steps**:
1. Press Cmd+2 (or use Float menu > Window Profiles > Medium)
2. Verify window resizes to 800x600
3. Verify opacity is set to 90%
4. Verify always-on-top is enabled

**Expected Results**:
- ✓ Window size: 800x600 pixels
- ✓ Opacity: 90%
- ✓ Always-on-top: enabled
- ✓ Changes apply within 100ms

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 13: Window Profiles - Large (Requirement 6.1, 6.5)

**Objective**: Verify Large profile applies correctly

**Steps**:
1. Press Cmd+3 (or use Float menu > Window Profiles > Large)
2. Verify window resizes to 1200x800
3. Verify opacity is set to 100%
4. Verify always-on-top is disabled

**Expected Results**:
- ✓ Window size: 1200x800 pixels
- ✓ Opacity: 100%
- ✓ Always-on-top: disabled
- ✓ Changes apply within 100ms

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 14: Float Menu - Always On Top (Requirement 8.1)

**Objective**: Verify Float menu always-on-top item works

**Steps**:
1. Open Float menu from menu bar
2. Click "Always on Top" menu item
3. Verify checkbox appears next to item
4. Verify always-on-top is enabled
5. Click "Always on Top" again
6. Verify checkbox disappears
7. Verify always-on-top is disabled

**Expected Results**:
- ✓ Menu item shows checkbox when enabled
- ✓ Menu item shows keyboard shortcut (Cmd+Shift+A)
- ✓ Clicking toggles always-on-top
- ✓ UI button state updates

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 15: Float Menu - PIP Mode (Requirement 8.1)

**Objective**: Verify Float menu PIP mode item works

**Steps**:
1. Open Float menu from menu bar
2. Click "Picture-in-Picture Mode"
3. Verify window enters PIP mode
4. Open Float menu again
5. Click "Picture-in-Picture Mode"
6. Verify window exits PIP mode

**Expected Results**:
- ✓ Menu item shows keyboard shortcut (Cmd+Shift+P)
- ✓ Clicking toggles PIP mode
- ✓ UI button state updates

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 16: Float Menu - Opacity Presets (Requirement 8.2)

**Objective**: Verify Float menu opacity presets work

**Steps**:
1. Open Float menu > Opacity
2. Click "100%"
3. Verify opacity is set to 100%
4. Open Float menu > Opacity
5. Click "50%"
6. Verify opacity is set to 50%
7. Test other presets (90%, 80%, 70%)

**Expected Results**:
- ✓ All opacity presets are available
- ✓ Clicking preset changes opacity
- ✓ Opacity slider updates to match
- ✓ Window transparency changes

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 17: Float Menu - Window Profiles (Requirement 8.5)

**Objective**: Verify Float menu window profiles work

**Steps**:
1. Open Float menu > Window Profiles
2. Verify Small, Medium, Large profiles are listed
3. Click "Small"
4. Verify Small profile is applied
5. Open Float menu > Window Profiles
6. Click "Medium"
7. Verify Medium profile is applied

**Expected Results**:
- ✓ All profiles are listed
- ✓ Profiles show keyboard shortcuts (Cmd+1/2/3)
- ✓ Clicking profile applies it
- ✓ Window changes match profile settings

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 18: Settings - Default Opacity (Requirement 9.2)

**Objective**: Verify default opacity setting works

**Steps**:
1. Open Settings (Cmd+,)
2. Navigate to Float Browser section
3. Set "Default Opacity" to 80%
4. Quit and relaunch Float Browser
5. Verify opacity is 80% on startup

**Expected Results**:
- ✓ Setting is visible in Float Browser section
- ✓ Slider works correctly
- ✓ Value persists across restarts
- ✓ New windows use default opacity

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 19: Settings - Default Always-On-Top (Requirement 9.3)

**Objective**: Verify default always-on-top setting works

**Steps**:
1. Open Settings (Cmd+,)
2. Navigate to Float Browser section
3. Enable "Start Always-on-Top"
4. Quit and relaunch Float Browser
5. Verify always-on-top is enabled on startup

**Expected Results**:
- ✓ Setting is visible in Float Browser section
- ✓ Checkbox works correctly
- ✓ Value persists across restarts
- ✓ New windows use default always-on-top state

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

## Test 20.2: Error Scenario Testing

### Test 20: Corrupted Settings (Requirement 12.5)

**Objective**: Verify browser handles corrupted settings gracefully

**Steps**:
1. Quit Float Browser
2. Locate settings file: `~/Library/Application Support/float-browser/settings.json`
3. Open in text editor and corrupt the JSON (e.g., remove closing brace)
4. Save and close
5. Launch Float Browser
6. Verify browser starts with default settings
7. Verify notification about reset settings (if implemented)

**Expected Results**:
- ✓ Browser starts successfully
- ✓ Default settings are applied
- ✓ No crash or error dialog
- ✓ User is notified about reset (optional)

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 21: Invalid Opacity Values (Requirement 12.2)

**Objective**: Verify browser handles invalid opacity values

**Steps**:
1. Quit Float Browser
2. Open settings file
3. Set opacity to invalid value (e.g., 1.5 or -0.5)
4. Save and close
5. Launch Float Browser
6. Verify opacity is set to valid default (0.95)

**Expected Results**:
- ✓ Browser starts successfully
- ✓ Invalid value is rejected
- ✓ Valid default value is used
- ✓ No crash or error

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 22: Shortcut Registration Failure (Requirement 5.5)

**Objective**: Verify browser handles shortcut registration failures

**Steps**:
1. Install another app that uses Cmd+Shift+F
2. Launch that app first
3. Launch Float Browser
4. Verify Float Browser starts successfully
5. Check console logs for shortcut registration errors
6. Verify other shortcuts still work

**Expected Results**:
- ✓ Browser starts successfully
- ✓ Error is logged (not shown to user)
- ✓ Other shortcuts work
- ✓ No crash

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 23: Window Management Failure (Requirement 12.1, 12.3)

**Objective**: Verify browser handles window management failures gracefully

**Steps**:
1. Try to set opacity while window is minimized
2. Try to enable always-on-top while window is minimized
3. Try to enter PIP mode while window is minimized
4. Verify browser doesn't crash
5. Restore window and verify features work

**Expected Results**:
- ✓ No crashes occur
- ✓ Errors are logged
- ✓ User is notified if operation fails
- ✓ Features work after window is restored

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 24: Extreme Opacity Changes (Requirement 10.5)

**Objective**: Verify rapid opacity changes don't cause visual artifacts

**Steps**:
1. Rapidly move opacity slider back and forth
2. Observe window for flickering or artifacts
3. Verify opacity changes smoothly
4. Verify no performance degradation

**Expected Results**:
- ✓ No flickering or visual artifacts
- ✓ Smooth opacity transitions
- ✓ No lag or stuttering
- ✓ Browser remains responsive

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

## Additional Testing

### Test 25: Multi-Monitor Support (Requirement 11.3)

**Objective**: Verify Float features work across multiple monitors

**Prerequisites**: Two or more monitors connected

**Steps**:
1. Enable always-on-top
2. Move Float Browser to second monitor
3. Open another app on second monitor
4. Verify Float Browser stays on top
5. Move Float Browser back to first monitor
6. Verify always-on-top still works

**Expected Results**:
- ✓ Always-on-top works on all monitors
- ✓ Window can be moved between monitors
- ✓ All Float features work on all monitors

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 26: Fullscreen App Interaction (Requirement 11.5)

**Objective**: Verify always-on-top works with fullscreen apps

**Steps**:
1. Enable always-on-top in Float Browser
2. Open another app (e.g., Safari)
3. Make that app fullscreen (Cmd+Ctrl+F)
4. Verify Float Browser behavior

**Expected Results**:
- ✓ Float Browser stays visible (or behavior is documented)
- ✓ No crashes or errors
- ✓ User can access Float Browser

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

### Test 27: Min Browser Feature Preservation (Requirement 13.1-13.5)

**Objective**: Verify all Min Browser features still work

**Steps**:
1. Test tab management (create, close, switch tabs)
2. Test bookmarks (create, edit, delete)
3. Test history (view, search)
4. Test address bar (navigation, search, autocomplete)
5. Test Min's keyboard shortcuts
6. Test reader mode
7. Test download manager
8. Test settings

**Expected Results**:
- ✓ All Min features work correctly
- ✓ No regressions introduced
- ✓ No keyboard shortcut conflicts
- ✓ UI remains consistent

**Pass/Fail**: ___________

**Notes**: ___________________________________________

---

## Test Summary

**Total Tests**: 27  
**Passed**: _____  
**Failed**: _____  
**Blocked**: _____  

**Critical Issues Found**: _____________________________________

**Non-Critical Issues Found**: _____________________________________

**Overall Assessment**: _____________________________________

---

## Sign-Off

**Tester Name**: _____________________  
**Date**: _____________________  
**Build Version**: _____________________  
**macOS Version**: _____________________  
**Hardware**: _____________________  

**Ready for Release**: YES / NO

**Notes**: _____________________________________
