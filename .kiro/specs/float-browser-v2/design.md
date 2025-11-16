# Float Browser v2.0 - Design Document

## Overview

Float Browser v2.0 is built by **enhancing Min Browser** with window management features. The design follows an **additive approach** - we add Float-specific functionality to Min Browser without modifying its core architecture. This ensures we can pull upstream updates from Min Browser while maintaining our custom features.

**Base Platform**: Min Browser v1.35.2 (or latest stable)  
**Target Location**: `/Users/aero/float-browser-min`  
**Architecture Pattern**: Layered enhancement over Min Browser  
**Integration Strategy**: Additive modules with minimal core modifications

---

## Critical Design Principle: UI Consistency

**IMPORTANT**: All Float features MUST be fully integrated into Min's existing UI. Float controls should look and feel like they were always part of Min Browser.

### UI Integration Rules

1. **Use Min's CSS Classes**: Float controls use Min's existing CSS classes, not custom ones
2. **Match Min's Visual Style**: Colors, spacing, fonts, icons must match Min exactly
3. **Follow Min's Patterns**: Use Min's helper functions for creating UI elements
4. **Consistent Interactions**: Hover effects, click behaviors, animations match Min
5. **No Disconnected UI**: Float features appear in Min's toolbar, menus, and settings - not in separate windows or panels

### What This Means

- **Toolbar**: Float controls (opacity slider, always-on-top button, PIP button) are inserted into Min's existing navbar using Min's button and control styles
- **Menu**: Float menu items use Min's menu structure and styling
- **Settings**: Float settings use Min's settings panel layout and control styles
- **Notifications**: Float notifications use Min's notification system (if exists)

### Implementation Approach

1. **Study Min's code first**: Before implementing any Float UI, study how Min creates its toolbar, menus, and settings
2. **Reuse Min's functions**: Use Min's existing functions for creating buttons, sliders, menu items, etc.
3. **Extend, don't replace**: Add to Min's UI, don't create parallel UI systems
4. **Test visual consistency**: Float controls should be indistinguishable from Min's native controls

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Float Browser v2.0                       │
├─────────────────────────────────────────────────────────────┤
│  Float Features Layer (NEW)                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Transparency│ │ Always-On-  │ │ Window Profiles &   │   │
│  │ Manager     │ │ Top Manager │ │ PIP Manager         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Min Browser Core (EXISTING)              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Tab         │ │ Navigation  │ │ Bookmarks &         │   │
│  │ Management  │ │ & Address   │ │ History             │   │
│  │             │ │ Bar         │ │                     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Electron Framework                       │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

```
Float UI Controls ──IPC──> Main Process ──API──> Window Manager
       │                        │                      │
       │                        │                      ▼
       │                        │              Electron BrowserWindow
       │                        │                      │
       ▼                        ▼                      ▼
   Settings UI ────────> Float Settings ────> Persistence Layer
```

---

## Module Design

### Float-Specific Modules (NEW)

All Float-specific code will be in dedicated directories to maintain separation from Min Browser code:

```
js/float/
├── floatWindowManager.js    # Main window management (transparency, always-on-top, PIP)
├── floatControls.js          # UI controls for Float features
├── floatSettings.js          # Settings management for Float features
├── floatShortcuts.js         # Global keyboard shortcuts
├── floatProfiles.js          # Window size profiles
└── floatMenu.js              # Float menu integration

css/float/
├── floatControls.css         # Styles for Float UI controls
└── floatIntegration.css      # Integration styles for Min UI

localization/float/
└── en.json                   # Float-specific strings
```

---

## Component Specifications

### 1. Float Window Manager (`js/float/floatWindowManager.js`)

**Purpose**: Manages all window-level Float features

**Responsibilities**:
- Window transparency control
- Always-on-top behavior
- PIP mode toggling
- Window state persistence

