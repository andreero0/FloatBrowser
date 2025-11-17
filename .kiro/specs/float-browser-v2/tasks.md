# Float Browser v2.0 - Implementation Tasks

## Overview

Implementation plan for adding Float features to Min Browser at `/Users/aero/float-browser-min`.

**Approach**: Study Min's patterns → Create Float modules → Integrate seamlessly

---

## Phase 1: Setup & Analysis (Days 1-2)

- [x] 1. Analyze Min Browser codebase
  - Study `main/main.js` (main process structure)
  - Study `js/browserUI.js` (renderer UI structure)
  - Study `js/settings.js` (settings system)
  - Study `js/menuRenderer.js` (menu system)
  - Document Min's CSS classes and UI patterns
  - Identify integration points for Float features
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 2. Set up Float module structure
  - Create `js/float/` directory
  - Create `css/float/` directory
  - Create `FLOAT_MODIFICATIONS.md` to track changes
  - _Requirements: 16.1, 16.2_

- [x] 3. Update project branding
  - Update `package.json` (name: "float-browser", version: "2.0.0")
  - Update README with Float Browser description
  - _Requirements: 14.3_

---

## Phase 2: Core Window Management (Days 3-5)

- [x] 4. Implement FloatWindowManager
- [x] 4.1 Create `js/float/floatWindowManager.js`
  - Constructor accepting BrowserWindow instance
  - State tracking (opacity, alwaysOnTop, isPIP)
  - _Requirements: 2.1, 3.1, 4.1_

- [x] 4.2 Implement opacity methods
  - `setOpacity(value)` with validation (0.3-1.0)
  - `getOpacity()` to return current value
  - Error handling for failures
  - _Requirements: 2.2, 2.3, 12.2_

- [x] 4.3 Implement always-on-top methods
  - `setAlwaysOnTop(enabled)` using 'floating' level
  - `isAlwaysOnTop()` to return state
  - Error handling
  - _Requirements: 3.2, 3.3, 12.3_

- [x] 4.4 Implement PIP mode methods
  - `togglePIPMode()` to switch modes
  - `isPIPMode()` to return state
  - Save/restore bounds (PIP: 400x300)
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 4.5 Implement state persistence
  - `saveState()` to persist settings
  - `restoreState()` to load on startup
  - _Requirements: 2.5, 3.5, 12.4_

- [x] 5. Implement FloatSettings
- [x] 5.1 Create `js/float/floatSettings.js`
  - Settings schema (opacity, alwaysOnTop, profiles, shortcuts)
  - `get(key, defaultValue)` method
  - `set(key, value)` method
  - `save()` and `load()` methods
  - _Requirements: 2.5, 3.5, 9.1, 9.2, 9.3_

- [x] 5.2 Set default values
  - Default opacity: 0.95
  - Default alwaysOnTop: true
  - Default profiles (small, medium, large)
  - Default shortcuts
  - _Requirements: 9.2, 9.3, 6.1_

- [x] 5.3 Implement validation and error handling
  - Validate opacity (0.3-1.0)
  - Validate window bounds
  - Handle corrupted settings
  - `resetToDefaults()` method
  - _Requirements: 12.5_

- [x] 6. Integrate into Min's main process
- [x] 6.1 Modify `main/main.js` - imports
  - Import FloatWindowManager, FloatSettings
  - Initialize FloatSettings on startup
  - _Requirements: 16.2_

- [x] 6.2 Modify `main/main.js` - window creation
  - Add `transparent: true`
  - Add `backgroundColor: '#00000000'`
  - Load initial opacity from settings
  - Create FloatWindowManager instance
  - Call `floatManager.restoreState()`
  - _Requirements: 2.1, 2.5, 3.5_

- [x] 6.3 Add IPC handlers
  - `float:set-opacity`
  - `float:get-opacity`
  - `float:set-always-on-top`
  - `float:get-always-on-top`
  - `float:toggle-pip`
  - `float:get-pip-state`
  - _Requirements: 2.3, 3.2, 4.2_

- [x] 6.4 Add quit handler
  - Listen for 'before-quit'
  - Call `floatManager.saveState()`
  - _Requirements: 2.5, 3.5, 12.4_

---

## Phase 3: Float UI Controls (Days 6-8)

- [x] 7. Implement FloatControls
- [x] 7.1 Create `js/float/floatControls.js`
  - Study Min's navbar structure first
  - Constructor to initialize controls
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 7.2 Create opacity slider
  - Use Min's slider style (or create matching)
  - Add opacity value display
  - Position in navbar using Min's patterns
  - _Requirements: 2.1, 2.4, 7.1, 7.4_

