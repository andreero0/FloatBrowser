# Float Browser Architecture

## Overview

Float Browser v2.0 is built by enhancing Min Browser with window management features. The architecture follows a **layered enhancement pattern** where Float features are added as a separate layer on top of Min Browser's core functionality.

**Key Principle**: Float features are additive, not replacements. Min Browser's core remains intact.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Float Browser v2.0                       │
├─────────────────────────────────────────────────────────────┤
│  Float Features Layer (NEW)                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Window      │ │ UI          │ │ Settings &          │   │
│  │ Management  │ │ Controls    │ │ Persistence         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Min Browser Core (EXISTING)              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Tab         │ │ Navigation  │ │ Bookmarks &         │   │
│  │ Management  │ │ & Search    │ │ History             │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Electron Framework                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Main        │ │ Renderer    │ │ IPC                 │   │
│  │ Process     │ │ Process     │ │ Communication       │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Process Architecture

Float Browser follows Electron's multi-process architecture:

### Main Process (Node.js)
- Window management and lifecycle
- Float window manager (opacity, always-on-top, PIP)
- Global shortcuts registration
- IPC handlers for Float features
- Settings persistence
- Menu management

### Renderer Process (Chromium)
- Browser UI (tabs, address bar, etc.)
- Float UI controls (opacity slider, buttons)
- User interactions
- IPC communication with main process


## Module Organization

### Float Modules (New Code)

All Float-specific code is isolated in dedicated directories:

```
js/float/                          # Float JavaScript modules
├── floatWindowManager.js          # Window management (main process)
├── floatSettings.js               # Settings management (main process)
├── floatShortcuts.js              # Global shortcuts (main process)
├── floatProfiles.js               # Window profiles (main process)
├── floatWelcome.js                # Welcome screen (main process)
├── floatControls.js               # UI controls (renderer process)
└── floatMenu.js                   # Menu integration (main process)

css/float/                         # Float stylesheets
└── floatControls.css              # Float UI styles

pages/floatWelcome/                # Float welcome page
├── index.html                     # Welcome screen HTML
├── welcome.css                    # Welcome screen styles
└── welcome.js                     # Welcome screen logic

docs/                              # Float documentation
├── USER_GUIDE.md                  # User documentation
├── SHORTCUTS.md                   # Keyboard shortcuts
└── TROUBLESHOOTING.md             # Troubleshooting guide
```

### Integration Points (Modified Min Files)

Float integrates with Min Browser at specific points:

```
main/main.js                       # Main process initialization
├── Import Float modules
├── Initialize Float settings
├── Create window with transparency
├── Initialize Float managers
├── Register IPC handlers
└── Save state on quit

js/default.js                      # Renderer initialization
└── Initialize Float UI controls

main/menu.js                       # Application menu
└── Insert Float menu

pages/settings/                    # Settings page
├── index.html                     # Add Float settings section
└── settings.js                    # Add Float settings handlers

scripts/                           # Build scripts
├── buildMain.js                   # Include Float modules in build
└── buildBrowserStyles.js          # Include Float CSS in build
```


## Core Components

### 1. FloatWindowManager (Main Process)

**Location**: `js/float/floatWindowManager.js`

**Purpose**: Manages all window-level Float features

**Responsibilities**:
- Control window opacity (30-100%)
- Manage always-on-top behavior
- Handle PIP mode (Picture-in-Picture)
- Save and restore window state
- Validate window operations

**Key APIs**:
```javascript
class FloatWindowManager {
  constructor(browserWindow)
  
  // Opacity control
  setOpacity(value)           // 0.3 to 1.0
  getOpacity()
  
  // Always-on-top control
  setAlwaysOnTop(enabled)
  isAlwaysOnTop()
  
  // PIP mode control
  togglePIPMode()
  isPIPMode()
  
  // State persistence
  saveState(settings)
  restoreState(settings)
}
```

**Integration**: Instantiated in `main/main.js` after window creation

**Dependencies**: 
- Electron BrowserWindow API
- FloatSettings for persistence

---

### 2. FloatSettings (Main Process)

**Location**: `js/float/floatSettings.js`

**Purpose**: Manages Float-specific settings and persistence

**Responsibilities**:
- Store and retrieve Float settings
- Provide default values
- Validate settings data
- Handle settings corruption
- Persist to disk