**Key Methods**:
```javascript
class FloatWindowManager {
  constructor(browserWindow)
  
  // Transparency
  setOpacity(value)           // value: 0.3 to 1.0
  getOpacity()
  
  // Always-on-top
  setAlwaysOnTop(enabled)
  isAlwaysOnTop()
  
  // PIP Mode
  togglePIPMode()
  isPIPMode()
  
  // State management
  saveState()
  restoreState()
}
```

**Integration Point**: Called from Min's main process window creation

---

### 2. Float Controls UI (`js/float/floatControls.js`)

**Purpose**: Provides UI controls for Float features **integrated into Min's existing toolbar**

**Design Principle**: Float controls MUST match Min's visual design language exactly - same colors, same spacing, same interaction patterns. Users should feel these controls are native to Min Browser, not added on.

**Responsibilities**:
- Render opacity slider matching Min's control style
- Render always-on-top toggle matching Min's button style
- Render PIP mode toggle matching Min's button style
- Handle user interactions using Min's event patterns
- Update UI based on state changes using Min's update mechanisms

**UI Integration Strategy**:
Float controls are inserted into Min's existing navbar, using Min's CSS classes and styling:

```html
<!-- Inserted into Min's existing navbar -->
<div class="navbar-controls float-controls">
  <!-- Opacity Control - styled like Min's controls -->
  <div class="navbar-control opacity-control">
    <input type="range" id="float-opacity" class="navbar-slider" 
           min="30" max="100" value="100">
    <span class="navbar-label">100%</span>
  </div>
  
  <!-- Always-on-Top Toggle - styled like Min's buttons -->
  <button id="float-always-on-top" class="navbar-button" 
          title="Always on Top (Cmd+Shift+A)">
    <i class="fa fa-thumbtack"></i>
  </button>
  
  <!-- PIP Mode Toggle - styled like Min's buttons -->
  <button id="float-pip" class="navbar-button" 
          title="Picture-in-Picture (Cmd+Shift+P)">
    <i class="fa fa-compress"></i>
  </button>
</div>
```

**CSS Integration**: Float controls use Min's existing CSS classes:
- `.navbar-controls` - Min's control container class
- `.navbar-control` - Min's individual control class
- `.navbar-button` - Min's button style
- `.navbar-slider` - Min's slider style (if exists, or create matching style)
- `.navbar-label` - Min's label style

**Integration Point**: Injected into Min's navbar after Min's initialization, positioned logically with other controls

---

### 3. Float Settings (`js/float/floatSettings.js`)

**Purpose**: Manages Float-specific settings and persistence

**Settings Schema**:
```javascript
{
  "float": {
    "opacity": 0.95,
    "defaultOpacity": 0.95,
    "alwaysOnTop": true,
    "defaultAlwaysOnTop": true,
    "globalShortcuts": {
      "toggleVisibility": "CommandOrControl+Shift+F",
      "toggleAlwaysOnTop": "CommandOrControl+Shift+A",
      "togglePIP": "CommandOrControl+Shift+P"
    },
    "windowProfiles": {
      "small": {
        "name": "Small",
        "width": 400,
        "height": 300,
        "opacity": 0.8,
        "alwaysOnTop": true
      },
      "medium": {
        "name": "Medium",
        "width": 800,
        "height": 600,
        "opacity": 0.9,
        "alwaysOnTop": true
      },
      "large": {
        "name": "Large",
        "width": 1200,
        "height": 800,
        "opacity": 1.0,
        "alwaysOnTop": false
      }
    },
    "lastWindowBounds": {
      "width": 1000,
      "height": 700,
      "x": 100,
      "y": 100
    },
    "pipBounds": {
      "width": 400,
      "height": 300
    }
  }
}
```

**Integration Point**: Extends Min's existing settings system

---

### 4. Float Shortcuts (`js/float/floatShortcuts.js`)

**Purpose**: Registers and manages global keyboard shortcuts

**Key Methods**:
```javascript
class FloatShortcuts {
  constructor(floatWindowManager)
  
  registerShortcuts()
  unregisterShortcuts()
  updateShortcut(action, accelerator)
}
```

