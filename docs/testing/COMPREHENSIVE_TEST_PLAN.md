---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](../developer/README.md)** | **[🚀 Release](../release/README.md)**

---

# Float Browser v2.0 - Comprehensive Test Plan

## Test Environment Setup

### Required Test Configurations

- [ ] macOS 10.13 High Sierra (if available)
- [ ] macOS 11 Big Sur
- [ ] macOS 12 Monterey
- [ ] macOS 13 Ventura
- [ ] macOS 14 Sonoma
- [ ] Intel Mac (x64)
- [ ] Apple Silicon Mac (ARM64)
- [ ] Single monitor setup
- [ ] Dual monitor setup
- [ ] External display with different DPI

---

## Float Features - End-to-End Testing

### 1. Opacity Control

**Test Case 1.1: Opacity Slider Functionality**
- [ ] Open Float Browser
- [ ] Locate opacity slider in toolbar
- [ ] Move slider from 100% to 30%
- [ ] Verify window becomes progressively more transparent
- [ ] Verify percentage display updates correctly
- [ ] Verify content behind browser is visible at low opacity

**Test Case 1.2: Opacity Persistence**
- [ ] Set opacity to 75%
- [ ] Quit Float Browser
- [ ] Relaunch Float Browser
- [ ] Verify opacity is still 75%

**Test Case 1.3: Opacity Performance**
- [ ] Move opacity slider rapidly
- [ ] Verify smooth transitions without lag
- [ ] Verify no visual artifacts or flickering
- [ ] Verify changes apply within 50ms

**Test Case 1.4: Opacity via Menu**
- [ ] Open Float menu
- [ ] Select Opacity > 80%
- [ ] Verify opacity changes to 80%
- [ ] Verify slider updates to match

---

### 2. Always-On-Top

**Test Case 2.1: Always-On-Top Toggle**
- [ ] Click always-on-top button in toolbar
- [ ] Verify button shows active state
- [ ] Open another application (Finder, Safari, etc.)
- [ ] Verify Float Browser stays on top
- [ ] Click button again to disable
- [ ] Verify Float Browser can be covered by other windows

**Test Case 2.2: Always-On-Top Across Spaces**
- [ ] Enable always-on-top
- [ ] Create a new Space (Mission Control)
- [ ] Switch to new Space
- [ ] Verify Float Browser appears in new Space
- [ ] Open another app in new Space
- [ ] Verify Float Browser stays on top

**Test Case 2.3: Always-On-Top with Fullscreen Apps**
- [ ] Enable always-on-top
- [ ] Open another app in fullscreen mode
- [ ] Verify Float Browser appears over fullscreen app
- [ ] Verify Float Browser remains functional

**Test Case 2.4: Always-On-Top Persistence**
- [ ] Enable always-on-top
- [ ] Quit and relaunch Float Browser
- [ ] Verify always-on-top is still enabled

**Test Case 2.5: Always-On-Top via Menu**
- [ ] Open Float menu
- [ ] Click "Always on Top"
- [ ] Verify checkbox appears
- [ ] Verify always-on-top is enabled

**Test Case 2.6: Always-On-Top via Shortcut**
- [ ] Press Cmd+Shift+A
- [ ] Verify always-on-top toggles
- [ ] Press Cmd+Shift+A again
- [ ] Verify always-on-top toggles back

---

### 3. Picture-in-Picture Mode

**Test Case 3.1: PIP Mode Activation**
- [ ] Note current window size
- [ ] Click PIP button in toolbar
- [ ] Verify window resizes to 400x300
- [ ] Verify button shows active state
- [ ] Verify all UI elements are visible

**Test Case 3.2: PIP Mode Deactivation**
- [ ] Enable PIP mode
- [ ] Click PIP button again
- [ ] Verify window restores to previous size
- [ ] Verify button shows inactive state

**Test Case 3.3: PIP Mode Functionality**
- [ ] Enable PIP mode
- [ ] Navigate to a website
- [ ] Verify web content displays correctly
- [ ] Verify scrolling works
- [ ] Verify all browser features work

**Test Case 3.4: PIP Mode via Menu**
- [ ] Open Float menu
- [ ] Click "Picture-in-Picture Mode"
- [ ] Verify PIP mode activates

**Test Case 3.5: PIP Mode via Shortcut**
- [ ] Press Cmd+Shift+P
- [ ] Verify PIP mode toggles
- [ ] Press Cmd+Shift+P again
- [ ] Verify PIP mode toggles back

---

### 4. Window Profiles

**Test Case 4.1: Apply Small Profile**
- [ ] Open Float menu > Window Profiles > Small
- [ ] Verify window resizes to 400x300
- [ ] Verify opacity changes to 80%
- [ ] Verify always-on-top is enabled

**Test Case 4.2: Apply Medium Profile**
- [ ] Open Float menu > Window Profiles > Medium
- [ ] Verify window resizes to 800x600
- [ ] Verify opacity changes to 90%
- [ ] Verify always-on-top is enabled