**Settings Schema**:
```javascript
{
  opacity: 0.95,                    // Current opacity
  defaultOpacity: 0.95,             // Default for new windows
  alwaysOnTop: true,                // Current state
  defaultAlwaysOnTop: true,         // Default for new windows
  globalShortcuts: {                // Keyboard shortcuts
    toggleVisibility: "CommandOrControl+Shift+F",
    toggleAlwaysOnTop: "CommandOrControl+Shift+A",
    togglePIP: "CommandOrControl+Shift+P"
  },
  windowProfiles: {                 // Window size profiles
    small: { name, width, height, opacity, alwaysOnTop },
    medium: { ... },
    large: { ... }
  },
  lastWindowBounds: { width, height, x, y },
  pipBounds: { width, height },
  currentProfile: "medium",
  showWelcome: true                 // Show welcome screen
}
```

**Key APIs**:
```javascript
class FloatSettings {
  constructor(userDataPath)
  
  get(key, defaultValue)
  set(key, value)
  save()
  load()
  resetToDefaults()
}
```

**Integration**: Instantiated early in `main/main.js`

**Storage**: JSON file in user data directory


---

### 3. FloatControls (Renderer Process)

**Location**: `js/float/floatControls.js`

**Purpose**: Provides UI controls for Float features in the browser toolbar

**Responsibilities**:
- Render opacity slider
- Render always-on-top button
- Render PIP mode button
- Handle user interactions
- Communicate with main process via IPC
- Update UI based on state changes

**UI Components**:
1. **Opacity Slider**: Range input (30-100%) with percentage display
2. **Always-On-Top Button**: Toggle button with pin icon
3. **PIP Button**: Toggle button with fit-to-screen icon

**Key APIs**:
```javascript
class FloatControls {
  constructor()
  
  initialize()                      // Create and insert UI
  updateState(state)                // Update UI from state
  destroy()                         // Cleanup
}
```

**Integration**: Initialized in `js/default.js` after Min's UI is ready

**IPC Communication**:
- Sends: `float:set-opacity`, `float:set-always-on-top`, `float:toggle-pip`
- Receives: `float:state-changed` (state updates from main process)

**Styling**: Uses Min's CSS classes for visual consistency

---

### 4. FloatShortcuts (Main Process)

**Location**: `js/float/floatShortcuts.js`

**Purpose**: Manages global keyboard shortcuts for Float features

**Responsibilities**:
- Register global shortcuts with Electron
- Handle shortcut activation
- Apply window profiles via shortcuts
- Gracefully handle registration failures
- Cleanup on app quit

**Shortcuts**:
- `Cmd+Shift+F`: Toggle window visibility
- `Cmd+Shift+A`: Toggle always-on-top
- `Cmd+Shift+P`: Toggle PIP mode
- `Cmd+1/2/3`: Apply window profiles (Small/Medium/Large)

**Key APIs**:
```javascript
class FloatShortcuts {
  constructor(floatWindowManager, browserWindow, floatSettings, floatProfiles)
  
  registerShortcuts()
  unregisterShortcuts()
  updateShortcut(action, accelerator)
  getRegisteredShortcuts()
  getRegistrationErrors()
}
```

**Integration**: Instantiated in `main/main.js` after window creation

**Dependencies**:
- Electron globalShortcut API
- FloatWindowManager for window operations
- FloatProfiles for profile shortcuts


---

### 5. FloatProfiles (Main Process)

**Location**: `js/float/floatProfiles.js`

**Purpose**: Manages window size profiles for quick switching

**Responsibilities**:
- Manage profile CRUD operations
- Apply profiles to window
- Validate profile configurations
- Provide default profiles
- Track current profile

**Default Profiles**:
- **Small**: 400x300, 80% opacity, always-on-top
- **Medium**: 800x600, 90% opacity, always-on-top
- **Large**: 1200x800, 100% opacity, not always-on-top

**Key APIs**:
```javascript
class FloatProfiles {
  constructor(floatWindowManager, browserWindow, floatSettings)
  
  getProfiles()
  getProfile(name)
  createProfile(name, config)
  updateProfile(name, config)
  deleteProfile(name)
  applyProfile(name)                // < 100ms performance requirement
  getCurrentProfile()
  resetToDefaults()
}
```

**Integration**: Instantiated in `main/main.js` after FloatWindowManager

**Dependencies**:
- FloatWindowManager for applying profile settings
- FloatSettings for persistence

---

### 6. FloatMenu (Main Process)

**Location**: `js/float/floatMenu.js`

**Purpose**: Creates Float menu template for application menu

**Responsibilities**:
- Generate menu structure
- Read current window state
- Handle menu item clicks
- Rebuild menu after state changes
- Support dynamic profiles