**Shortcuts**:
- `Cmd+Shift+F`: Toggle window visibility
- `Cmd+Shift+A`: Toggle always-on-top
- `Cmd+Shift+P`: Toggle PIP mode
- `Cmd+1/2/3`: Apply window profiles

**Integration Point**: Registered in main process after app ready

---

### 5. Float Profiles (`js/float/floatProfiles.js`)

**Purpose**: Manages window size profiles

**Key Methods**:
```javascript
class FloatProfiles {
  constructor(floatWindowManager, floatSettings)
  
  getProfiles()
  getProfile(name)
  applyProfile(name)
  createProfile(name, config)
  deleteProfile(name)
  updateProfile(name, config)
}
```

**Integration Point**: Called from menu and keyboard shortcuts

---

### 6. Float Menu (`js/float/floatMenu.js`)

**Purpose**: Adds Float-specific menu items to Min's menu

**Menu Structure**:
```javascript
{
  label: 'Float',
  submenu: [
    {
      label: 'Always on Top',
      type: 'checkbox',
      accelerator: 'CmdOrCtrl+Shift+A',
      checked: true,
      click: () => toggleAlwaysOnTop()
    },
    {
      label: 'Picture-in-Picture Mode',
      accelerator: 'CmdOrCtrl+Shift+P',
      click: () => togglePIP()
    },
    { type: 'separator' },
    {
      label: 'Opacity',
      submenu: [
        { label: '100%', click: () => setOpacity(1.0) },
        { label: '90%', click: () => setOpacity(0.9) },
        { label: '80%', click: () => setOpacity(0.8) },
        { label: '70%', click: () => setOpacity(0.7) },
        { label: '50%', click: () => setOpacity(0.5) }
      ]
    },
    { type: 'separator' },
    {
      label: 'Window Profiles',
      submenu: [
        { label: 'Small', accelerator: 'CmdOrCtrl+1', click: () => applyProfile('small') },
        { label: 'Medium', accelerator: 'CmdOrCtrl+2', click: () => applyProfile('medium') },
        { label: 'Large', accelerator: 'CmdOrCtrl+3', click: () => applyProfile('large') },
        { type: 'separator' },
        { label: 'Manage Profiles...', click: () => openProfileManager() }
      ]
    }
  ]
}
```

**Integration Point**: Inserted into Min's menu template

---

## Integration Strategy

### Main Process Integration

