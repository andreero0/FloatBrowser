# Min Browser Codebase Analysis

**Date**: November 15, 2025  
**Purpose**: Analysis for Float Browser v2.0 integration  
**Analyzed Files**: main/main.js, js/browserUI.js, js/util/settings/settings.js, js/menuRenderer.js, pages/settings/settings.js, main/menu.js, CSS files, index.html

---

## 1. Main Process Structure (`main/main.js`)

### Architecture Overview

Min uses Electron's **BaseWindow + WebContentsView** architecture (not BrowserWindow with webviews):
- `BaseWindow` - Native window container
- `WebContentsView` - Renders the browser UI (index.html)
- Separate BrowserWindows for service workers (places, translation)

### Window Creation Pattern

```javascript
function createWindow(customArgs = {}) {
  // 1. Load or create window bounds
  // 2. Call createWindowWithBounds()
}

function createWindowWithBounds(bounds, customArgs) {
  // 1. Create BaseWindow with configuration
  const newWin = new BaseWindow({
    width, height, x, y,
    minWidth, minHeight,
    titleBarStyle: settings.get('useSeparateTitlebar') ? 'default' : 'hidden',
    frame: settings.get('useSeparateTitlebar'),
    alwaysOnTop: settings.get('windowAlwaysOnTop'),
    backgroundColor: '#fff',
    icon: __dirname + '/icons/icon256.png'
  })
  
  // 2. Create WebContentsView for UI
  const mainView = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [...]
    }
  })
  
  // 3. Load browser page
  mainView.webContents.loadURL(browserPage)
  
  // 4. Add view to window
  newWin.contentView.addChildView(mainView)
  
  // 5. Set up event handlers
  // 6. Register window with windows manager
  
  return newWin
}
```

### Key Integration Points for Float

**Window Configuration** (lines ~200-220):
- Add `transparent: true` for opacity support
- Add `backgroundColor: '#00000000'` for transparency
- Load initial opacity from Float settings

**Event Handlers** (lines ~250-350):
- Window lifecycle events (close, focus, minimize, maximize)
- All use `sendIPCToWindow()` helper to communicate with renderer

**IPC Communication**:
- Uses `ipc.on()` for receiving messages from renderer
- Uses `sendIPCToWindow()` helper to send messages to renderer
- Pattern: `ipc.on('event-name', function(event, data) { ... })`

**Settings Integration**:
- Settings loaded via `settings.get('key')` 
- Settings are available globally after `settings.initialize(userDataPath)`

### Float Integration Strategy

1. **Import Float modules** at top of file:
```javascript
const FloatWindowManager = require('../js/float/floatWindowManager')
const FloatSettings = require('../js/float/floatSettings')
const FloatShortcuts = require('../js/float/floatShortcuts')
```

2. **Modify `createWindowWithBounds()`**:
   - Add transparency options to BaseWindow config
   - Initialize FloatWindowManager after window creation
   - Call `floatManager.restoreState()`

3. **Add IPC handlers** after existing handlers (~line 500+):
```javascript
ipc.handle('float:set-opacity', (event, opacity) => { ... })
ipc.handle('float:set-always-on-top', (event, enabled) => { ... })
ipc.handle('float:toggle-pip', () => { ... })
```

4. **Add quit handler** for state persistence:
```javascript
app.on('before-quit', () => {
  floatManager.saveState()
})
```

---

## 2. Renderer UI Structure (`js/browserUI.js`)

### Architecture Overview

`browserUI.js` is the **main orchestrator** for the renderer process:
- Manages tab lifecycle (add, destroy, switch)
- Manages task lifecycle (add, destroy, switch)
- Coordinates between tabBar, webviews, searchbar, tabEditor
- Exports main functions used by other modules

### Key Functions

**Tab Management**:
- `addTab(tabId, options)` - Creates tab, adds to tabBar and webviews
- `destroyTab(id)` - Removes tab from tabBar, state, and webviews
- `switchToTab(id, options)` - Updates active tab, webview, UI state
- `closeTab(id)` - Destroys tab and switches to next/previous