**Menu Structure**:
```
Float
├── Always on Top (checkbox) [Cmd+Shift+A]
├── Picture-in-Picture Mode [Cmd+Shift+P]
├── ─────────────
├── Opacity ▸
│   ├── 100% (radio)
│   ├── 90% (radio)
│   ├── 80% (radio)
│   ├── 70% (radio)
│   └── 50% (radio)
├── ─────────────
└── Window Profiles ▸
    ├── Small [Cmd+1]
    ├── Medium [Cmd+2]
    ├── Large [Cmd+3]
    ├── ───────────── (if custom profiles exist)
    ├── Custom Profile 1
    ├── Custom Profile 2
    ├── ─────────────
    └── Manage Profiles...
```

**Key APIs**:
```javascript
function createFloatMenuTemplate(options) {
  // options: { window, sendIPCToWindow }
  // Returns: menu template object or null
}
```

**Integration**: Called from `main/menu.js` during menu building

**State Synchronization**: Menu rebuilds after state changes to update checkboxes/radio buttons


---

### 7. FloatWelcome (Main Process)

**Location**: `js/float/floatWelcome.js`

**Purpose**: Manages welcome screen for first-time users

**Responsibilities**:
- Check if welcome should be shown
- Create welcome window
- Handle "Don't show again" preference
- Provide Float features overview

**Key APIs**:
```javascript
class FloatWelcome {
  static checkAndShowWelcome(parentWindow, floatSettings)
  static showWelcome(parentWindow)
}
```

**Integration**: Called in `main/main.js` after window creation

**Welcome Content**:
- Float Browser introduction
- Key features overview
- Keyboard shortcuts reference
- "Don't show again" checkbox

---

## Data Flow

### Opacity Change Flow

```
User moves slider in UI
    ↓
FloatControls.onOpacityChange()
    ↓
IPC: ipcRenderer.invoke('float:set-opacity', value)
    ↓
Main Process IPC Handler
    ↓
FloatWindowManager.setOpacity(value)
    ↓
BrowserWindow.setOpacity(value)
    ↓
FloatSettings.set('opacity', value)
    ↓
FloatSettings.save()
    ↓
IPC: 'float:state-changed' event to renderer
    ↓
FloatControls.updateState()
    ↓
UI updates to reflect new state
```

### Always-On-Top Toggle Flow

```
User clicks button in UI (or uses Cmd+Shift+A)
    ↓
FloatControls.onAlwaysOnTopClick() OR FloatShortcuts handler
    ↓
IPC: ipcRenderer.invoke('float:set-always-on-top', enabled)
    ↓
Main Process IPC Handler
    ↓
FloatWindowManager.setAlwaysOnTop(enabled)
    ↓
BrowserWindow.setAlwaysOnTop(enabled, 'floating')
    ↓
FloatSettings.set('alwaysOnTop', enabled)
    ↓
FloatSettings.save()
    ↓
Menu rebuilds to update checkbox
    ↓
IPC: 'float:state-changed' event to renderer
    ↓
FloatControls.updateState()
    ↓
UI button updates to reflect new state
```


### PIP Mode Toggle Flow

```
User clicks PIP button (or uses Cmd+Shift+P)
    ↓
FloatControls.onPIPClick() OR FloatShortcuts handler
    ↓
IPC: ipcRenderer.invoke('float:toggle-pip')
    ↓
Main Process IPC Handler
    ↓
FloatWindowManager.togglePIPMode()
    ↓
Check current state
    ↓
If not in PIP:
  - Save current bounds to settings
  - Set window bounds to 400x300
  - Set isPIP = true
If in PIP:
  - Restore saved bounds from settings
  - Set isPIP = false
    ↓
FloatSettings.save()
    ↓
IPC: 'float:state-changed' event to renderer
    ↓
FloatControls.updateState()
    ↓
UI button updates to reflect new state
```

### Window Profile Application Flow

```
User selects profile from menu (or uses Cmd+1/2/3)
    ↓
Menu click handler OR FloatShortcuts handler
    ↓
IPC: ipcRenderer.invoke('float:apply-profile', profileName)
    ↓
Main Process IPC Handler
    ↓
FloatProfiles.applyProfile(profileName)
    ↓
Get profile configuration
    ↓
Update window bounds (preserving position)
    ↓
FloatWindowManager.setOpacity(profile.opacity)
    ↓
FloatWindowManager.setAlwaysOnTop(profile.alwaysOnTop)
    ↓
FloatSettings.set('currentProfile', profileName)
    ↓
FloatSettings.save()
    ↓
Performance check (log warning if > 100ms)
    ↓
IPC: 'float:state-changed' event to renderer
    ↓
FloatControls.updateState()
    ↓
UI updates to reflect new state
```

