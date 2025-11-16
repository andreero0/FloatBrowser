---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# Float Browser Modifications

This document tracks all modifications made to the Min Browser codebase to add Float features.

## Overview

Float Browser v2.0 is built by enhancing Min Browser with window management features (transparency, always-on-top, PIP mode, window profiles). This document maintains a comprehensive list of all changes to facilitate:

- Understanding the integration points
- Pulling upstream Min Browser updates
- Debugging Float-specific issues
- Maintaining code separation

## New Files Created

### Float Modules (`js/float/`)

- [x] `js/float/floatWindowManager.js` - Main window management (transparency, always-on-top, PIP)
- [x] `js/float/floatControls.js` - UI controls for Float features
- [x] `js/float/floatSettings.js` - Settings management for Float features
- [x] `js/float/floatShortcuts.js` - Global keyboard shortcuts
- [x] `js/float/floatProfiles.js` - Window size profiles
- [x] `js/float/floatMenu.js` - Float menu integration
- [x] `js/float/floatWelcome.js` - Welcome screen management

### Float Styles (`css/float/`)

- [x] `css/float/floatControls.css` - Styles for Float UI controls

### Float Pages (`pages/floatWelcome/`)

- [x] `pages/floatWelcome/index.html` - Welcome screen HTML
- [x] `pages/floatWelcome/welcome.css` - Welcome screen styles
- [x] `pages/floatWelcome/welcome.js` - Welcome screen logic

### Documentation (`docs/`)

- [x] `docs/USER_GUIDE.md` - Complete user guide for Float features
- [x] `docs/SHORTCUTS.md` - Keyboard shortcuts reference
- [x] `docs/TROUBLESHOOTING.md` - Troubleshooting guide
- [x] `docs/README.md` - Documentation index
- [x] `FLOAT_MODIFICATIONS.md` - This file (tracks all modifications)

## Modified Min Browser Files

### Main Process Files

#### `main/main.js`
**Purpose**: Initialize Float features in main process

**Modifications**:
- [x] Import Float modules (FloatWindowManager, FloatSettings) via build concatenation
- [x] Initialize FloatSettings on app startup (line ~70)
- [x] Enhance window creation with transparency options (lines ~200-210)
  - Added `transparent: true`
  - Added `backgroundColor: '#00000000'`
  - Added `opacity: initialOpacity` from Float settings
- [x] Create FloatWindowManager instance for main window (lines ~350-355)
- [x] Call `floatManager.restoreState()` after window creation
- [x] Store floatManager reference in window state
- [x] Register global shortcuts via FloatShortcuts
- [x] Add IPC handlers for Float features (lines ~465-640):
  - `float:set-opacity`
  - `float:get-opacity`
  - `float:set-always-on-top`
  - `float:get-always-on-top`
  - `float:toggle-pip`
  - `float:get-pip-state`
  - `float:get-profiles`
  - `float:apply-profile`
  - `float:create-profile`
  - `float:update-profile`
  - `float:delete-profile`
  - `openFloatShortcutsDialog` (settings page)
  - `openFloatProfilesDialog` (settings page)
  - `get-setting` (for welcome screen)
  - `set-setting` (for welcome screen)
- [x] Add quit handler to save Float state (lines ~450-458)
- [x] Initialize FloatProfiles instance (lines ~360-362)
- [x] Pass FloatProfiles to FloatShortcuts (line ~365)
- [x] Check and show welcome screen on first launch (lines ~410-413)

**Lines Modified**: ~70, ~200-210, ~350-365, ~410-413, ~450-458, ~465-700

**Integration Strategy**: Additive - Float initialization happens after Min's core setup

**Changes Made**:
```javascript
// Line ~70: Initialize Float settings
var floatSettings = new FloatSettings(userDataPath)

// Lines ~200-210: Window creation with transparency
const initialOpacity = floatSettings.get('opacity', 0.95)
const newWin = new BaseWindow({
  // ... existing options ...
  transparent: true,
  backgroundColor: '#00000000',
  opacity: initialOpacity
})

// Lines ~350-355: Initialize Float manager
const floatManager = new FloatWindowManager(newWin)
floatManager.restoreState(floatSettings)
windows.getState(newWin).floatManager = floatManager

// Lines ~450-458: Save state on quit
app.on('before-quit', function () {
  const currentWindow = windows.getCurrent()
  if (currentWindow) {
    const floatManager = windows.getState(currentWindow).floatManager
    if (floatManager) {
      floatManager.saveState(floatSettings)
    }
  }
})

// Lines ~410-413: Show welcome screen on first launch
if (typeof FloatWelcome !== 'undefined') {
  FloatWelcome.checkAndShowWelcome(newWin, floatSettings)
}

// Lines ~465-700: IPC handlers for Float features
ipc.handle('float:set-opacity', function (event, opacity) { ... })
ipc.handle('float:get-opacity', function (event) { ... })
ipc.handle('float:set-always-on-top', function (event, enabled) { ... })
ipc.handle('float:get-always-on-top', function (event) { ... })
ipc.handle('float:toggle-pip', function (event) { ... })
ipc.handle('float:get-pip-state', function (event) { ... })
ipc.handle('float:get-profiles', function (event) { ... })
ipc.handle('float:apply-profile', function (event, profileName) { ... })
ipc.handle('float:create-profile', function (event, name, config) { ... })
ipc.handle('float:update-profile', function (event, name, config) { ... })
ipc.handle('float:delete-profile', function (event, name) { ... })
ipc.handle('get-setting', function (event, key) { ... })
ipc.handle('set-setting', function (event, key, value) { ... })
```

---

### Renderer Process Files

#### `js/browserUI.js`
**Purpose**: Initialize Float UI controls

**Modifications**:
- [x] Import FloatControls module (line ~13)
- [x] FloatControls initialized in `js/default.js` after Min's UI is ready