**File**: `main/main.js` (Min's main process file)

**Modifications**:

1. **Import Float modules**:
```javascript
const FloatWindowManager = require('../js/float/floatWindowManager');
const FloatShortcuts = require('../js/float/floatShortcuts');
const FloatSettings = require('../js/float/floatSettings');
```

2. **Enhance window creation**:
```javascript
function createWindow() {
  const mainWindow = new BrowserWindow({
    // ... Min's existing config ...
    
    // Float enhancements
    transparent: true,
    opacity: FloatSettings.get('opacity', 0.95),
    backgroundColor: '#00000000'
  });
  
  // Initialize Float features
  const floatManager = new FloatWindowManager(mainWindow);
  floatManager.restoreState();
  
  // Register global shortcuts
  const floatShortcuts = new FloatShortcuts(floatManager);
  floatShortcuts.registerShortcuts();
  
  return mainWindow;
}
```

3. **Add IPC handlers**:
```javascript
// Float-specific IPC handlers
ipcMain.handle('float:set-opacity', (event, opacity) => {
  floatManager.setOpacity(opacity);
});

ipcMain.handle('float:set-always-on-top', (event, enabled) => {
  floatManager.setAlwaysOnTop(enabled);
});

ipcMain.handle('float:toggle-pip', () => {
  return floatManager.togglePIPMode();
});

ipcMain.handle('float:apply-profile', (event, profileName) => {
  floatProfiles.applyProfile(profileName);
});
```

---

### Renderer Process Integration

**File**: `js/browserUI.js` (Min's main UI controller)

**Modifications**:

1. **Import Float controls**:
```javascript
const FloatControls = require('./float/floatControls');
```

2. **Initialize Float UI after Min UI**:
```javascript
// In Min's initialization function
function initialize() {
  // ... Min's existing initialization ...
  
  // Initialize Float controls
  const floatControls = new FloatControls();
  floatControls.initialize();
}
```

**File**: `pages/index.html` (Min's main HTML)

**Modifications**:

1. **Add Float CSS**:
```html
<link rel="stylesheet" href="../css/float/floatControls.css">
<link rel="stylesheet" href="../css/float/floatIntegration.css">
```

2. **Add Float controls container** (injected by JavaScript, not hardcoded)

---

### Settings Integration

**File**: `js/settings.js` (Min's settings)

**Design Principle**: Float settings MUST use Min's exact settings UI patterns - same layout, same control styles, same interaction patterns. Float settings should look like they were always part of Min.

**Modifications**:

1. **Add Float settings section using Min's patterns**:
```javascript
// In settings initialization - use Min's existing setting creation functions
function addFloatSettings() {
  // Use Min's settings section creation pattern
  const floatSection = createSettingsSection('Float Browser');
  
  // Use Min's setting item creation pattern
  addSettingItem(floatSection, {
    type: 'range',
    label: 'Default Opacity',
    id: 'float-default-opacity',
    min: 30,
    max: 100,
    value: 95,
    displayValue: true
  });
  
  addSettingItem(floatSection, {
    type: 'checkbox',
    label: 'Start Always-on-Top',
    id: 'float-default-always-on-top',
    checked: true
  });
  
  addSettingItem(floatSection, {
    type: 'button',
    label: 'Global Shortcuts',
    id: 'float-configure-shortcuts',
    buttonText: 'Configure'
  });
  
  addSettingItem(floatSection, {
    type: 'button',
    label: 'Window Profiles',
    id: 'float-manage-profiles',
    buttonText: 'Manage'
  });
  
  // Insert using Min's settings container
  settingsContainer.appendChild(floatSection);
}

// Note: Use Min's actual setting creation functions - 
// the above is pseudocode showing the pattern to follow
```

**Key Point**: Study Min's existing settings code and use their exact patterns for creating settings UI. Don't create custom HTML - use Min's helper functions.

---

## Data Flow

### Opacity Change Flow

```
User moves slider
    ↓
FloatControls.onOpacityChange()
    ↓
IPC: 'float:set-opacity'
    ↓
FloatWindowManager.setOpacity()
    ↓
BrowserWindow.setOpacity()
    ↓
FloatSettings.save('opacity', value)
```

### Always-On-Top Toggle Flow

```
User clicks button
    ↓
FloatControls.onAlwaysOnTopClick()
    ↓
IPC: 'float:set-always-on-top'
    ↓
FloatWindowManager.setAlwaysOnTop()
    ↓
BrowserWindow.setAlwaysOnTop()
    ↓
FloatSettings.save('alwaysOnTop', value)
    ↓
Update UI button state
```

### PIP Mode Toggle Flow

```
User clicks PIP button (or Cmd+Shift+P)
    ↓
FloatWindowManager.togglePIPMode()
    ↓
Check current state
    ↓
If not PIP:
  - Save current bounds
  - Set bounds to 400x300
  - Set isPIP = true
If PIP:
  - Restore saved bounds
  - Set isPIP = false
    ↓
FloatSettings.save state
    ↓
Update UI button state
```

---

## File Modifications Summary

### Files to Create (NEW)

```
js/float/
├── floatWindowManager.js
├── floatControls.js
├── floatSettings.js
├── floatShortcuts.js
├── floatProfiles.js
└── floatMenu.js

css/float/
├── floatControls.css
└── floatIntegration.css

localization/float/
└── en.json
```

### Files to Modify (EXISTING Min Browser files)

```
main/main.js
├── Import Float modules
├── Enhance window creation
└── Add IPC handlers

js/browserUI.js
├── Import FloatControls
└── Initialize Float UI

js/settings.js
└── Add Float settings section

pages/index.html
└── Add Float CSS links

js/menuRenderer.js
└── Add Float menu items
```

### Files NOT to Modify

- Min's tab management
- Min's bookmark system
- Min's history system
- Min's search functionality
- Min's core rendering logic

---

## Error Handling

### Window Management Errors

```javascript
try {
  mainWindow.setOpacity(opacity);
} catch (error) {
  console.error('Failed to set opacity:', error);
  // Revert to previous value
  floatSettings.set('opacity', previousOpacity);
  // Notify user
  showNotification('Failed to change opacity', 'error');
}
```

### Settings Corruption

```javascript
try {
  const settings = floatSettings.load();
} catch (error) {
  console.error('Settings corrupted:', error);
  // Reset to defaults
  floatSettings.resetToDefaults();
  // Notify user
  showNotification('Settings reset to defaults', 'warning');
}
```

### Shortcut Registration Failures

```javascript
try {
  globalShortcut.register(accelerator, callback);
} catch (error) {
  console.error('Failed to register shortcut:', error);
  // Continue without shortcut
  // Log for user to see in settings
  floatSettings.set('shortcutErrors', [...errors, { accelerator, error }]);
}
```

---

## Performance Considerations

### Opacity Changes

- Throttle opacity slider updates to 60fps max
- Use requestAnimationFrame for smooth updates
- Avoid triggering layout recalculations

### Memory Management

- Clean up event listeners when components unmount
- Properly dispose of IPC handlers
- Monitor memory usage in development

### Startup Performance

- Lazy load Float modules
- Initialize Float features after Min's core initialization
- Defer non-critical Float features

---

## Testing Strategy

### Unit Tests

- FloatWindowManager methods
- FloatSettings persistence
- FloatProfiles management
- FloatShortcuts registration

### Integration Tests

- Float features with Min Browser
- IPC communication
- Settings persistence
- Menu integration

### Manual Testing

- Opacity at different levels
- Always-on-top across spaces
- PIP mode functionality
- Global shortcuts from other apps
- Window profiles

---

## Build and Distribution

### Build Configuration

**File**: `package.json`

Add Float-specific build steps:
```json
{
  "scripts": {
    "build": "npm run build:min && npm run build:float",
    "build:float": "node scripts/build-float.js"
  }
}
```

### Code Signing

Ensure Float modifications don't break Min's code signing:
- All Float files must be included in signing
- Entitlements must include window management permissions
- Test notarization after adding Float features

### Distribution

- Build universal binary (x64 + ARM64)
- Create DMG with Float branding
- Include Float documentation
- Test on clean macOS installation

---

## Maintenance Strategy

### Pulling Min Browser Updates

1. **Keep Float code isolated**: All Float code in `js/float/` and `css/float/`
2. **Document modifications**: Maintain `FLOAT_MODIFICATIONS.md` listing all changes to Min files
3. **Use git branches**: Keep Min upstream as a remote, Float features in separate branch
4. **Test after updates**: Run full test suite after pulling Min updates

### Version Management

- Float Browser version: `2.x.x`
- Based on Min Browser version: `1.35.x`
- Document Min version in README

---

## Future Extensibility

### Planned Enhancements

1. **Cloud sync for settings**: Sync Float settings across devices
2. **Advanced window management**: Tiling, snapping, multi-monitor profiles
3. **Conditional profiles**: Time-based or app-based profile switching
4. **Custom themes**: Float-specific visual themes

### Architecture Support

The modular design allows:
- Easy addition of new Float features
- Integration with Min Browser updates
- Platform-specific enhancements
- Third-party extensions (future)

---

## Summary

Float Browser v2.0 enhances Min Browser with window management features through:

1. **Additive architecture**: Float features in separate modules
2. **Minimal modifications**: Only essential changes to Min's core
3. **Clean separation**: Float code isolated for easy maintenance
4. **Full integration**: Float features feel native to Min's UI
5. **Maintainable**: Can pull Min Browser updates easily

The design prioritizes maintainability, performance, and user experience while preserving all of Min Browser's excellent features.