### Settings Persistence Flow

```
Application startup
    ↓
FloatSettings.load()
    ↓
Read settings from JSON file
    ↓
FloatWindowManager.restoreState(settings)
    ↓
Apply saved opacity, always-on-top, bounds
    ↓
FloatProfiles loads saved profiles
    ↓
FloatShortcuts registers shortcuts
    ↓
UI initializes with current state

Application quit
    ↓
'before-quit' event
    ↓
FloatWindowManager.saveState(settings)
    ↓
Save current opacity, always-on-top, bounds
    ↓
FloatSettings.save()
    ↓
Write settings to JSON file
```


## IPC Communication

Float Browser uses Electron's IPC (Inter-Process Communication) for communication between main and renderer processes.

### IPC Handlers (Main Process)

Registered in `main/main.js`:

```javascript
// Opacity control
ipc.handle('float:set-opacity', (event, opacity) => { ... })
ipc.handle('float:get-opacity', (event) => { ... })

// Always-on-top control
ipc.handle('float:set-always-on-top', (event, enabled) => { ... })
ipc.handle('float:get-always-on-top', (event) => { ... })

// PIP mode control
ipc.handle('float:toggle-pip', (event) => { ... })
ipc.handle('float:get-pip-state', (event) => { ... })

// Profile management
ipc.handle('float:get-profiles', (event) => { ... })
ipc.handle('float:apply-profile', (event, profileName) => { ... })
ipc.handle('float:create-profile', (event, name, config) => { ... })
ipc.handle('float:update-profile', (event, name, config) => { ... })
ipc.handle('float:delete-profile', (event, name) => { ... })

// Settings dialogs
ipc.handle('openFloatShortcutsDialog', (event) => { ... })
ipc.handle('openFloatProfilesDialog', (event) => { ... })

// Welcome screen
ipc.handle('get-setting', (event, key) => { ... })
ipc.handle('set-setting', (event, key, value) => { ... })
```

### IPC Events (Renderer Process)

Listened to in `js/float/floatControls.js` and `js/menuRenderer.js`:

```javascript
// State change notifications
ipc.on('float:state-changed', (event, state) => {
  // Update UI to reflect new state
})
```

### IPC Flow Pattern

Float Browser follows this pattern for IPC communication:

1. **Renderer → Main (Request)**:
   ```javascript
   const result = await ipcRenderer.invoke('float:set-opacity', 0.8)
   ```

2. **Main Process (Handle)**:
   ```javascript
   ipc.handle('float:set-opacity', (event, opacity) => {
     floatManager.setOpacity(opacity)
     return { success: true }
   })
   ```

3. **Main → Renderer (Notify)**:
   ```javascript
   mainWindow.webContents.send('float:state-changed', {
     opacity: 0.8,
     alwaysOnTop: true,
     isPIP: false
   })
   ```

4. **Renderer (Update UI)**:
   ```javascript
   ipc.on('float:state-changed', (event, state) => {
     updateUI(state)
   })
   ```


## Build System

Float Browser uses Min Browser's build system with Float-specific additions.

### Build Scripts

Located in `scripts/` directory:

1. **`buildMain.js`**: Concatenates main process modules
   - Includes Float modules: floatSettings, floatWindowManager, floatShortcuts, floatProfiles, floatWelcome
   - Output: `main.build.js`

2. **`buildBrowser.js`**: Browserifies renderer process code
   - Includes Float modules via require() statements
   - Output: `dist/bundle.js`

3. **`buildBrowserStyles.js`**: Concatenates CSS files
   - Includes `css/float/floatControls.css`
   - Output: `dist/bundle.css`

4. **`buildPreload.js`**: Bundles preload scripts
   - No Float-specific changes

### Build Order

```
1. buildLocalization.js      # Build localization
2. buildMain.js               # Build main process (includes Float)
3. buildBrowser.js            # Build renderer process (includes Float)
4. buildBrowserStyles.js      # Build CSS (includes Float)
5. buildPreload.js            # Build preload scripts
```

### Build Commands

```bash
# Development
npm run start                 # Build and start with hot reload
npm run watch                 # Watch for file changes

# Production
npm run build                 # Build all components
npm run buildMacIntel         # Build macOS Intel
npm run buildMacArm           # Build macOS ARM
```

### Module Concatenation

Float modules are concatenated into `main.build.js` in this order:

```javascript
const modules = [
  'dist/localization.build.js',
  'main/windowManagement.js',
  'js/util/keyMap.js',
  'main/menu.js',
  'main/touchbar.js',
  'main/registryConfig.js',
  'js/util/settings/settingsMain.js',
  'js/float/floatSettings.js',        // Float
  'js/float/floatWindowManager.js',   // Float
  'js/float/floatShortcuts.js',       // Float
  'js/float/floatProfiles.js',        // Float
  'js/float/floatWelcome.js',         // Float
  'main/main.js',
  // ... rest of modules
]
```

**Important**: Float modules must be included before `main/main.js` so they're available when main.js initializes.


## State Management

### Window State

Managed by FloatWindowManager and persisted via FloatSettings:

```javascript
{
  opacity: 0.95,                    // Current opacity (0.3-1.0)
  alwaysOnTop: true,                // Always-on-top state
  isPIP: false,                     // PIP mode state
  lastWindowBounds: {               // Saved bounds for PIP restore
    width: 1000,
    height: 700,
    x: 100,
    y: 100
  },
  pipBounds: {                      // PIP mode bounds
    width: 400,
    height: 300
  }
}
```

### Settings State

Managed by FloatSettings and persisted to disk:

```javascript
{
  defaultOpacity: 0.95,             // Default for new windows
  defaultAlwaysOnTop: true,         // Default for new windows
  globalShortcuts: {                // Keyboard shortcuts
    toggleVisibility: "CommandOrControl+Shift+F",
    toggleAlwaysOnTop: "CommandOrControl+Shift+A",
    togglePIP: "CommandOrControl+Shift+P"
  },
  windowProfiles: {                 // Window profiles
    small: { name, width, height, opacity, alwaysOnTop },
    medium: { ... },
    large: { ... },
    custom1: { ... }                // User-created profiles
  },
  currentProfile: "medium",         // Currently active profile
  showWelcome: true                 // Show welcome screen
}
```

### State Persistence

**Save Triggers**:
- Window state saved on `before-quit` event
- Settings saved immediately after changes
- Auto-save every 30 seconds (requirement 12.4)

**Load Triggers**:
- Settings loaded on app startup
- Window state restored after window creation

**Storage Location**:
- macOS: `~/Library/Application Support/Float Browser/settings.json`
- Windows: `%APPDATA%/Float Browser/settings.json`
- Linux: `~/.config/Float Browser/settings.json`

### State Synchronization

State is synchronized across:
1. **Main Process**: FloatWindowManager, FloatSettings
2. **Renderer Process**: FloatControls UI
3. **Menu**: Float menu checkboxes and radio buttons

**Synchronization Flow**:
```
State Change
    ↓
Update FloatWindowManager
    ↓
Save to FloatSettings
    ↓
Send IPC event to renderer
    ↓
Update FloatControls UI
    ↓
Rebuild menu (if menu-triggered)
```


## Error Handling

Float Browser implements comprehensive error handling at multiple levels:

### Window Management Errors

```javascript
try {
  mainWindow.setOpacity(opacity)
} catch (error) {
  console.error('Failed to set opacity:', error)
  // Revert to previous value
  floatSettings.set('opacity', previousOpacity)
  // Notify user (optional)
  showNotification('Failed to change opacity', 'error')
}
```

### Settings Corruption

```javascript
try {
  const settings = floatSettings.load()
} catch (error) {
  console.error('Settings corrupted:', error)
  // Reset to defaults
  floatSettings.resetToDefaults()
  // Notify user
  showNotification('Settings reset to defaults', 'warning')
}
```

### Shortcut Registration Failures

```javascript
try {
  globalShortcut.register(accelerator, callback)
} catch (error) {
  console.error('Failed to register shortcut:', error)
  // Continue without shortcut
  // Track error for user feedback
  floatSettings.set('shortcutErrors', [...errors, { accelerator, error }])
}
```

### IPC Communication Errors

```javascript
ipc.handle('float:set-opacity', async (event, opacity) => {
  try {
    floatManager.setOpacity(opacity)
    return { success: true }
  } catch (error) {
    console.error('IPC handler error:', error)
    return { success: false, error: error.message }
  }
})
```

### Graceful Degradation

Float Browser is designed to continue operating even if some features fail:

- **Shortcut registration fails**: App continues without global shortcuts
- **Opacity setting fails**: App reverts to previous opacity
- **Profile application fails**: App logs error and continues
- **Settings corruption**: App resets to defaults and continues


## Performance Considerations

### Opacity Changes

**Requirement**: Opacity changes must complete within 50ms