**Lines Modified**: 13

**Integration Strategy**: Additive - Float UI added after Min's UI is ready

**Changes Made**:
```javascript
// Line ~13: Import FloatControls
var FloatControls = require('float/floatControls.js')
```

**Note**: Actual initialization happens in `js/default.js` (see below)

---

#### `js/default.js`
**Purpose**: Initialize all modules including Float controls

**Modifications**:
- [x] Initialize FloatControls after all Min modules are loaded (lines ~95-97)
- [x] Create FloatControls instance and call initialize()

**Lines Modified**: 95-97

**Integration Strategy**: Additive - Float controls initialized after Min's UI is fully ready

**Changes Made**:
```javascript
// Lines ~95-97: Initialize Float controls
var FloatControls = require('float/floatControls.js')
var floatControls = new FloatControls()
floatControls.initialize()
```

---

### Float Controls Module Details

#### `js/float/floatControls.js`
**Purpose**: Provides UI controls for Float features integrated into Min's navbar

**Features Implemented**:
- [x] Opacity slider (30-100%) with live percentage display
- [x] Always-on-top toggle button with visual state indication
- [x] Picture-in-Picture toggle button with visual state indication
- [x] IPC communication with main process for all Float features
- [x] State synchronization with main process
- [x] Initial state loading on startup
- [x] Visual consistency with Min's design language

**UI Components**:
1. **Opacity Control**:
   - Range slider (30-100)
   - Percentage label display
   - Real-time updates via IPC
   - Styled to match Min's controls

2. **Always-On-Top Button**:
   - Uses Min's navbar-action-button class
   - Carbon icon: `carbon:pin`
   - Tooltip: "Always on Top (Cmd+Shift+A)"
   - Active state: blue color, full opacity
   - Inactive state: reduced opacity

3. **PIP Button**:
   - Uses Min's navbar-action-button class
   - Carbon icon: `carbon:fit-to-screen`
   - Tooltip: "Picture-in-Picture (Cmd+Shift+P)"
   - Active state: blue color, full opacity
   - Inactive state: reduced opacity

**IPC Methods Used**:
- `float:set-opacity` - Set window opacity
- `float:get-opacity` - Get current opacity
- `float:set-always-on-top` - Toggle always-on-top
- `float:get-always-on-top` - Get always-on-top state
- `float:toggle-pip` - Toggle PIP mode
- `float:get-pip-state` - Get PIP state
- `float:state-changed` - Listen for state changes (event)

**Integration**:
- Controls inserted into navbar before `.navbar-right-actions`
- Uses flexbox layout with proper spacing
- Matches Min's button styling and interaction patterns
- Responsive to window state changes

**Requirements Satisfied**: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 2.1, 2.3, 2.4, 2.5, 3.1, 3.2, 3.4, 3.5, 4.1, 4.2

---

### Float Styles Module Details

#### `css/float/floatControls.css`
**Purpose**: Provides styles for Float UI controls that match Min's visual design language

**Features Implemented**:
- [x] Float controls container layout (flexbox with proper spacing)
- [x] Opacity slider styled to match Min's design patterns
- [x] Opacity label styling with proper typography
- [x] Button states (default, hover, active, focus, disabled)
- [x] Dark mode support for all controls
- [x] Accessibility focus states (keyboard navigation)
- [x] Responsive design for different window sizes
- [x] PIP mode optimizations (400x300 window)

**Style Components**:

1. **Container Styles**:
   - Flexbox layout with 0.5rem gap
   - Proper alignment with navbar
   - Responsive margins

2. **Opacity Slider**:
   - Custom styled range input (removes default appearance)
   - Track: 4px height, rounded, subtle background
   - Thumb: 14px circle, scales on hover/active
   - Smooth transitions (0.15s)
   - Dark mode: lighter colors for contrast

3. **Opacity Label**:
   - 13px font size
   - 40px min-width for stability
   - 0.8 opacity for subtle appearance
   - User-select disabled

4. **Action Buttons**:
   - Match Min's navbar-action-button style
   - 36px height, 1rem horizontal padding
   - 0.6 opacity default, 1.0 when active
   - Smooth transitions for all properties
   - Scale transform on click (0.95)

5. **Button States**:
   - **Default**: 0.6 opacity, inherit color
   - **Hover**: 0.8 opacity, background on Windows
   - **Active/Pressed**: Scale down, increased background
   - **Enabled**: 1.0 opacity, royalblue color
   - **Focus**: 2px outline, offset 2px
   - **Focus-visible**: Enhanced outline for keyboard nav
   - **Disabled**: 0.3 opacity, no pointer events

6. **Dark Mode**:
   - Lighter slider track (rgba(255, 255, 255, 0.3))
   - Light grey slider thumb
   - Dodgerblue for active buttons
   - Adjusted hover backgrounds

7. **Responsive Breakpoints**:
   - **800px**: Reduced spacing, 70px slider
   - **600px**: Compact layout, 60px slider
   - **450px**: PIP mode, 50px slider, hidden label
   - **400px**: Minimal PIP, 45px slider
   - **400x300**: Full PIP optimization, scaled controls

8. **Accessibility**:
   - Proper focus outlines (2px solid)
   - Focus-visible for keyboard navigation
   - User-select disabled on labels
   - Cursor pointer on interactive elements
   - Disabled state with no pointer events

**Browser Compatibility**:
- WebKit slider styles (-webkit-slider-thumb)
- Firefox slider styles (-moz-range-thumb)
- Standard appearance property alongside -webkit-appearance

**Integration with Min**:
- Uses Min's color scheme (royalblue/dodgerblue)
- Matches Min's transition timings (0.15s)
- Follows Min's opacity patterns (0.6, 0.8, 1.0)
- Consistent with Min's hover effects
- Platform-specific styles (body.windows)