**Task Management**:
- `addTask()` - Creates new task group
- `destroyTask(id)` - Removes task and all its tabs
- `switchToTask(id)` - Switches to different task group

### Module Dependencies

```javascript
var settings = require('util/settings/settings.js')
var webviews = require('webviews.js')
var focusMode = require('focusMode.js')
var tabBar = require('navbar/tabBar.js')
var tabEditor = require('navbar/tabEditor.js')
var searchbar = require('searchbar/searchbar.js')
```

### Initialization Pattern

Min doesn't have a single `initialize()` function in browserUI.js. Instead:
1. Modules are loaded via `require()`
2. Event listeners are set up at module load time
3. IPC handlers in `menuRenderer.js` call browserUI functions

### Float Integration Strategy

1. **Import Float module**:
```javascript
var FloatControls = require('float/floatControls.js')
```

2. **Initialize Float UI** - Add after module loads:
```javascript
// Initialize Float controls after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    FloatControls.initialize()
  })
} else {
  FloatControls.initialize()
}
```

3. **Export Float functions** if needed:
```javascript
module.exports = {
  addTask,
  addTab,
  // ... existing exports
  floatControls: FloatControls // if other modules need access
}
```

---

## 3. Settings System (`js/util/settings/settings.js`)

### Architecture Overview

Simple key-value store with file persistence:
- Settings stored in `settings.json` in userData directory
- In-memory cache in `settings.list` object
- Change callbacks for reactive updates
- IPC synchronization between main and renderer processes

### API

```javascript
// Get a setting
settings.get(key) // returns value

// Set a setting
settings.set(key, value) // saves to file and triggers callbacks

// Listen for changes
settings.listen(key, callback) // callback(value)
settings.listen(callback) // global listener, callback(key)
```

### File Structure

Settings are stored as flat JSON:
```json
{
  "darkMode": 2,
  "siteTheme": true,
  "filtering": {
    "blockingLevel": 1,
    "exceptionDomains": []
  },
  "keyMap": { ... },
  "passwordManager": { ... }
}
```

### Float Integration Strategy

Float settings will be stored under a `float` key:
```json
{
  "float": {
    "opacity": 0.95,
    "defaultOpacity": 0.95,
    "alwaysOnTop": true,
    "defaultAlwaysOnTop": true,
    "globalShortcuts": { ... },
    "windowProfiles": { ... },
    "lastWindowBounds": { ... }
  }
}
```

**FloatSettings module** will wrap the settings API:
```javascript
// js/float/floatSettings.js
var settings = require('util/settings/settings.js')

var FloatSettings = {
  get: function(key, defaultValue) {
    var floatSettings = settings.get('float') || {}
    return floatSettings[key] !== undefined ? floatSettings[key] : defaultValue
  },
  
  set: function(key, value) {
    var floatSettings = settings.get('float') || {}
    floatSettings[key] = value
    settings.set('float', floatSettings)
  },
  
  listen: function(key, callback) {
    settings.listen('float', function(floatSettings) {
      if (floatSettings && floatSettings[key] !== undefined) {
        callback(floatSettings[key])
      }
    })
  }
}
```

---

## 4. Menu System (`main/menu.js`, `js/menuRenderer.js`)

### Main Process Menu (`main/menu.js`)

**Structure**:
- `buildAppMenu(options)` - Creates menu template
- Returns Electron Menu template array
- Uses `l()` for localization
- Uses `keyMap` for keyboard shortcuts
- Supports `options.secondary` for context menu

**Menu Template Pattern**:
```javascript
{
  label: 'Menu Item',
  accelerator: 'CmdOrCtrl+Key',
  click: function(item, window, event) {
    sendIPCToWindow(window, 'ipc-event-name', data)
  }
}
```

**Submenu Pattern**:
```javascript
{
  label: 'Parent Menu',
  submenu: [
    { label: 'Item 1', click: ... },
    { type: 'separator' },
    { label: 'Item 2', click: ... }
  ]
}
```

### Renderer Menu Handler (`js/menuRenderer.js`)