- [x] 7.3 Create always-on-top button
  - Use Min's button CSS classes
  - Add pin icon
  - Add tooltip "Always on Top (Cmd+Shift+A)"
  - Add active state styling
  - _Requirements: 3.1, 3.4, 7.2, 7.4_

- [x] 7.4 Create PIP button
  - Use Min's button CSS classes
  - Add PIP icon
  - Add tooltip "Picture-in-Picture (Cmd+Shift+P)"
  - Add active state styling
  - _Requirements: 4.1, 7.3, 7.4_

- [x] 7.5 Implement event handlers
  - Opacity slider 'input' event → IPC call
  - Always-on-top button 'click' → IPC call
  - PIP button 'click' → IPC call
  - Update UI on state changes
  - _Requirements: 2.3, 3.2, 4.2_

- [x] 7.6 Implement state synchronization
  - Load initial state from main process
  - Update UI to reflect state
  - Listen for state changes
  - _Requirements: 2.5, 3.5_

- [x] 8. Create Float CSS
- [x] 8.1 Create `css/float/floatControls.css`
  - Study Min's CSS first
  - Style opacity slider to match Min
  - Style buttons to match Min
  - Proper spacing and alignment
  - _Requirements: 7.4, 7.5_

- [x] 8.2 Style button states
  - Hover effects matching Min
  - Active state matching Min
  - Focus states for accessibility
  - _Requirements: 7.4, 7.5_

- [x] 8.3 Responsive design
  - Test at different window sizes
  - Test in PIP mode (400x300)
  - _Requirements: 7.5_

- [x] 9. Integrate into Min's UI
- [x] 9.1 Modify `js/browserUI.js`
  - Import FloatControls
  - Initialize after Min's UI
  - _Requirements: 7.1, 7.2, 7.3, 16.2_

- [x] 9.2 Modify `pages/index.html`
  - Add link to `css/float/floatControls.css`
  - _Requirements: 7.4, 16.2_

- [x] 9.3 Test integration
  - Verify controls appear correctly
  - Verify visual consistency with Min
  - Verify responsiveness
  - _Requirements: 7.4, 7.5_

---

## Phase 4: Global Shortcuts (Days 9-10)

- [x] 10. Implement FloatShortcuts
- [x] 10.1 Create `js/float/floatShortcuts.js`
  - Constructor accepting FloatWindowManager
  - Load shortcuts from FloatSettings
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10.2 Implement registration
  - `registerShortcuts()` method
  - Register Cmd+Shift+F (toggle visibility)
  - Register Cmd+Shift+A (toggle always-on-top)
  - Register Cmd+Shift+P (toggle PIP)
  - Handle failures gracefully
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10.3 Implement handlers
  - Toggle visibility handler
  - Toggle always-on-top handler
  - Toggle PIP handler
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10.4 Implement cleanup
  - `unregisterShortcuts()` method
  - Call on app quit
  - _Requirements: 5.5_

- [x] 11. Integrate shortcuts
- [x] 11.1 Modify `main/main.js`
  - Import FloatShortcuts
  - Create instance after window creation
  - Call `registerShortcuts()` after app ready
  - _Requirements: 5.1, 16.2_

- [x] 11.2 Add quit cleanup
  - Listen for 'will-quit'
  - Call `unregisterShortcuts()`
  - _Requirements: 5.5_

---

## Phase 5: Window Profiles (Days 11-12)

- [x] 12. Implement FloatProfiles
- [x] 12.1 Create `js/float/floatProfiles.js`
  - Constructor accepting FloatWindowManager, FloatSettings
  - Load profiles from settings
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 12.2 Implement profile methods
  - `getProfiles()` - return all
  - `getProfile(name)` - return specific
  - `createProfile(name, config)` - create custom
  - `updateProfile(name, config)` - update
  - `deleteProfile(name)` - remove
  - _Requirements: 6.2, 6.4_

- [x] 12.3 Implement profile application
  - `applyProfile(name)` method
  - Update bounds, opacity, always-on-top
  - Save as current profile
  - _Requirements: 6.5_

- [x] 12.4 Create default profiles
  - Small: 400x300, 80% opacity, always-on-top
  - Medium: 800x600, 90% opacity, always-on-top
  - Large: 1200x800, 100% opacity, not always-on-top
  - _Requirements: 6.1_

- [x] 13. Add profile IPC and shortcuts
- [x] 13.1 Add IPC handlers
  - `float:get-profiles`
  - `float:apply-profile`
  - `float:create-profile`
  - `float:update-profile`
  - `float:delete-profile`
  - _Requirements: 6.2, 6.5_

- [x] 13.2 Add keyboard shortcuts
  - Register Cmd+1 for Small
  - Register Cmd+2 for Medium
  - Register Cmd+3 for Large
  - _Requirements: 6.3_

---

## Phase 6: Menu Integration (Days 13-14)