**Requirements Satisfied**: 7.4, 7.5

---

### Float Shortcuts Module Details

#### `js/float/floatShortcuts.js`
**Purpose**: Manages global keyboard shortcuts for Float Browser features

**Features Implemented**:
- [x] Global shortcut registration using Electron's globalShortcut API
- [x] Toggle window visibility (Cmd+Shift+F)
- [x] Toggle always-on-top (Cmd+Shift+A)
- [x] Toggle PIP mode (Cmd+Shift+P)
- [x] Graceful error handling for registration failures
- [x] Shortcut cleanup on app quit
- [x] Configurable shortcuts via FloatSettings
- [x] Registration error tracking for user feedback

**Shortcuts Implemented**:

1. **Toggle Visibility (Cmd+Shift+F)**:
   - Shows window if hidden
   - Hides window if visible
   - Focuses window when showing
   - Works from any application

2. **Toggle Always-On-Top (Cmd+Shift+A)**:
   - Toggles always-on-top state
   - Saves state to settings
   - Updates FloatWindowManager
   - Persists across restarts

3. **Toggle PIP Mode (Cmd+Shift+P)**:
   - Toggles Picture-in-Picture mode
   - Saves window state
   - Resizes window appropriately
   - Maintains functionality in PIP

4. **Apply Profile Small (Cmd+1)**:
   - Applies the "small" window profile (400x300)
   - Sets opacity to 80%
   - Enables always-on-top
   - Works from any application

5. **Apply Profile Medium (Cmd+2)**:
   - Applies the "medium" window profile (800x600)
   - Sets opacity to 90%
   - Enables always-on-top
   - Works from any application

6. **Apply Profile Large (Cmd+3)**:
   - Applies the "large" window profile (1200x800)
   - Sets opacity to 100%
   - Disables always-on-top
   - Works from any application

**Key Methods**:
- `registerShortcuts()` - Registers all global shortcuts
- `unregisterShortcuts()` - Unregisters all shortcuts (called on quit)
- `updateShortcut(action, accelerator)` - Updates a specific shortcut
- `getRegisteredShortcuts()` - Returns list of registered shortcuts
- `getRegistrationErrors()` - Returns list of registration errors

**Error Handling**:
- Catches registration failures (shortcut already in use)
- Logs errors without crashing
- Continues operation if some shortcuts fail
- Tracks errors for user feedback
- Graceful degradation (app works without shortcuts)

**Integration**:
- Requires FloatWindowManager instance
- Requires BrowserWindow instance
- Requires FloatSettings instance
- Optionally accepts FloatProfiles instance for profile shortcuts
- Registered after app 'ready' event
- Unregistered on 'will-quit' event

**Settings Integration**:
- Reads shortcuts from `globalShortcuts` settings object
- Default shortcuts defined in FloatSettings
- Supports custom shortcut configuration
- Saves state changes to settings

**Requirements Satisfied**: 5.1, 5.2, 5.3, 5.4, 5.5, 6.3

---

### Float Profiles Module Details

#### `js/float/floatProfiles.js`
**Purpose**: Manages window size profiles for quick switching between predefined or custom window configurations

**Features Implemented**:
- [x] Profile management (create, read, update, delete)
- [x] Default profiles (Small, Medium, Large)
- [x] Custom profile creation and management
- [x] Profile application with performance tracking
- [x] Settings persistence for all profiles
- [x] Profile validation for data integrity
- [x] Current profile tracking

**Default Profiles**:

1. **Small Profile**:
   - Size: 400x300 pixels
   - Opacity: 80%
   - Always-on-top: Enabled
   - Use case: Minimal reference window

2. **Medium Profile**:
   - Size: 800x600 pixels
   - Opacity: 90%
   - Always-on-top: Enabled
   - Use case: Standard floating browser

3. **Large Profile**:
   - Size: 1200x800 pixels
   - Opacity: 100%
   - Always-on-top: Disabled
   - Use case: Full-featured browsing

**Key Methods**:
- `getProfiles()` - Returns all profiles as an object
- `getProfile(name)` - Returns a specific profile by name
- `createProfile(name, config)` - Creates a new custom profile
- `updateProfile(name, config)` - Updates an existing profile
- `deleteProfile(name)` - Removes a profile
- `applyProfile(name)` - Applies a profile to the window (< 100ms)
- `getCurrentProfile()` - Returns the currently active profile name
- `resetToDefaults()` - Resets all profiles to defaults

**Profile Configuration Schema**:
```javascript
{
  name: string,        // Display name
  width: number,       // Window width (1-10000)
  height: number,      // Window height (1-10000)
  opacity: number,     // Opacity (0.3-1.0)
  alwaysOnTop: boolean // Always-on-top state
}
```

**Validation**:
- Profile names must be non-empty strings
- Width and height must be positive numbers (1-10000)
- Opacity must be between 0.3 and 1.0
- alwaysOnTop must be boolean
- All validations include descriptive error messages

**Profile Application Process**:
1. Validate profile exists
2. Update window bounds (preserving position)
3. Update opacity via FloatWindowManager
4. Update always-on-top via FloatWindowManager
5. Save current profile name to settings
6. Track performance (logs warning if > 100ms)

**Integration**:
- Requires FloatWindowManager instance
- Requires FloatSettings instance
- Profiles stored in settings under `windowProfiles` key
- Current profile tracked in `currentProfile` setting
- Loads profiles from settings on initialization
- Creates default profiles if none exist

**Error Handling**:
- Graceful handling of missing profiles
- Validation errors logged with descriptive messages
- Failed operations return false without crashing
- Settings corruption handled by validation

**Performance**:
- Profile application completes in < 100ms (Requirement 6.5)
- Performance tracking logs warnings if threshold exceeded
- Efficient profile lookup using object keys
- Minimal memory footprint