**Implementation**:
- Direct Electron API call (no throttling needed)
- No layout recalculations triggered
- Minimal state updates

**Measurement**:
```javascript
const start = Date.now()
mainWindow.setOpacity(opacity)
const duration = Date.now() - start
if (duration > 50) {
  console.warn(`Opacity change took ${duration}ms (> 50ms threshold)`)
}
```

### Profile Application

**Requirement**: Profile application must complete within 100ms

**Implementation**:
- Batch window updates (bounds, opacity, always-on-top)
- Single settings save operation
- Performance tracking with warnings

**Measurement**:
```javascript
const start = Date.now()
applyProfile(profileName)
const duration = Date.now() - start
if (duration > 100) {
  console.warn(`Profile application took ${duration}ms (> 100ms threshold)`)
}
```

### Memory Usage

**Requirement**: Memory usage within 10% of Min Browser baseline

**Implementation**:
- Minimal state storage (< 1KB per window)
- No memory leaks in event listeners
- Proper cleanup on window close

**Monitoring**:
```javascript
const baseline = process.memoryUsage().heapUsed
// ... Float features running ...
const current = process.memoryUsage().heapUsed
const increase = ((current - baseline) / baseline) * 100
if (increase > 10) {
  console.warn(`Memory usage increased by ${increase}% (> 10% threshold)`)
}
```

### Startup Time

**Requirement**: Startup time within 500ms of Min Browser baseline

**Implementation**:
- Lazy loading of Float modules
- Minimal initialization overhead
- Parallel loading where possible

**Optimization**:
- Float modules loaded after Min's core
- Settings loaded asynchronously
- UI initialization deferred until after window shown


## Testing Strategy

### Unit Tests

Located in `tests/` directory:

1. **`floatWindowManager.test.js`**: Tests FloatWindowManager
   - Opacity validation (0.3-1.0)
   - Always-on-top toggle
   - PIP mode toggle
   - State persistence

2. **`floatSettings.test.js`**: Tests FloatSettings
   - Get/set methods
   - Default values
   - Validation
   - Corrupted settings handling

3. **`floatProfiles.test.js`**: Tests FloatProfiles
   - Profile CRUD operations
   - Profile application
   - Default profiles
   - Validation

### Integration Tests

Located in `tests/integration/` directory:

1. **`minFeatures.test.js`**: Tests Min Browser features
   - Ensures no regressions
   - Tests tab management, bookmarks, history, etc.

2. **`uiIntegration.test.js`**: Tests UI integration
   - Float controls appear correctly
   - Visual consistency with Min
   - Responsive design

3. **`performance.test.js`**: Tests performance
   - Opacity change < 50ms
   - Profile application < 100ms
   - Memory usage < 10% increase
   - Startup time < 500ms increase

4. **`compatibility.test.js`**: Tests compatibility
   - Multiple monitors
   - macOS Spaces
   - Fullscreen apps

### Manual Testing

Documented in `MANUAL_TESTING_GUIDE.md`:

- All Float features end-to-end
- All Min features for regressions
- Error scenarios
- Edge cases

### Test Execution

```bash
# Run all unit tests
npm test

# Run specific test
node tests/floatWindowManager.test.js

# Run all integration tests
node tests/integration/runAll.js

# Run specific integration test
node tests/integration/performance.test.js
```


## Security Considerations

### Code Signing

Float Browser must be code-signed for macOS distribution:

**Requirements**:
- Valid Apple Developer certificate
- Entitlements for window management
- Notarization for Gatekeeper