- [x] 14. Implement FloatMenu
- [x] 14.1 Create `js/float/floatMenu.js`
  - Study Min's menu structure
  - Create Float menu template function
  - _Requirements: 8.1, 16.2_

- [x] 14.2 Create menu structure
  - "Always on Top" checkbox (Cmd+Shift+A)
  - "Picture-in-Picture Mode" (Cmd+Shift+P)
  - Separator
  - "Opacity" submenu (100%, 90%, 80%, 70%, 50%)
  - Separator
  - "Window Profiles" submenu
  - "Manage Profiles..." item
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 14.3 Implement menu handlers
  - Always-on-top toggle
  - PIP toggle
  - Opacity preset handlers
  - Profile application handlers
  - Profile manager opener
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 14.4 Implement state sync
  - Update checkbox based on state
  - Update opacity radio selection
  - Update profile list dynamically
  - _Requirements: 8.4_

- [x] 15. Integrate Float menu
- [x] 15.1 Modify Min's menu
  - Study `js/menuRenderer.js`
  - Import FloatMenu
  - Insert Float menu into template
  - _Requirements: 8.1, 8.3, 16.2_

- [x] 15.2 Test menu
  - Verify menu appears
  - Verify all items work
  - Verify shortcuts shown
  - Verify state updates
  - _Requirements: 8.3, 8.4_

---

## Phase 7: Settings Integration (Days 15-16)

- [x] 16. Implement Float settings UI
- [x] 16.1 Study Min's settings
  - Analyze settings creation patterns
  - Document helper functions
  - _Requirements: 9.1, 16.2_

- [x] 16.2 Create Float settings section
  - Add "Float Browser" section
  - Use Min's section creation pattern
  - _Requirements: 9.1_

- [x] 16.3 Add default opacity setting
  - Range slider (30-100%)
  - Use Min's slider pattern
  - Display current value
  - Save to FloatSettings
  - _Requirements: 9.2_

- [x] 16.4 Add default always-on-top setting
  - Checkbox for default state
  - Use Min's checkbox pattern
  - Save to FloatSettings
  - _Requirements: 9.3_

- [x] 16.5 Add shortcuts configuration
  - Button to open shortcuts dialog
  - Allow customization
  - Validate no conflicts
  - Save to FloatSettings
  - _Requirements: 9.4_

- [x] 16.6 Add profiles management
  - Button to open profiles manager
  - Create/edit/delete UI
  - Show profile list
  - Save to FloatSettings
  - _Requirements: 9.5_

- [x] 17. Integrate settings
- [x] 17.1 Modify Min's settings
  - Study settings initialization
  - Import Float settings module
  - Call initialization after Min's settings
  - _Requirements: 9.1, 16.2_

- [x] 17.2 Test settings
  - Verify section appears
  - Verify all controls work
  - Verify persistence
  - Verify visual consistency
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

---

## Phase 8: Testing (Days 17-19)

- [x] 18. Unit tests
- [x] 18.1 Test FloatWindowManager
  - Opacity with valid/invalid values
  - Always-on-top toggle
  - PIP mode toggle
  - State persistence
  - _Requirements: 2.2, 2.3, 3.2, 4.2, 12.2, 12.3_

- [x] 18.2 Test FloatSettings
  - Get/set methods
  - Default values
  - Validation
  - Corrupted settings handling
  - _Requirements: 9.1, 9.2, 9.3, 12.5_

- [x] 18.3 Test FloatProfiles
  - Profile creation/application/deletion
  - Default profiles
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 19. Integration tests
- [x] 19.1 Test with Min Browser
  - All Min features work with Float
  - No regressions
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 19.2 Test UI integration
  - Visual consistency
  - Different window sizes
  - Menu integration
  - Settings integration
  - _Requirements: 7.4, 7.5, 8.1, 9.1_

- [x] 19.3 Test performance
  - Opacity change < 50ms
  - Memory < 10% increase
  - Startup < 500ms increase
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 19.4 Test compatibility
  - macOS 10.13+ (if possible)
  - Intel and Apple Silicon
  - Multiple monitors
  - Spaces and Mission Control
  - Fullscreen apps
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 20. Manual testing
- [x] 20.1 Test all features
  - Opacity slider (30-100%)
  - Always-on-top across spaces
  - PIP mode
  - Global shortcuts from other apps
  - Window profiles
  - Menu items
  - Settings
  - _Requirements: 2.1, 3.2, 4.2, 5.1, 6.5, 8.1, 9.1_

- [x] 20.2 Test error scenarios
  - Corrupted settings
  - Invalid values
  - Registration failures
  - Window management failures
  - _Requirements: 12.1, 12.2, 12.3, 12.5, 5.5_

---

## Phase 9: Documentation (Days 20-21)