**Test Case 4.3: Apply Large Profile**
- [ ] Open Float menu > Window Profiles > Large
- [ ] Verify window resizes to 1200x800
- [ ] Verify opacity changes to 100%
- [ ] Verify always-on-top is disabled

**Test Case 4.4: Profile Shortcuts**
- [ ] Press Cmd+1
- [ ] Verify Small profile applies
- [ ] Press Cmd+2
- [ ] Verify Medium profile applies
- [ ] Press Cmd+3
- [ ] Verify Large profile applies

---

### 5. Global Shortcuts

**Test Case 5.1: Toggle Visibility Shortcut**
- [ ] Focus another application
- [ ] Press Cmd+Shift+F
- [ ] Verify Float Browser hides
- [ ] Press Cmd+Shift+F again
- [ ] Verify Float Browser shows

**Test Case 5.2: Shortcuts from Other Apps**
- [ ] Open Safari or another app
- [ ] Press Cmd+Shift+A
- [ ] Verify Float Browser always-on-top toggles
- [ ] Press Cmd+Shift+P
- [ ] Verify Float Browser PIP mode toggles

---

### 6. Settings Integration

**Test Case 6.1: Float Settings Section**
- [ ] Open Settings (Cmd+,)
- [ ] Locate "Float Browser" section
- [ ] Verify all Float settings are present
- [ ] Verify visual consistency with Min settings

**Test Case 6.2: Default Opacity Setting**
- [ ] Open Settings
- [ ] Change "Default Opacity" to 85%
- [ ] Close and relaunch Float Browser
- [ ] Verify new window starts at 85% opacity

**Test Case 6.3: Default Always-On-Top Setting**
- [ ] Open Settings
- [ ] Enable "Start Always-on-Top"
- [ ] Close and relaunch Float Browser
- [ ] Verify always-on-top is enabled on startup

---

## Min Features - Regression Testing

### 7. Tab Management

**Test Case 7.1: Create New Tab**
- [ ] Click "+" button or press Cmd+T
- [ ] Verify new tab is created
- [ ] Verify tab appears in tab bar

**Test Case 7.2: Switch Between Tabs**
- [ ] Create multiple tabs
- [ ] Click on different tabs
- [ ] Verify active tab switches correctly
- [ ] Use Cmd+1, Cmd+2, etc. to switch
- [ ] Verify keyboard shortcuts work

**Test Case 7.3: Close Tabs**
- [ ] Click X on a tab
- [ ] Verify tab closes
- [ ] Press Cmd+W
- [ ] Verify tab closes

**Test Case 7.4: Reorder Tabs**
- [ ] Drag a tab to a new position
- [ ] Verify tab moves correctly
- [ ] Verify tab order persists

---

### 8. Navigation

**Test Case 8.1: Navigate via Address Bar**
- [ ] Type "example.com" in address bar
- [ ] Press Enter
- [ ] Verify page loads
- [ ] Verify URL updates

**Test Case 8.2: Back/Forward Navigation**
- [ ] Navigate to multiple pages
- [ ] Click back button
- [ ] Verify previous page loads
- [ ] Click forward button
- [ ] Verify next page loads

**Test Case 8.3: Reload Page**
- [ ] Navigate to a page
- [ ] Click reload button or press Cmd+R
- [ ] Verify page reloads

---

### 9. Bookmarks

**Test Case 9.1: Create Bookmark**
- [ ] Navigate to a page
- [ ] Click bookmark star
- [ ] Verify bookmark is saved
- [ ] Verify star shows filled state

**Test Case 9.2: Access Bookmarks**
- [ ] Type in address bar
- [ ] Verify bookmarks appear in suggestions
- [ ] Click a bookmark
- [ ] Verify page loads

**Test Case 9.3: Manage Bookmarks**
- [ ] Open bookmark manager
- [ ] Create folders
- [ ] Move bookmarks
- [ ] Delete bookmarks
- [ ] Verify all operations work

---

### 10. History

**Test Case 10.1: Browse History**
- [ ] Navigate to several pages
- [ ] Open history (Cmd+Y)
- [ ] Verify visited pages appear
- [ ] Click a history item
- [ ] Verify page loads

**Test Case 10.2: Search History**
- [ ] Type in address bar
- [ ] Verify history items appear in suggestions
- [ ] Verify full-text search works

---

### 11. Downloads

**Test Case 11.1: Download File**
- [ ] Click a download link
- [ ] Verify download starts
- [ ] Verify download appears in download manager
- [ ] Verify download completes

---

### 12. Reader View

**Test Case 12.1: Activate Reader View**
- [ ] Navigate to an article
- [ ] Click reader view button (if available)
- [ ] Verify reader view activates
- [ ] Verify content is readable

---

### 13. Privacy Features

**Test Case 13.1: Content Blocking**
- [ ] Navigate to a site with ads
- [ ] Verify ads are blocked
- [ ] Verify content blocking toggle works

**Test Case 13.2: Private Browsing**
- [ ] Verify private browsing features work
- [ ] Verify history is not saved in private mode