**Purpose**: Handles IPC messages from menu clicks

**Pattern**:
```javascript
ipc.on('menu-action', function(e, data) {
  // Perform action in renderer
  // Call browserUI functions, update webviews, etc.
})
```

### Float Integration Strategy

1. **Add Float menu in `main/menu.js`**:

Insert after personalDataItems, before View menu:

```javascript
var floatMenuItems = [
  {
    label: 'Float',
    submenu: [
      {
        label: 'Always on Top',
        type: 'checkbox',
        accelerator: 'CmdOrCtrl+Shift+A',
        checked: FloatSettings.get('alwaysOnTop', true),
        click: function(item, window) {
          sendIPCToWindow(window, 'float:toggle-always-on-top')
        }
      },
      {
        label: 'Picture-in-Picture Mode',
        accelerator: 'CmdOrCtrl+Shift+P',
        click: function(item, window) {
          sendIPCToWindow(window, 'float:toggle-pip')
        }
      },
      { type: 'separator' },
      {
        label: 'Opacity',
        submenu: [
          { label: '100%', click: (item, window) => sendIPCToWindow(window, 'float:set-opacity', 1.0) },
          { label: '90%', click: (item, window) => sendIPCToWindow(window, 'float:set-opacity', 0.9) },
          { label: '80%', click: (item, window) => sendIPCToWindow(window, 'float:set-opacity', 0.8) },
          { label: '70%', click: (item, window) => sendIPCToWindow(window, 'float:set-opacity', 0.7) },
          { label: '50%', click: (item, window) => sendIPCToWindow(window, 'float:set-opacity', 0.5) }
        ]
      }
    ]
  }
]
```

2. **Add IPC handlers in `js/menuRenderer.js`**:

```javascript
ipc.on('float:toggle-always-on-top', function() {
  FloatControls.toggleAlwaysOnTop()
})

ipc.on('float:toggle-pip', function() {
  FloatControls.togglePIP()
})

ipc.on('float:set-opacity', function(e, value) {
  FloatControls.setOpacity(value)
})
```

---

## 5. Settings UI (`pages/settings/settings.js`)

### Architecture Overview

Settings page is a **separate HTML page** loaded in a tab:
- URL: `min://app/pages/settings/index.html`
- JavaScript: `pages/settings/settings.js`
- CSS: `pages/settings/settings.css`
- Uses same settings API as main browser

### UI Creation Patterns

**Checkbox Setting**:
```javascript
// HTML
<div class="setting-section">
  <input type="checkbox" id="checkbox-feature" />
  <label for="checkbox-feature">Feature Name</label>
</div>

// JavaScript
settings.get('featureName', function(value) {
  checkbox.checked = value === true
})

checkbox.addEventListener('change', function(e) {
  settings.set('featureName', this.checked)
})
```

**Radio Button Setting**:
```javascript
// HTML
<div class="setting-option">
  <input type="radio" name="group" id="option1" />
  <label for="option1">Option 1</label>
</div>

// JavaScript
settings.get('setting', function(value) {
  if (value === 1) {
    radio1.checked = true
  }
})

radio1.addEventListener('change', function() {
  if (this.checked) {
    settings.set('setting', 1)
  }
})
```

**Dropdown Setting**:
```javascript
// HTML
<select id="dropdown">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>

// JavaScript
settings.get('setting', function(value) {
  dropdown.value = value
})

dropdown.addEventListener('change', function() {
  settings.set('setting', this.value)
})
```

**Dynamic Section Creation**:
```javascript
var section = document.createElement('div')
section.classList.add('setting-section')

var checkbox = document.createElement('input')
checkbox.type = 'checkbox'
checkbox.id = 'checkbox-id'

var label = document.createElement('label')
label.setAttribute('for', 'checkbox-id')
label.textContent = 'Setting Name'

section.appendChild(checkbox)
section.appendChild(label)

container.appendChild(section)
```

### Float Integration Strategy

1. **Add Float section to `pages/settings/index.html`**:

```html
<div class="setting-group">
  <h2>Float Browser</h2>
  
  <div class="setting-section">
    <label for="float-default-opacity">Default Opacity</label>
    <input type="range" id="float-default-opacity" min="30" max="100" value="95" />
    <span id="float-opacity-value">95%</span>
  </div>
  
  <div class="setting-section">
    <input type="checkbox" id="float-default-always-on-top" />
    <label for="float-default-always-on-top">Start Always-on-Top</label>
  </div>
  
  <div class="setting-section">
    <button id="float-configure-shortcuts">Configure Global Shortcuts</button>
  </div>
  
  <div class="setting-section">
    <button id="float-manage-profiles">Manage Window Profiles</button>
  </div>
</div>
```

2. **Add JavaScript handlers in `pages/settings/settings.js`**:

```javascript
/* Float settings */

var floatOpacitySlider = document.getElementById('float-default-opacity')
var floatOpacityValue = document.getElementById('float-opacity-value')
var floatAlwaysOnTopCheckbox = document.getElementById('float-default-always-on-top')

settings.get('float', function(floatSettings) {
  if (floatSettings) {
    floatOpacitySlider.value = (floatSettings.defaultOpacity || 0.95) * 100
    floatOpacityValue.textContent = floatOpacitySlider.value + '%'
    floatAlwaysOnTopCheckbox.checked = floatSettings.defaultAlwaysOnTop !== false
  }
})

floatOpacitySlider.addEventListener('input', function() {
  floatOpacityValue.textContent = this.value + '%'
  
  settings.get('float', function(floatSettings) {
    if (!floatSettings) floatSettings = {}
    floatSettings.defaultOpacity = parseInt(this.value) / 100
    settings.set('float', floatSettings)
  }.bind(this))
})

floatAlwaysOnTopCheckbox.addEventListener('change', function() {
  settings.get('float', function(floatSettings) {
    if (!floatSettings) floatSettings = {}
    floatSettings.defaultAlwaysOnTop = this.checked
    settings.set('float', floatSettings)
  }.bind(this))
})
```

---

## 6. CSS Classes and UI Patterns

### Color System

**Theme Classes**:
- `.theme-background-color` - Applies theme background
- `.theme-text-color` - Applies theme text color
- `.dark-mode` - Applied to body when dark mode active
- `.dark-theme` - Applied to specific elements in dark mode

**Colors**:
- Light mode: `background: #fff`, `color: #000`
- Dark mode: `background: rgb(33, 37, 43)`, `color: lightgrey`

### Button Styles

**Navbar Buttons** (`.navbar-action-button`):
```css
.navbar-action-button {
  padding: 0 1rem;
  height: 36px;
  font-size: 1.4em !important;
}

body.windows .navbar-action-button:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.075);
}
```

**Icon Buttons**:
- Use Carbon Design icons via classes: `.i carbon:icon-name`
- Example: `.i carbon:add`, `.i carbon:close`, `.i carbon:chevron-left`

### Layout Patterns

**Navbar Structure**:
```html
<div id="navbar" class="theme-background-color theme-text-color">
  <button class="navbar-action-button">...</button>
  <div id="tabs">...</div>
  <div class="navbar-right-actions">
    <button id="add-tab-button" class="navbar-action-button">...</button>
  </div>
</div>
```

**Flexbox Layout**:
- Navbar uses `display: flex`
- Tabs use `flex: 1` to fill space
- Buttons have fixed width or padding

### Spacing

- Navbar height: `36px` (+ control space for macOS traffic lights)
- Button padding: `0 1rem` or `0.5rem`
- Gap between elements: `0.5rem`
- Control space variables:
  - `--control-space-top` (macOS traffic lights)
  - `--control-space-left`
  - `--control-space-right`

### Float UI Integration Strategy

