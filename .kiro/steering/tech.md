# Technology Stack

## Core Technologies

- **Runtime**: Electron 38.3.0 (Chromium-based)
- **Language**: JavaScript (Node.js)
- **Build System**: Custom build scripts using Browserify
- **Package Manager**: npm

## Key Dependencies

- **UI Framework**: Vanilla JavaScript (no framework)
- **Database**: Dexie (IndexedDB wrapper) for places/history
- **Translation**: @browsermt/bergamot-translator
- **PDF Rendering**: pdfjs-dist
- **Content Blocking**: Custom ABP filter parser
- **Bundling**: Browserify with electron-renderify transform

## Build System

The project uses custom Node.js build scripts (not webpack/vite):

- `buildMain.js` - Concatenates main process modules
- `buildBrowser.js` - Browserifies renderer process code
- `buildPreload.js` - Bundles preload scripts
- `buildBrowserStyles.js` - Processes CSS files
- `watch.js` - File watcher for development

### Common Commands

```bash
# Development
npm install              # Install dependencies
npm run start           # Build and start with hot reload
npm run watch           # Watch for file changes
npm run startElectron   # Start Electron in dev mode

# Building
npm run build           # Build all components
npm run buildMain       # Build main process only
npm run buildBrowser    # Build renderer process only

# Testing/Linting
npm test                # Run StandardJS linter
npm run lint            # Auto-fix linting issues with Prettier

# Platform Builds
npm run buildWindows    # Windows installer
npm run buildMacIntel   # macOS Intel build
npm run buildMacArm     # macOS ARM build
npm run buildDebian     # Debian package
npm run buildRedhat     # RPM package
```

## Code Style

- **Linter**: StandardJS (no semicolons, 2-space indent)
- **Formatter**: Prettier for CSS, Markdown, HTML, JSON
- Most editors have StandardJS plugins for auto-formatting

## Architecture Notes

- Main process code in `main/` directory
- Renderer process code in `js/` directory
- Preload scripts in `js/preload/`
- IPC communication between main and renderer processes
- Custom protocol handler for `min://` URLs
- Separate service windows for places (history) and translation