- [x] 21. User documentation
- [x] 21.1 Update README.md
  - Float Browser description
  - Float features overview
  - Installation instructions
  - Attribution to Min Browser
  - _Requirements: 15.1_

- [x] 21.2 Create user guide
  - How to use opacity slider
  - How to use always-on-top
  - How to use PIP mode
  - Window profiles
  - Global shortcuts
  - _Requirements: 15.2_

- [x] 21.3 Create shortcuts reference
  - All Float shortcuts
  - All Min shortcuts (reference)
  - Quick reference card
  - _Requirements: 15.3_

- [x] 21.4 Create troubleshooting guide
  - Common issues and solutions
  - How to reset settings
  - How to report bugs
  - _Requirements: 15.4_

- [x] 21.5 Create welcome screen
  - Design matching Min's style
  - Explain Float features
  - Show shortcuts
  - "Don't show again" option
  - _Requirements: 15.5_

- [x] 22. Developer documentation
- [x] 22.1 Create FLOAT_MODIFICATIONS.md
  - List all Min file modifications
  - List all new Float modules
  - Explain integration points
  - _Requirements: 16.2_

- [x] 22.2 Create Min update guide
  - How to pull upstream updates
  - Files needing careful merging
  - Step-by-step process
  - _Requirements: 16.4_

- [x] 22.3 Document architecture
  - Architecture diagram
  - Module responsibilities
  - Data flow
  - _Requirements: 16.3_

---

## Phase 10: Build & Distribution (Days 22-23)

- [x] 23. Configure build
- [x] 23.1 Update package.json
  - Name: "float-browser"
  - Version: "2.0.0"
  - Description
  - _Requirements: 14.3_

- [x] 23.2 Configure electron-builder
  - App ID
  - Product name
  - DMG creation
  - Code signing
  - Notarization
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 23.3 Create universal binary
  - Configure x64 + ARM64
  - Test on both architectures
  - _Requirements: 11.2_

- [x] 24. Code signing & notarization
- [x] 24.1 Configure signing
  - Apple Developer certificate
  - Entitlements for window management
  - Test signing
  - _Requirements: 14.1, 14.4_

- [x] 24.2 Configure notarization
  - Notarization credentials
  - Build process integration
  - Test notarization
  - Verify Gatekeeper
  - _Requirements: 14.2, 14.5_

- [x] 25. Create distribution
- [x] 25.1 Build DMG
  - Build application
  - Create DMG
  - Test installation
  - _Requirements: 14.3_

- [x] 25.2 Test on clean macOS
  - Test on macOS 10.13+ (if possible)
  - Test on latest macOS
  - Test on Intel and Apple Silicon
  - Verify no security warnings
  - _Requirements: 11.1, 11.2, 14.5_

- [x] 25.3 Create release notes
  - Document Float features
  - Differences from Min
  - System requirements
  - Installation instructions
  - _Requirements: 15.1_

---

## Phase 11: Final Polish (Days 24-25)

- [x] 26. Final testing & fixes
- [x] 26.1 Comprehensive testing
  - All Float features end-to-end
  - All Min features for regressions
  - Multiple macOS versions
  - Multiple hardware configs
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 26.2 Fix critical bugs
  - Crashes or data loss
  - UI/UX issues
  - Performance issues
  - _Requirements: 12.1_

- [x] 26.3 Optimize performance
  - Opacity change performance
  - Memory usage
  - Startup time
  - _Requirements: 10.1, 10.2, 10.3_

- [-] 27. Prepare release
- [x] 27.1 Final documentation review
  - Review all user docs
  - Review all developer docs
  - Ensure completeness
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 27.2 Create release package
  - Build final DMG
  - Sign and notarize
  - Final installation test
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 27.3 Prepare announcement
  - Release announcement
  - Screenshots and demo video
  - Social media posts
  - _Requirements: 15.1_

---

## Success Criteria

Float Browser v2.0 is ready when:

1. ✅ All Min features work without regression
2. ✅ Transparency works smoothly (30-100%)
3. ✅ Always-on-top works across all contexts
4. ✅ PIP mode works correctly
5. ✅ Global shortcuts work from any app
6. ✅ Window profiles work
7. ✅ Float controls match Min's design exactly
8. ✅ Settings integrate seamlessly
9. ✅ Menu items work
10. ✅ Performance impact < 10%
11. ✅ Universal binary works
12. ✅ Code signing successful
13. ✅ Documentation complete
14. ✅ All tests pass
15. ✅ No critical bugs

---

## Notes

- **Location**: `/Users/aero/float-browser-min`
- **Base**: Min Browser (already cloned)
- **Principle**: Float features look native to Min
- **Test**: After each phase
- **Document**: Update FLOAT_MODIFICATIONS.md as you go