**Float Controls Container**:
```html
<div class="navbar-float-controls">
  <!-- Opacity Slider -->
  <div class="float-control opacity-control">
    <input type="range" id="float-opacity-slider" 
           class="float-slider" min="30" max="100" value="100" />
    <span class="float-value">100%</span>
  </div>
  
  <!-- Always-on-Top Button -->
  <button id="float-always-on-top" 
          class="navbar-action-button i carbon:pin" 
          title="Always on Top (Cmd+Shift+A)">
  </button>
  
  <!-- PIP Button -->
  <button id="float-pip" 
          class="navbar-action-button i carbon:fit-to-screen" 
          title="Picture-in-Picture (Cmd+Shift+P)">
  </button>
</div>
```

**CSS for Float Controls** (`css/float/floatControls.css`):
```css
.navbar-float-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.float-control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.float-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  outline: none;
}

.float-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
}

.float-value {
  font-size: 0.75em;
  opacity: 0.8;
  min-width: 3em;
  text-align: right;
}

/* Active state for toggle buttons */
.navbar-action-button.float-active {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-theme .navbar-action-button.float-active {
  background-color: rgba(255, 255, 255, 0.2);
}
```

**Insertion Point**:
Insert Float controls in navbar, before `.navbar-right-actions`:

```javascript
// In FloatControls.initialize()
var navbar = document.getElementById('navbar')
var rightActions = navbar.querySelector('.navbar-right-actions')
var floatControls = createFloatControlsElement()
navbar.insertBefore(floatControls, rightActions)
```

---

## 7. Key Integration Points Summary

### Main Process (`main/main.js`)

**Lines to modify**:
1. **Imports** (top of file, ~line 20): Add Float module imports
2. **Window creation** (~line 200-220): Add transparency options
3. **After window creation** (~line 280): Initialize FloatWindowManager
4. **IPC handlers** (~line 500+): Add Float IPC handlers
5. **App quit** (~line 450): Add state persistence

### Renderer Process (`js/browserUI.js`)

**Lines to modify**:
1. **Imports** (top of file): Add FloatControls import
2. **After module load** (bottom of file): Initialize FloatControls

### Menu (`main/menu.js`)

**Lines to modify**:
1. **Imports** (top): Add FloatSettings import
2. **Menu template** (~line 150): Insert Float menu items

### Menu Renderer (`js/menuRenderer.js`)

**Lines to modify**:
1. **Imports** (top): Add FloatControls import
2. **IPC handlers** (bottom): Add Float menu IPC handlers

### Settings Page (`pages/settings/`)

**Files to modify**:
1. **index.html**: Add Float settings section
2. **settings.js**: Add Float settings handlers

### HTML (`index.html`)

**Lines to modify**:
1. **CSS links** (head): Add Float CSS links
2. **No HTML changes needed** - Float controls injected via JavaScript

---

## 8. Build System Considerations

### Current Build Process

Min uses **custom build scripts** (not webpack/vite):
- `buildMain.js` - Concatenates main process files
- `buildBrowser.js` - Browserifies renderer files
- `buildBrowserStyles.js` - Concatenates CSS files

### Float Module Integration

**JavaScript**:
- Float modules in `js/float/` will be automatically included by Browserify
- No build script changes needed for JavaScript

**CSS**:
- Need to add Float CSS files to `buildBrowserStyles.js`
- Or manually link in `index.html` (simpler for development)

**Recommendation**: 
- During development: Link CSS directly in `index.html`
- For production: Add to build script

---

## 9. Testing Strategy

### Manual Testing Points

1. **Window transparency**: Test opacity slider 30-100%
2. **Always-on-top**: Test across spaces, with fullscreen apps
3. **PIP mode**: Test resize, restore, state persistence
4. **Global shortcuts**: Test from other apps
5. **Settings persistence**: Test restart, corrupted settings
6. **Menu integration**: Test all menu items, shortcuts
7. **Settings UI**: Test all controls, visual consistency
8. **Dark mode**: Test all Float UI in dark mode
9. **Multiple windows**: Test Float state per window
10. **Min features**: Test no regressions in Min functionality

### Integration Testing

1. **Tab management**: Ensure Float doesn't break tabs
2. **Task management**: Ensure Float doesn't break tasks
3. **Webview rendering**: Ensure transparency doesn't affect webviews
4. **Performance**: Monitor memory, CPU, startup time
5. **Keyboard shortcuts**: Ensure no conflicts with Min shortcuts