**Entitlements**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
</dict>
</plist>
```

### Settings Security

**Settings File Protection**:
- Stored in user's application support directory
- Not world-readable
- Validated on load to prevent injection

**Validation**:
```javascript
function validateSettings(settings) {
  // Validate opacity range
  if (settings.opacity < 0.3 || settings.opacity > 1.0) {
    throw new Error('Invalid opacity value')
  }
  
  // Validate window bounds
  if (settings.lastWindowBounds.width < 1 || settings.lastWindowBounds.width > 10000) {
    throw new Error('Invalid window width')
  }
  
  // Validate boolean values
  if (typeof settings.alwaysOnTop !== 'boolean') {
    throw new Error('Invalid alwaysOnTop value')
  }
  
  return true
}
```

### IPC Security

**Handler Validation**:
- All IPC handlers validate input
- Type checking on all parameters
- Range checking on numeric values
- No arbitrary code execution

**Example**:
```javascript
ipc.handle('float:set-opacity', (event, opacity) => {
  // Validate input
  if (typeof opacity !== 'number') {
    throw new Error('Opacity must be a number')
  }
  if (opacity < 0.3 || opacity > 1.0) {
    throw new Error('Opacity must be between 0.3 and 1.0')
  }
  
  // Safe to proceed
  floatManager.setOpacity(opacity)
})
```


## Deployment Architecture

### Distribution Packages

Float Browser is distributed as:

1. **macOS DMG** (Intel and ARM):
   - Universal binary (x64 + ARM64)
   - Code-signed and notarized
   - Drag-to-Applications installer

2. **Future Platforms** (not currently supported):
   - Windows installer
   - Linux packages (Debian, RPM, AppImage)

### Build Configuration

**package.json**:
```json
{
  "name": "float-browser",
  "productName": "Float Browser",
  "version": "2.0.0",
  "description": "A transparent, always-on-top browser based on Min Browser",
  "build": {
    "appId": "com.floatbrowser.app",
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg"],
      "arch": ["x64", "arm64"]
    }
  }
}
```

### Update Strategy

Float Browser does not currently implement auto-updates. Users must manually download new versions.

**Future Enhancement**: Implement Electron's autoUpdater for seamless updates.

## Maintenance Architecture

### Code Organization Principles

1. **Isolation**: Float code in separate directories (`js/float/`, `css/float/`)
2. **Documentation**: All modifications documented in `FLOAT_MODIFICATIONS.md`
3. **Minimal Changes**: Modifications to Min files kept minimal
4. **Clear Integration**: Integration points clearly marked with comments

### Upstream Sync Strategy

**Process**:
1. Fetch upstream Min Browser changes
2. Review changelog and commits
3. Merge changes into Float Browser
4. Resolve conflicts (documented in `MIN_UPDATE_GUIDE.md`)
5. Test thoroughly
6. Update version tracking

**Conflict Resolution**:
- High-risk files: `main/main.js`, `package.json`
- Medium-risk files: `js/browserUI.js`, `main/menu.js`, settings files
- Low-risk files: Most Min Browser core files

### Version Tracking

**Float Browser Version**: `2.x.x`
- Major: Breaking changes to Float features
- Minor: New Float features
- Patch: Bug fixes

**Min Browser Version**: Tracked in `package.json`:
```json
{
  "float": {
    "basedOn": "Min Browser v1.35.2",
    "upstream": "https://github.com/minbrowser/min",
    "lastSync": "2025-11-16"
  }
}
```


## Architecture Diagrams

### Component Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                      Main Process                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ FloatSettings│◄────────┤ main.js      │                 │
│  └──────┬───────┘         └──────┬───────┘                 │
│         │                        │                          │
│         │                        │                          │
│         ▼                        ▼                          │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │FloatWindow   │◄────────┤BrowserWindow │                 │
│  │Manager       │         │              │                 │
│  └──────┬───────┘         └──────────────┘                 │
│         │                                                   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │FloatProfiles │         │FloatShortcuts│                 │
│  └──────────────┘         └──────────────┘                 │
│         │                        │                          │
│         │                        │                          │
│         └────────────┬───────────┘                          │
│                      │                                      │
│                      ▼                                      │
│               ┌──────────────┐                              │
│               │ FloatMenu    │                              │
│               └──────────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ IPC
                       │
┌─────────────────────────────────────────────────────────────┐
│                    Renderer Process                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ default.js   │────────►│FloatControls │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                  │                          │
│                                  │                          │
│                                  ▼                          │
│                           ┌──────────────┐                  │
│                           │ DOM Elements │                  │
│                           │ - Slider     │                  │
│                           │ - Buttons    │                  │
│                           └──────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Action                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  UI Event Handler      │
         │  (FloatControls)       │
         └────────────┬───────────┘
                      │
                      │ IPC invoke
                      ▼
         ┌────────────────────────┐
         │  IPC Handler           │
         │  (main/main.js)        │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  FloatWindowManager    │
         │  - Update window       │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  FloatSettings         │
         │  - Persist state       │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  IPC send              │
         │  'float:state-changed' │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  FloatControls         │
         │  - Update UI           │
         └────────────────────────┘
```


### File Organization Diagram