**Requirements Satisfied**: 6.1, 6.2, 6.4, 6.5

---

### Float Menu Module Details

#### `js/float/floatMenu.js`
**Purpose**: Creates the Float menu template for integration into Min's application menu (main process)

**Features Implemented**:
- [x] Dynamic menu generation based on current window state
- [x] Always-on-top checkbox with state synchronization
- [x] Picture-in-Picture mode menu item
- [x] Opacity presets submenu with radio buttons
- [x] Window profiles submenu with keyboard shortcuts
- [x] Custom profiles support
- [x] Manage Profiles menu item
- [x] State synchronization on menu actions
- [x] Menu rebuilding after state changes
- [x] Graceful error handling

**Menu Structure**:

1. **Always on Top** (checkbox):
   - Shows current always-on-top state
   - Keyboard shortcut: Cmd+Shift+A
   - Toggles state and rebuilds menu
   - Syncs with FloatWindowManager

2. **Picture-in-Picture Mode**:
   - Keyboard shortcut: Cmd+Shift+P
   - Toggles PIP mode via FloatWindowManager
   - No state indicator (toggle action)

3. **Opacity Submenu**:
   - Radio buttons for: 100%, 90%, 80%, 70%, 50%
   - Current opacity marked with checkmark
   - Applies opacity via FloatWindowManager
   - Rebuilds menu to update selection

4. **Window Profiles Submenu**:
   - **Default Profiles** (with shortcuts):
     - Small (Cmd+1)
     - Medium (Cmd+2)
     - Large (Cmd+3)
   - **Custom Profiles** (dynamic):
     - Listed after separator
     - No keyboard shortcuts
     - Applied via FloatProfiles
   - **Manage Profiles...**:
     - Opens settings page to Float section
     - Always at bottom of submenu

**Key Methods**:
- `createFloatMenuTemplate(options)` - Creates menu template with current state
  - Accepts `window` and `sendIPCToWindow` parameters
  - Reads state from window's floatManager and floatProfiles
  - Returns menu template object or null on error

**State Management**:
- Reads current state from window on menu creation
- Updates state via FloatWindowManager methods
- Rebuilds menu after state changes to update UI
- Handles missing window/manager gracefully

**Integration**:
- Called from `main/menu.js` during menu building
- Requires access to windows module and current window
- Uses sendIPCToWindow for opening settings
- Integrated between View and Developer menus

**Error Handling**:
- Try-catch wrapper in menu.js integration
- Returns null on error (filtered out of menu)
- Logs errors without crashing
- Graceful degradation if Float features unavailable

**Menu Rebuilding**:
- Menu rebuilds after opacity changes
- Menu rebuilds after always-on-top changes
- Uses global `mainMenu` and `buildAppMenu()` references
- Ensures UI stays synchronized with state

**Requirements Satisfied**: 8.1, 8.2, 8.3, 8.4, 8.5

---

#### `index.html`
**Purpose**: Include Float stylesheets

**Modifications**:
- [x] Add `<link>` tag for `css/float/floatControls.css` (line ~10)
- [ ] Add `<link>` tag for `css/float/floatIntegration.css` (when created)

**Lines Modified**: 10

**Integration Strategy**: Additive - Float CSS loaded alongside Min's CSS

**Changes Made**:
```html
<!-- Line ~10: Include Float controls CSS -->
<link rel="stylesheet" href="css/float/floatControls.css" />
```

---

### Menu Files

#### `js/menuRenderer.js`
**Purpose**: Handle IPC messages from menu bar and Float menu state changes

**Modifications**:
- [x] Import FloatControls module (line ~11)
- [x] Add IPC handler for `float:state-changed` event (lines ~145-151)
- [x] Update FloatControls UI when state changes from menu

**Lines Modified**: 11, 145-151

**Integration Strategy**: Additive - Float IPC handler added to existing handlers

**Changes Made**:
```javascript
// Line ~11: Import FloatControls
var floatControls = require('float/floatControls.js')

// Lines ~145-151: Float menu state change handler
ipc.on('float:state-changed', function (e, state) {
  // Update Float controls UI to reflect state changes from menu
  if (floatControls && floatControls.updateState) {
    floatControls.updateState(state)
  }
})
```

---

#### `main/menu.js`
**Purpose**: Add Float menu to application menu

**Modifications**:
- [x] Import FloatMenu module inline in menu template
- [x] Insert Float menu between View and Developer menus
- [x] Add null filter to template array to handle Float menu load failures
- [x] Float menu dynamically reads state from window's floatManager and floatProfiles

**Lines Modified**: ~350-365, ~520

**Integration Strategy**: Additive - Float menu inserted into existing menu structure

**Changes Made**:
```javascript
// Lines ~350-365: Float menu integration
(function () {
  try {
    const FloatMenu = require('../js/float/floatMenu.js')
    return FloatMenu.createFloatMenuTemplate({
      window: windows.getCurrent(),
      sendIPCToWindow: sendIPCToWindow
    })
  } catch (error) {
    console.error('Failed to create Float menu:', error)
    return null
  }
})(),

// Line ~520: Filter null items from template
].filter(item => item !== null)
```

**Float Menu Structure**:
- Always on Top (checkbox with Cmd+Shift+A)
- Picture-in-Picture Mode (Cmd+Shift+P)
- Separator
- Opacity submenu (100%, 90%, 80%, 70%, 50% with radio buttons)
- Separator
- Window Profiles submenu:
  - Small (Cmd+1)
  - Medium (Cmd+2)
  - Large (Cmd+3)
  - Separator (if custom profiles exist)
  - Custom profiles (dynamic)
  - Separator
  - Manage Profiles...

**State Synchronization**:
- Menu reads current state from window's floatManager
- Checkboxes and radio buttons reflect current state
- Menu rebuilds after state changes to update UI
- Handles missing window/manager gracefully