---

## 10. Potential Issues and Solutions

### Issue 1: Transparency Performance

**Problem**: Transparency can impact rendering performance

**Solution**:
- Use `will-change: opacity` CSS hint
- Throttle opacity slider updates to 60fps
- Test on older hardware

### Issue 2: Always-on-Top Conflicts

**Problem**: Min already has `alwaysOnTop` setting

**Solution**:
- Float will override Min's setting
- Document this in Float settings
- Consider migrating Min's setting to Float

### Issue 3: Window State Persistence

**Problem**: Min saves window bounds, Float needs to save additional state

**Solution**:
- Float saves to separate `floatState.json` file
- Or extend Min's `windowBounds.json` with Float properties
- Ensure no conflicts with Min's state saving

### Issue 4: Menu State Updates

**Problem**: Menu checkboxes need to update when state changes

**Solution**:
- Rebuild menu when Float state changes
- Or use `menu.getMenuItemById()` to update checkbox state
- Listen for Float state changes in main process

### Issue 5: IPC Communication

**Problem**: Need to communicate between main and renderer for Float features

**Solution**:
- Use `ipc.handle()` / `ipc.invoke()` for request-response
- Use `ipc.on()` / `webContents.send()` for events
- Follow Min's existing IPC patterns

---

## 11. Recommended Implementation Order

Based on this analysis, the recommended implementation order is:

1. **FloatSettings** - Foundation for all other modules
2. **FloatWindowManager** - Core window management in main process
3. **Main process integration** - Window creation, IPC handlers
4. **FloatControls** - UI controls in renderer
5. **Renderer integration** - browserUI.js, index.html
6. **FloatMenu** - Menu integration
7. **Settings UI** - Settings page integration
8. **FloatShortcuts** - Global keyboard shortcuts
9. **FloatProfiles** - Window profiles (optional, can be later)
10. **Testing and polish** - Comprehensive testing

This order ensures:
- Each module builds on previous modules
- Core functionality works before adding advanced features
- Can test incrementally at each step

---

## 12. File Modification Checklist

### Files to Create (NEW)

- [ ] `js/float/floatSettings.js`
- [ ] `js/float/floatWindowManager.js`
- [ ] `js/float/floatControls.js`
- [ ] `js/float/floatShortcuts.js`
- [ ] `js/float/floatProfiles.js`
- [ ] `js/float/floatMenu.js`
- [ ] `css/float/floatControls.css`
- [ ] `css/float/floatIntegration.css`

### Files to Modify (EXISTING)

- [ ] `main/main.js` - Window creation, IPC handlers
- [ ] `js/browserUI.js` - Float UI initialization
- [ ] `main/menu.js` - Float menu items
- [ ] `js/menuRenderer.js` - Float menu IPC handlers
- [ ] `pages/settings/index.html` - Float settings section
- [ ] `pages/settings/settings.js` - Float settings handlers
- [ ] `index.html` - Float CSS links (optional)

### Files NOT to Modify

- `js/tabState.js` - Tab state management
- `js/webviews.js` - Webview management
- `js/navbar/tabBar.js` - Tab bar
- `js/searchbar/searchbar.js` - Search bar
- Any files in `js/places/` - History/bookmarks
- Any files in `js/passwordManager/` - Password management

---

## Conclusion

Min Browser has a clean, modular architecture that makes Float integration straightforward:

1. **Clear separation** between main and renderer processes
2. **Simple settings system** that Float can extend
3. **Consistent UI patterns** that Float can follow
4. **Event-driven architecture** that Float can hook into
5. **Minimal core modifications** needed for Float features

The key to successful integration is:
- **Follow Min's patterns** - Don't reinvent the wheel
- **Keep Float code isolated** - Separate modules in `js/float/`
- **Use Min's helpers** - sendIPCToWindow, settings API, etc.
- **Match Min's style** - CSS classes, button styles, interactions
- **Test incrementally** - Verify each module before moving to next

This analysis provides all the information needed to implement Float Browser v2.0 successfully.