---

### 14. Task System

**Test Case 14.1: Create Task**
- [ ] Open task overlay (Cmd+Shift+E)
- [ ] Create a new task
- [ ] Verify task is created

**Test Case 14.2: Switch Tasks**
- [ ] Create multiple tasks
- [ ] Switch between tasks
- [ ] Verify tabs switch correctly

---

## Performance Testing

### 15. Opacity Performance

**Test Case 15.1: Opacity Change Speed**
- [ ] Use a timer or profiler
- [ ] Change opacity via slider
- [ ] Verify change occurs within 50ms
- [ ] Repeat 10 times
- [ ] Verify consistent performance

**Test Case 15.2: Rapid Opacity Changes**
- [ ] Move slider rapidly back and forth
- [ ] Verify no lag or stuttering
- [ ] Verify no visual artifacts

---

### 16. Memory Usage

**Test Case 16.1: Baseline Memory**
- [ ] Launch Float Browser
- [ ] Open Activity Monitor
- [ ] Note memory usage
- [ ] Compare to Min Browser baseline
- [ ] Verify increase is less than 10%

**Test Case 16.2: Memory with Float Features**
- [ ] Enable all Float features
- [ ] Change opacity multiple times
- [ ] Toggle always-on-top multiple times
- [ ] Toggle PIP mode multiple times
- [ ] Verify memory doesn't leak

---

### 17. Startup Time

**Test Case 17.1: Cold Start**
- [ ] Quit Float Browser completely
- [ ] Use a timer
- [ ] Launch Float Browser
- [ ] Measure time to window appearance
- [ ] Verify within 500ms of Min baseline

**Test Case 17.2: Warm Start**
- [ ] Launch Float Browser
- [ ] Quit and immediately relaunch
- [ ] Measure startup time
- [ ] Verify acceptable performance

---

## Compatibility Testing

### 18. Multiple Monitors

**Test Case 18.1: Move Between Monitors**
- [ ] Connect external display
- [ ] Move Float Browser to external display
- [ ] Verify all features work
- [ ] Verify opacity works on external display
- [ ] Verify always-on-top works

**Test Case 18.2: Different DPI Displays**
- [ ] Use Retina and non-Retina displays
- [ ] Move window between displays
- [ ] Verify UI scales correctly
- [ ] Verify no visual issues

---

### 19. macOS Spaces

**Test Case 19.1: Float Across Spaces**
- [ ] Enable always-on-top
- [ ] Create multiple Spaces
- [ ] Switch between Spaces
- [ ] Verify Float Browser appears in all Spaces

**Test Case 19.2: Mission Control**
- [ ] Open Mission Control
- [ ] Verify Float Browser is visible
- [ ] Drag to different Space
- [ ] Verify window moves correctly

---

### 20. Architecture Compatibility

**Test Case 20.1: Intel Mac**
- [ ] Run on Intel Mac
- [ ] Verify all features work
- [ ] Verify performance is acceptable

**Test Case 20.2: Apple Silicon Mac**
- [ ] Run on Apple Silicon Mac
- [ ] Verify all features work
- [ ] Verify performance is acceptable
- [ ] Verify native ARM performance

---

## Error Handling

### 21. Corrupted Settings

**Test Case 21.1: Invalid Settings File**
- [ ] Manually corrupt settings file
- [ ] Launch Float Browser
- [ ] Verify defaults are restored
- [ ] Verify notification is shown

---

### 22. Window Management Failures

**Test Case 22.1: Opacity Failure**
- [ ] Simulate opacity failure (if possible)
- [ ] Verify error is logged
- [ ] Verify browser continues to function

**Test Case 22.2: Always-On-Top Failure**
- [ ] Simulate always-on-top failure (if possible)
- [ ] Verify error notification
- [ ] Verify browser continues to function

---

## Test Results Summary

### Float Features
- [ ] All opacity tests passed
- [ ] All always-on-top tests passed
- [ ] All PIP mode tests passed
- [ ] All window profile tests passed
- [ ] All global shortcut tests passed
- [ ] All settings tests passed

### Min Features (No Regressions)
- [ ] All tab management tests passed
- [ ] All navigation tests passed
- [ ] All bookmark tests passed
- [ ] All history tests passed
- [ ] All download tests passed
- [ ] All reader view tests passed
- [ ] All privacy tests passed
- [ ] All task system tests passed

### Performance
- [ ] Opacity changes < 50ms
- [ ] Memory increase < 10%
- [ ] Startup time increase < 500ms

### Compatibility
- [ ] Works on multiple macOS versions
- [ ] Works on Intel and Apple Silicon
- [ ] Works with multiple monitors
- [ ] Works with Spaces and Mission Control

### Critical Issues Found
- [ ] None (or list issues)

---

## Sign-Off

- [ ] All tests completed
- [ ] All critical bugs fixed
- [ ] Performance meets requirements
- [ ] Ready for release

**Tester**: _______________  
**Date**: _______________  
**Build Version**: _______________