**Requirements Satisfied**: 8.1, 8.2, 8.3, 8.4, 8.5

---

### Settings Files

#### `pages/settings/index.html`
**Purpose**: Add Float settings section to settings page

**Modifications**:
- [x] Add Float settings container section (lines ~280-330)
- [x] Add Float settings heading and description
- [x] Add default opacity slider control (30-100%)
- [x] Add default always-on-top checkbox
- [x] Add shortcuts configuration button
- [x] Add profiles management button

**Lines Modified**: 280-330

**Integration Strategy**: Additive - Float settings section added before restart banner

**Changes Made**:
```html
<!-- Float Browser Settings -->
<div class="settings-container" id="float-settings-container">
  <h3>Float Browser</h3>
  <div class="settings-info-subheading">
    Window management and transparency settings
  </div>

  <div class="setting-section">
    <label for="float-default-opacity">Default Opacity</label>
    <input type="range" id="float-default-opacity" min="30" max="100" step="1" />
    <span id="float-default-opacity-value">95%</span>
  </div>

  <div class="setting-section">
    <input type="checkbox" id="checkbox-float-default-always-on-top" />
    <label for="checkbox-float-default-always-on-top">
      Start with Always-on-Top enabled
    </label>
  </div>

  <div class="setting-section">
    <label>Global Shortcuts</label>
    <button id="float-configure-shortcuts">Configure Shortcuts</button>
  </div>

  <div class="setting-section">
    <label>Window Profiles</label>
    <button id="float-manage-profiles">Manage Profiles</button>
  </div>
</div>
```

**Requirements Satisfied**: 9.1, 9.2, 9.3, 9.4, 9.5

---

#### `pages/settings/settings.js`
**Purpose**: Add Float settings logic

**Modifications**:
- [x] Add Float settings variables (lines ~580-585)
- [x] Add default opacity slider handler (lines ~590-610)
- [x] Add default always-on-top checkbox handler (lines ~615-630)
- [x] Add shortcuts configuration button handler (lines ~635-640)
- [x] Add profiles management button handler (lines ~645-650)

**Lines Modified**: 580-650

**Integration Strategy**: Additive - Float settings handlers appended to settings.js

**Changes Made**:
```javascript
/* Float Browser settings */

var floatDefaultOpacitySlider = document.getElementById('float-default-opacity')
var floatDefaultOpacityValue = document.getElementById('float-default-opacity-value')
var floatDefaultAlwaysOnTopCheckbox = document.getElementById('checkbox-float-default-always-on-top')
var floatConfigureShortcutsButton = document.getElementById('float-configure-shortcuts')
var floatManageProfilesButton = document.getElementById('float-manage-profiles')

/* Default opacity setting */
settings.get('float', function (floatSettings) {
  if (floatSettings && floatSettings.defaultOpacity !== undefined) {
    var opacityPercent = Math.round(floatSettings.defaultOpacity * 100)
    floatDefaultOpacitySlider.value = opacityPercent
    floatDefaultOpacityValue.textContent = opacityPercent + '%'
  } else {
    floatDefaultOpacitySlider.value = 95
    floatDefaultOpacityValue.textContent = '95%'
  }
})

floatDefaultOpacitySlider.addEventListener('input', function (e) {
  var opacityPercent = parseInt(this.value)
  floatDefaultOpacityValue.textContent = opacityPercent + '%'
  
  settings.get('float', function (floatSettings) {
    if (!floatSettings) {
      floatSettings = {}
    }
    floatSettings.defaultOpacity = opacityPercent / 100
    settings.set('float', floatSettings)
  })
})

/* Default always-on-top setting */
settings.get('float', function (floatSettings) {
  if (floatSettings && floatSettings.defaultAlwaysOnTop !== undefined) {
    floatDefaultAlwaysOnTopCheckbox.checked = floatSettings.defaultAlwaysOnTop
  } else {
    floatDefaultAlwaysOnTopCheckbox.checked = true
  }
})

floatDefaultAlwaysOnTopCheckbox.addEventListener('change', function (e) {
  settings.get('float', function (floatSettings) {
    if (!floatSettings) {
      floatSettings = {}
    }
    floatSettings.defaultAlwaysOnTop = floatDefaultAlwaysOnTopCheckbox.checked
    settings.set('float', floatSettings)
  })
})

/* Configure shortcuts button */
floatConfigureShortcutsButton.addEventListener('click', function () {
  postMessage({ message: 'openFloatShortcutsDialog' })
})

/* Manage profiles button */
floatManageProfilesButton.addEventListener('click', function () {
  postMessage({ message: 'openFloatProfilesDialog' })
})
```

**Settings Storage**:
- Float settings stored under `float` key in Min's settings system
- `float.defaultOpacity` - Default opacity value (0.3-1.0)
- `float.defaultAlwaysOnTop` - Default always-on-top state (boolean)
- `float.globalShortcuts` - Keyboard shortcuts configuration
- `float.windowProfiles` - Window profiles configuration

**Requirements Satisfied**: 9.1, 9.2, 9.3, 9.4, 9.5

---

#### `js/preload/default.js`
**Purpose**: Add IPC handlers for Float settings dialogs

**Modifications**:
- [x] Add IPC handler for `openFloatShortcutsDialog` message (lines ~60-62)
- [x] Add IPC handler for `openFloatProfilesDialog` message (lines ~64-66)

**Lines Modified**: 60-66

**Integration Strategy**: Additive - Float IPC handlers added to existing message handlers

**Changes Made**:
```javascript
if (e.data?.message === 'openFloatShortcutsDialog') {
  ipc.send('openFloatShortcutsDialog')
}

if (e.data?.message === 'openFloatProfilesDialog') {
  ipc.send('openFloatProfilesDialog')
}
```

**Requirements Satisfied**: 9.4, 9.5

