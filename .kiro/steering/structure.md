# Project Structure

## Top-Level Organization

```
min/
├── main/              # Main process (Electron backend)
├── js/                # Renderer process (browser UI)
├── css/               # Stylesheets
├── pages/             # Special pages (settings, error, PDF viewer)
├── reader/            # Reader view implementation
├── localization/      # Translation files
├── ext/               # External libraries and resources
├── scripts/           # Build scripts
├── icons/             # Application icons
└── dist/              # Build output (generated)
```

## Key Directories

### `main/` - Main Process
Electron main process code that runs in Node.js:
- `main.js` - Application entry point
- `viewManager.js` - WebView/BrowserView management
- `windowManagement.js` - Window creation and lifecycle
- `menu.js` - Application menu
- `filtering.js` - Content blocking
- `download.js` - Download manager
- `permissionManager.js` - Site permissions

### `js/` - Renderer Process
Browser UI code that runs in the renderer:
- `browserUI.js` - Core UI orchestration (tabs, tasks, switching)
- `tabState.js` - Tab state management
- `webviews.js` - WebView wrapper and event handling
- `navbar/` - Navigation bar components (tab bar, buttons, etc.)
- `searchbar/` - Search bar and plugins (bangs, suggestions, etc.)
- `taskOverlay/` - Task switcher UI
- `passwordManager/` - Password manager integrations
- `places/` - History and full-text search
- `preload/` - Scripts injected into web pages
- `util/` - Shared utilities

### `css/` - Stylesheets
Component-specific CSS files:
- `base.css` - Global styles and resets
- `tabBar.css`, `searchbar.css`, etc. - Component styles
- Dark mode support via `.dark-mode` class

### `pages/` - Special Pages
Standalone HTML pages:
- `settings/` - Settings interface
- `error/` - Error pages
- `pdfViewer/` - PDF viewer
- `translateService/` - Translation service worker

### `ext/` - External Resources
Third-party libraries and data files:
- `abp-filter-parser-modified/` - Ad blocking
- `filterLists/` - EasyList filters
- `readability-master/` - Reader view extraction
- `icons/` - Icon font
- `publicSuffixes/` - Domain suffix list

## Module System

- Main process: CommonJS (`require`/`module.exports`)
- Renderer process: Browserify bundles with CommonJS
- No ES modules currently used
- Global variables defined in `package.json` standard config

## State Management

- **Tasks**: Collection of tab groups (in `js/tabState/task.js`)
- **Tabs**: Individual browser tabs (in `js/tabState/tab.js`)
- **Places**: History/bookmarks database (Dexie/IndexedDB)
- **Settings**: Persistent settings (in `js/util/settings/`)

## IPC Communication

- Main ↔ Renderer: Electron IPC (`ipcMain`/`ipcRenderer`)
- Window sync: `windowSync.js` syncs tab state across windows
- Service workers: Separate hidden windows for places and translation

## Build Output

- `main.build.js` - Concatenated main process code
- `dist/bundle.js` - Browserified renderer code
- `dist/preload.js` - Preload script bundle
- `dist/bundle.css` - Concatenated stylesheets