```
float-browser-min/
│
├── js/
│   ├── float/                     # Float modules (NEW)
│   │   ├── floatWindowManager.js  # Window management
│   │   ├── floatSettings.js       # Settings persistence
│   │   ├── floatShortcuts.js      # Global shortcuts
│   │   ├── floatProfiles.js       # Window profiles
│   │   ├── floatWelcome.js        # Welcome screen
│   │   ├── floatControls.js       # UI controls
│   │   └── floatMenu.js           # Menu integration
│   │
│   ├── browserUI.js               # Modified (imports FloatControls)
│   ├── default.js                 # Modified (initializes Float)
│   ├── menuRenderer.js            # Modified (Float IPC)
│   └── ... (Min Browser files)
│
├── css/
│   ├── float/                     # Float styles (NEW)
│   │   └── floatControls.css      # Float UI styles
│   └── ... (Min Browser CSS)
│
├── main/
│   ├── main.js                    # Modified (Float initialization)
│   ├── menu.js                    # Modified (Float menu)
│   └── ... (Min Browser main files)
│
├── pages/
│   ├── floatWelcome/              # Float welcome page (NEW)
│   │   ├── index.html
│   │   ├── welcome.css
│   │   └── welcome.js
│   │
│   ├── settings/
│   │   ├── index.html             # Modified (Float settings)
│   │   └── settings.js            # Modified (Float handlers)
│   └── ... (Min Browser pages)
│
├── docs/                          # Float documentation (NEW)
│   ├── USER_GUIDE.md
│   ├── SHORTCUTS.md
│   └── TROUBLESHOOTING.md
│
├── scripts/
│   ├── buildMain.js               # Modified (Float modules)
│   └── buildBrowserStyles.js      # Modified (Float CSS)
│
├── tests/                         # Float tests (NEW)
│   ├── floatWindowManager.test.js
│   ├── floatSettings.test.js
│   ├── floatProfiles.test.js
│   └── integration/
│       ├── minFeatures.test.js
│       ├── uiIntegration.test.js
│       ├── performance.test.js
│       └── compatibility.test.js
│
├── FLOAT_MODIFICATIONS.md         # Modification tracking (NEW)
├── MIN_UPDATE_GUIDE.md            # Update guide (NEW)
├── FLOAT_ARCHITECTURE.md          # This file (NEW)
├── package.json                   # Modified (Float metadata)
└── README.md                      # Modified (Float description)
```

## Future Enhancements

### Planned Features

1. **Cloud Sync**:
   - Sync Float settings across devices
   - Sync window profiles
   - Architecture: Add sync service module

2. **Advanced Window Management**:
   - Window tiling and snapping
   - Multi-monitor profile support
   - Per-monitor opacity settings
   - Architecture: Extend FloatWindowManager

3. **Conditional Profiles**:
   - Time-based profile switching
   - App-based profile switching
   - URL-based profile switching
   - Architecture: Add FloatAutomation module

4. **Custom Themes**:
   - Float-specific visual themes
   - Theme marketplace
   - Architecture: Add FloatThemes module

5. **Shortcuts Customization**:
   - Full UI for shortcut customization
   - Conflict detection
   - Import/export shortcuts
   - Architecture: Enhance FloatShortcuts

6. **Profile Management UI**:
   - Full UI for profile creation/editing
   - Profile import/export
   - Profile sharing
   - Architecture: Add FloatProfilesUI module

### Architecture Extensibility

The current architecture supports future enhancements through:

1. **Modular Design**: New features can be added as new modules in `js/float/`
2. **IPC Pattern**: New features can add IPC handlers following existing patterns
3. **Settings System**: New settings can be added to FloatSettings schema
4. **Menu Integration**: New menu items can be added to FloatMenu
5. **UI Integration**: New UI controls can be added to FloatControls

### Extension Points

Future developers can extend Float Browser at these points:

1. **Window Management**: Extend FloatWindowManager with new window operations
2. **UI Controls**: Add new controls to FloatControls
3. **Settings**: Add new settings to FloatSettings schema
4. **Shortcuts**: Add new shortcuts to FloatShortcuts
5. **Profiles**: Add new profile types to FloatProfiles
6. **Menu**: Add new menu items to FloatMenu

## Summary

Float Browser's architecture is designed with these principles:

1. **Separation**: Float code isolated from Min Browser core
2. **Integration**: Clean integration points with Min Browser
3. **Maintainability**: Easy to update Min Browser upstream
4. **Extensibility**: Easy to add new Float features
5. **Performance**: Minimal overhead on Min Browser
6. **Reliability**: Comprehensive error handling
7. **Security**: Validated inputs and secure settings

The architecture enables Float Browser to provide powerful window management features while maintaining the excellent user experience of Min Browser.

---

**Last Updated**: 2025-11-16
**Maintained By**: Float Browser Development Team
**Version**: 2.0.0
**Based On**: Min Browser v1.35.2