---

#### `js/float/floatSettingsUI.js`
**Purpose**: Handle Float settings dialogs (shortcuts and profiles)

**Features Implemented**:
- [x] Initialize IPC handlers for dialog requests
- [x] Show shortcuts configuration dialog
- [x] Show profiles management dialog
- [x] Display current shortcuts and profiles
- [x] Use Electron's native dialog for consistency

**Key Methods**:
- `initialize()` - Binds IPC handlers for dialog requests
- `showShortcutsDialog()` - Displays shortcuts configuration dialog
- `showProfilesDialog()` - Displays profiles management dialog

**Dialog Content**:

1. **Shortcuts Dialog**:
   - Lists all current global shortcuts
   - Shows platform-specific key names (Cmd/Ctrl)
   - Includes profile shortcuts (Cmd+1/2/3)
   - Note about future customization

2. **Profiles Dialog**:
   - Lists all window profiles with details
   - Shows size, opacity, and always-on-top state
   - Explains how to apply profiles
   - Note about future customization

**Integration**:
- Initialized in `js/default.js` with other modules
- Uses `webviews.bindIPC()` for IPC handling
- Reads settings from Min's settings system
- Uses Electron's dialog API for native dialogs

**Future Enhancements**:
- Full shortcuts customization UI
- Profile creation/editing UI
- Conflict detection for shortcuts
- Profile import/export

**Requirements Satisfied**: 9.4, 9.5

---

#### `js/default.js`
**Purpose**: Initialize Float settings UI module

**Modifications**:
- [x] Add FloatSettingsUI initialization (lines ~170-172)

**Lines Modified**: 170-172

**Integration Strategy**: Additive - Float settings UI initialized with other modules

**Changes Made**:
```javascript
// Float Browser modules
require('float/floatSettingsUI.js').initialize()
```

**Requirements Satisfied**: 9.1, 9.4, 9.5

---

### Build Files

#### `scripts/buildMain.js`
**Purpose**: Build main process by concatenating modules

**Modifications**:
- [x] Add Float modules to concatenation list (lines ~8-12)
  - Added `js/float/floatSettings.js`
  - Added `js/float/floatWindowManager.js`
  - Added `js/float/floatShortcuts.js`
  - Added `js/float/floatProfiles.js`
  - Added `js/float/floatWelcome.js`

**Lines Modified**: 8-12

**Integration Strategy**: Additive - Float modules added before main.js in build order

**Changes Made**:
```javascript
const modules = [
  'dist/localization.build.js',
  'main/windowManagement.js',
  'js/util/keyMap.js',
  'main/menu.js',
  'main/touchbar.js',
  'main/registryConfig.js',
  'js/util/settings/settingsMain.js',
  'js/float/floatSettings.js',        // Added
  'js/float/floatWindowManager.js',   // Added
  'js/float/floatShortcuts.js',       // Added
  'js/float/floatProfiles.js',        // Added
  'js/float/floatWelcome.js',         // Added
  'main/main.js',
  // ... rest of modules
]
```

---

#### `scripts/buildBrowserStyles.js`
**Purpose**: Build CSS bundle by concatenating stylesheets

**Modifications**:
- [x] Add Float CSS to modules array
  - Added `css/float/floatControls.css`

**Lines Modified**: ~17

**Integration Strategy**: Additive - Float CSS added to bundle

**Changes Made**:
```javascript
const modules = [
  'css/base.css',
  'css/windowControls.css',
  // ... other CSS files
  'css/passwordViewer.css',
  'css/float/floatControls.css',  // Added
  'node_modules/dragula/dist/dragula.min.css'
]
```

---

#### `package.json`
**Purpose**: Update project metadata and build configuration

**Modifications**:
- [x] Update `name` to "float-browser"
- [x] Update `version` to "2.0.0"
- [x] Update `description` to "A transparent, always-on-top browser based on Min Browser"
- [x] Update `productName` to "Float Browser"
- [x] Add `float` metadata section with upstream tracking
- [x] Add Float-specific build scripts (if needed)

**Lines Modified**: 2-5, 88-92

**Integration Strategy**: Replacement - Project identity changes to Float Browser

**Changes Made**:
```json
{
  "name": "float-browser",
  "productName": "Float Browser",
  "version": "2.0.0",
  "description": "A transparent, always-on-top browser based on Min Browser",
  ...
  "float": {
    "basedOn": "Min Browser v1.35.2",
    "upstream": "https://github.com/minbrowser/min"
  }
}
```

---

#### `README.md`
**Purpose**: Update project documentation

**Modifications**:
- [x] Update title to "Float Browser"
- [x] Add Float features overview section
- [x] Add Min Browser features section with attribution
- [x] Add "Based on Min Browser" section
- [x] Update installation instructions for macOS focus
- [x] Add Float-specific keyboard shortcuts
- [x] Update development instructions
- [x] Update build instructions (macOS only)
- [x] Update contributing section
- [x] Add acknowledgments section
- [x] Replace sponsor section with "Support Min Browser" section

**Lines Modified**: Multiple sections throughout file

**Integration Strategy**: Replacement - Documentation reflects Float Browser identity while maintaining attribution to Min Browser

**Key Changes**:
- Header now introduces Float Browser with window management features
- Clear separation between Float features and Min Browser features
- All Min Browser references updated to acknowledge the upstream project
- Build instructions focused on macOS (Float's target platform)
- Contributing section directs Min Browser contributions upstream
- Prominent acknowledgment of Min Browser as the foundation

---

## Files NOT Modified

The following Min Browser files remain unchanged to preserve core functionality:

### Tab Management
- `js/tabState.js`
- `js/tabState/tab.js`
- `js/tabState/task.js`
- `js/navbar/tabBar.js`
- `js/navbar/tabEditor.js`

### Navigation & Search
- `js/searchbar/searchbar.js`
- `js/searchbar/searchbarPlugins.js`
- `js/navbar/navigationButtons.js`

### Content Management
- `js/webviews.js`
- `main/viewManager.js`
- `js/readerView.js`
- `js/pdfViewer.js`

### Data & Storage
- `js/places/places.js`
- `js/places/fullTextSearch.js`
- `js/util/database.js`

### Privacy & Security
- `main/filtering.js`
- `main/permissionManager.js`
- `js/preload/siteUnbreak.js`

### Other Core Features
- `js/bookmarkConverter.js`
- `js/downloadManager.js`
- `js/passwordManager/`
- `js/pageTranslations.js`

## Integration Points Summary

### Main Process Integration Points
1. **Window Creation** (`main/main.js`): Add transparency and Float manager
2. **IPC Handlers** (`main/main.js`): Add Float-specific IPC handlers
3. **App Lifecycle** (`main/main.js`): Save Float state on quit

### Renderer Process Integration Points
1. **UI Initialization** (`js/browserUI.js`): Initialize Float controls
2. **HTML Structure** (`pages/index.html`): Include Float CSS
3. **Menu System** (`js/menuRenderer.js`): Add Float menu
4. **Settings UI** (`js/util/settings/`): Add Float settings section

---

### Settings Page Integration

#### `pages/settings/index.html`
**Purpose**: Add Float Browser settings section to Min's settings page

**Modifications**:
- [x] Added Float Browser settings container section (lines ~380-430)
- [x] Added default opacity slider control
- [x] Added default always-on-top checkbox
- [x] Added global shortcuts configuration button
- [x] Added window profiles management button
- [x] Styled to match Min's settings layout

**Lines Modified**: 380-430

**Integration Strategy**: Additive - Float settings section added as new container

**Changes Made**:
```html
<!-- Float Browser Settings -->
<div class="settings-container" id="float-settings-container">
  <h3>Float Browser</h3>
  <div class="settings-info-subheading">
    Window management and transparency settings
  </div>

  <div class="setting-section">
    <label for="float-default-opacity">Default Opacity</label>
    <input type="range" id="float-default-opacity" min="30" max="100" step="1" />
    <span id="float-default-opacity-value">95%</span>
  </div>

  <div class="setting-section">
    <input type="checkbox" id="checkbox-float-default-always-on-top" />
    <label for="checkbox-float-default-always-on-top">
      Start with Always-on-Top enabled
    </label>
  </div>

  <div class="setting-section">
    <label>Global Shortcuts</label>
    <button id="float-configure-shortcuts">Configure Shortcuts</button>
  </div>

  <div class="setting-section">
    <label>Window Profiles</label>
    <button id="float-manage-profiles">Manage Profiles</button>
  </div>
</div>
```

**Requirements Satisfied**: 9.1, 9.2, 9.3, 9.4, 9.5

---

#### `pages/settings/settings.js`
**Purpose**: Handle Float settings interactions and persistence

**Modifications**:
- [x] Added Float default opacity slider handler (lines ~690-710)
- [x] Added Float default always-on-top checkbox handler (lines ~712-730)
- [x] Added Float shortcuts configuration button handler (lines ~732-740)
- [x] Added Float profiles management button handler (lines ~742-750)
- [x] Load Float settings from settings system
- [x] Save Float settings changes to settings system

**Lines Modified**: 690-750

**Integration Strategy**: Additive - Float handlers added after Min's settings handlers

**Changes Made**:
```javascript
/* Float Browser settings */

var floatDefaultOpacitySlider = document.getElementById('float-default-opacity')
var floatDefaultOpacityValue = document.getElementById('float-default-opacity-value')
var floatDefaultAlwaysOnTopCheckbox = document.getElementById('checkbox-float-default-always-on-top')
var floatConfigureShortcutsButton = document.getElementById('float-configure-shortcuts')
var floatManageProfilesButton = document.getElementById('float-manage-profiles')

/* Default opacity setting */
settings.get('float', function (floatSettings) {
  if (floatSettings && floatSettings.defaultOpacity !== undefined) {
    var opacityPercent = Math.round(floatSettings.defaultOpacity * 100)
    floatDefaultOpacitySlider.value = opacityPercent
    floatDefaultOpacityValue.textContent = opacityPercent + '%'
  } else {
    floatDefaultOpacitySlider.value = 95
    floatDefaultOpacityValue.textContent = '95%'
  }
})

floatDefaultOpacitySlider.addEventListener('input', function (e) {
  var opacityPercent = parseInt(this.value)
  floatDefaultOpacityValue.textContent = opacityPercent + '%'
  
  settings.get('float', function (floatSettings) {
    if (!floatSettings) {
      floatSettings = {}
    }
    floatSettings.defaultOpacity = opacityPercent / 100
    settings.set('float', floatSettings)
  })
})

/* Default always-on-top setting */
settings.get('float', function (floatSettings) {
  if (floatSettings && floatSettings.defaultAlwaysOnTop !== undefined) {
    floatDefaultAlwaysOnTopCheckbox.checked = floatSettings.defaultAlwaysOnTop
  } else {
    floatDefaultAlwaysOnTopCheckbox.checked = true
  }
})

floatDefaultAlwaysOnTopCheckbox.addEventListener('change', function (e) {
  settings.get('float', function (floatSettings) {
    if (!floatSettings) {
      floatSettings = {}
    }
    floatSettings.defaultAlwaysOnTop = floatDefaultAlwaysOnTopCheckbox.checked
    settings.set('float', floatSettings)
  })
})

/* Configure shortcuts button */
floatConfigureShortcutsButton.addEventListener('click', function () {
  postMessage({ message: 'openFloatShortcutsDialog' })
})

/* Manage profiles button */
floatManageProfilesButton.addEventListener('click', function () {
  postMessage({ message: 'openFloatProfilesDialog' })
})
```

**Requirements Satisfied**: 9.1, 9.2, 9.3, 9.4, 9.5

---

#### `js/util/settings/settingsPreload.js`
**Purpose**: Handle IPC communication for Float settings dialogs

**Modifications**:
- [x] Added message handler for `openFloatShortcutsDialog` (lines ~18-20)
- [x] Added message handler for `openFloatProfilesDialog` (lines ~22-24)
- [x] Forward messages to main process via IPC

**Lines Modified**: 18-24

**Integration Strategy**: Additive - Float message handlers added to existing message listener

**Changes Made**:
```javascript
// Float settings dialog handlers
if (e.data && e.data.message && e.data.message === 'openFloatShortcutsDialog') {
  ipc.invoke('openFloatShortcutsDialog')
}

if (e.data && e.data.message && e.data.message === 'openFloatProfilesDialog') {
  ipc.invoke('openFloatProfilesDialog')
}
```

**Requirements Satisfied**: 9.4, 9.5

---

#### `main/main.js` - Settings Dialog Handlers
**Purpose**: Show Float settings dialogs from main process

**Modifications**:
- [x] Added `openFloatShortcutsDialog` IPC handler (lines ~642-658)
- [x] Added `openFloatProfilesDialog` IPC handler (lines ~660-678)
- [x] Display current shortcuts in dialog
- [x] Display current profiles in dialog

**Lines Modified**: 642-678

**Integration Strategy**: Additive - Dialog handlers added after Float IPC handlers

**Changes Made**:
```javascript
// Float Settings Dialog handlers
ipc.handle('openFloatShortcutsDialog', function (event) {
  const shortcuts = floatSettings.get('globalShortcuts', {
    toggleVisibility: 'CommandOrControl+Shift+F',
    toggleAlwaysOnTop: 'CommandOrControl+Shift+A',
    togglePIP: 'CommandOrControl+Shift+P'
  })
  
  dialog.showMessageBox(windows.windowFromContents(event.sender).win, {
    type: 'info',
    title: 'Float Shortcuts',
    message: 'Global Keyboard Shortcuts',
    detail: `Toggle Visibility: ${shortcuts.toggleVisibility}\nToggle Always-on-Top: ${shortcuts.toggleAlwaysOnTop}\nToggle PIP Mode: ${shortcuts.togglePIP}\n\nNote: Shortcut customization will be available in a future update.`,
    buttons: ['OK']
  })
})

ipc.handle('openFloatProfilesDialog', function (event) {
  const windowObj = windows.windowFromContents(event.sender)
  if (windowObj) {
    const state = windows.getState(windowObj.win)
    if (state && state.floatProfiles) {
      const profiles = state.floatProfiles.getProfiles()
      const profileList = Object.keys(profiles).map(key => {
        const p = profiles[key]
        return `${p.name}: ${p.width}x${p.height}, ${Math.round(p.opacity * 100)}% opacity`
      }).join('\n')
      
      dialog.showMessageBox(windowObj.win, {
        type: 'info',
        title: 'Window Profiles',
        message: 'Available Window Profiles',
        detail: `${profileList}\n\nUse Cmd+1, Cmd+2, Cmd+3 to quickly switch between profiles.\n\nNote: Profile editing will be available in a future update.`,
        buttons: ['OK']
      })
    }
  }
})
```

**Requirements Satisfied**: 9.4, 9.5

---

#### `js/default.js`
**Purpose**: Initialize all modules including Float

**Modifications**:
- [x] Removed floatSettingsUI initialization (line ~172)
- [x] Added comment explaining Float settings dialogs are handled via IPC

**Lines Modified**: 172-173

**Integration Strategy**: Cleanup - Removed unused floatSettingsUI module reference

**Changes Made**:
```javascript
// Float Browser modules
// Note: Float settings dialogs are handled via IPC in main process
```

**Note**: The floatSettingsUI.js file was removed as it's no longer needed. Settings dialogs are now handled directly in the main process via IPC handlers, which is more consistent with Electron best practices and Min's architecture.

---

## Upstream Update Strategy

When pulling updates from Min Browser upstream:

### 1. Safe Files (Low Conflict Risk)
These files are unlikely to conflict with Float modifications:
- Tab management files
- Content rendering files
- Privacy/security files
- Data storage files

**Action**: Merge directly

### 2. Integration Files (Medium Conflict Risk)
These files have Float modifications but are mostly additive:
- `js/browserUI.js`
- `pages/index.html`
- `js/menuRenderer.js`

**Action**: Review changes carefully, ensure Float additions are preserved

### 3. Core Files (High Conflict Risk)
These files have significant Float modifications:
- `main/main.js`
- `package.json`

**Action**: Manual merge required, test thoroughly after merge

### 4. Float-Only Files (No Conflict)
These files are Float-specific and won't conflict:
- `js/float/*`
- `css/float/*`
- `FLOAT_*.md`

**Action**: No merge needed

## Testing After Modifications

After any modification, verify:

1. **Min Features Work**: All original Min Browser features function correctly
2. **Float Features Work**: All Float features function correctly
3. **No Regressions**: No performance or stability issues introduced
4. **Visual Consistency**: Float UI matches Min's design language
5. **Build Success**: Application builds and packages correctly

## Version Tracking

- **Float Browser Version**: 2.0.0
- **Based on Min Browser Version**: 1.35.2 (or latest stable)
- **Last Upstream Sync**: TBD
- **Electron Version**: 38.3.0

## Notes

- All Float code is isolated in `js/float/` and `css/float/` directories
- Modifications to Min files are kept minimal and clearly documented
- Float features are designed to be additive, not replacing Min functionality
- This document should be updated whenever any file is modified or created

---

**Last Updated**: 2025-11-15
**Maintained By**: Float Browser Development Team
