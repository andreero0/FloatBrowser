---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)**

---

# Float Browser v2.0.0 Release Notes

**Release Date:** November 16, 2024

Float Browser v2.0.0 is a transparent, always-on-top web browser for macOS that combines the professional UI and features of Min Browser with unique window management capabilities.

---

## 🎉 What's New in Float Browser v2.0.0

### Core Float Features

#### 🔍 **Window Transparency**
- Adjustable opacity from 30% to 100%
- Smooth opacity slider in the toolbar
- Real-time transparency updates
- Persistent opacity settings across sessions

#### 📌 **Always-On-Top Mode**
- Keep Float Browser above all other applications
- Works across all macOS Spaces and Mission Control
- Maintains position even when other apps go fullscreen
- Toggle button in toolbar with visual indicator

#### 🖼️ **Picture-in-Picture Mode**
- Compact 400x300 window for minimal screen footprint
- Preserves full browser functionality
- Automatically saves and restores window size
- Perfect for reference content while working

#### ⌨️ **Global Keyboard Shortcuts**
- `Cmd+Shift+F` - Toggle window visibility from any app
- `Cmd+Shift+A` - Toggle always-on-top mode
- `Cmd+Shift+P` - Toggle Picture-in-Picture mode
- `Cmd+1/2/3` - Apply window size profiles

#### 📐 **Window Size Profiles**
- **Small Profile** (400x300) - 80% opacity, always-on-top
- **Medium Profile** (800x600) - 90% opacity, always-on-top
- **Large Profile** (1200x800) - 100% opacity, normal mode
- Create custom profiles with your preferred settings
- Quick-switch between profiles with keyboard shortcuts

### Min Browser Foundation

Float Browser is built on Min Browser v1.35.2, providing all of Min's excellent features:

- ✅ **Full-text search** for browsing history
- ✅ **Built-in ad and tracker blocking**
- ✅ **Automatic reader view** for articles
- ✅ **Tasks system** for organizing tab groups
- ✅ **Bookmark management** with tagging
- ✅ **Password manager integration** (Bitwarden, 1Password, Keychain)
- ✅ **Dark mode support**
- ✅ **Page translation**
- ✅ **Focus mode** to prevent distractions

---

## 🆚 Float Browser vs Min Browser

### What Float Adds

| Feature | Min Browser | Float Browser |
|---------|-------------|---------------|
| Window Transparency | ❌ | ✅ 30-100% adjustable |
| Always-On-Top | ❌ | ✅ Across all spaces |
| Picture-in-Picture | ❌ | ✅ Compact mode |
| Global Shortcuts | ❌ | ✅ System-wide control |
| Window Profiles | ❌ | ✅ Quick-switch presets |
| Float Controls UI | ❌ | ✅ Integrated toolbar |
| Float Menu | ❌ | ✅ Dedicated menu |
| Float Settings | ❌ | ✅ Customization panel |

### What Stays the Same

- All Min Browser features work identically
- Same keyboard shortcuts for browsing
- Same privacy and security features
- Same performance characteristics
- Same minimal, distraction-free UI

---

## 💻 System Requirements

### Minimum Requirements

- **Operating System:** macOS 10.13 (High Sierra) or later
- **Architecture:** Intel x64 or Apple Silicon (ARM64)
- **RAM:** 4 GB minimum, 8 GB recommended
- **Disk Space:** 500 MB free space

### Recommended

- **Operating System:** macOS 12 (Monterey) or later
- **RAM:** 8 GB or more
- **Display:** 1920x1080 or higher resolution

### Compatibility

- ✅ **Intel Macs** - Full support for x64 architecture
- ✅ **Apple Silicon Macs** - Native ARM64 support
- ✅ **Universal Binary** - Single app works on both architectures
- ✅ **Multiple Monitors** - Full support for multi-display setups
- ✅ **macOS Spaces** - Always-on-top works across all spaces
- ✅ **Mission Control** - Maintains window management features
- ✅ **Fullscreen Apps** - Always-on-top persists over fullscreen apps

---

## 📦 Installation Instructions

### Download

Download the DMG file:
- **Universal Binary:** `Float Browser-2.0.0-universal.dmg` (204 MB)
  - Works on both Intel and Apple Silicon Macs

### Installation Steps

1. **Download** the DMG file from the release page
2. **Open** the DMG file by double-clicking it
3. **Drag** Float Browser.app to the Applications folder
4. **Eject** the DMG from Finder
5. **Launch** Float Browser from Applications

### First Launch

On first launch, you may see a security warning because the app is not notarized:

1. **Right-click** (or Control-click) on Float Browser.app
2. Select **"Open"** from the context menu
3. Click **"Open"** in the security dialog
4. The app will launch and remember this choice

**Note:** The app is code-signed with an Apple Developer certificate but not notarized. This is a temporary limitation and will be resolved in a future release.

### Alternative: Command Line

```bash
# Open the DMG
open "Float Browser-2.0.0-universal.dmg"

# Copy to Applications (after DMG mounts)
cp -R "/Volumes/Float Browser 2.0.0/Float Browser.app" /Applications/

# Remove quarantine attribute (optional, to skip security dialog)
xattr -d com.apple.quarantine "/Applications/Float Browser.app"
```

---

## 🚀 Quick Start Guide

### Basic Usage

1. **Launch Float Browser** from Applications
2. **Browse normally** - all Min Browser features work as expected
3. **Adjust transparency** - use the opacity slider in the toolbar
4. **Enable always-on-top** - click the pin button in the toolbar
5. **Try PIP mode** - click the compress button for compact view

### Keyboard Shortcuts

#### Float-Specific Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+F` | Toggle window visibility |
| `Cmd+Shift+A` | Toggle always-on-top |
| `Cmd+Shift+P` | Toggle Picture-in-Picture |
| `Cmd+1` | Apply Small profile |
| `Cmd+2` | Apply Medium profile |
| `Cmd+3` | Apply Large profile |

#### Min Browser Shortcuts

All Min Browser shortcuts continue to work. See [docs/SHORTCUTS.md](docs/SHORTCUTS.md) for the complete list.

### Settings

Access Float settings:
1. Open **Float Browser > Preferences** (or `Cmd+,`)
2. Scroll to the **"Float Browser"** section
3. Configure:
   - Default opacity for new windows
   - Default always-on-top state
   - Global keyboard shortcuts
   - Window size profiles

---

## 🔧 Configuration

### Default Settings

Float Browser ships with sensible defaults:

- **Default Opacity:** 95%
- **Default Always-On-Top:** Enabled
- **Default Window Size:** 1000x700
- **PIP Size:** 400x300

### Window Profiles

Three built-in profiles:

1. **Small** - 400x300, 80% opacity, always-on-top
2. **Medium** - 800x600, 90% opacity, always-on-top
3. **Large** - 1200x800, 100% opacity, normal mode

Create custom profiles in Settings > Float Browser > Manage Profiles.

### Customizing Shortcuts

1. Open **Preferences** (`Cmd+,`)
2. Go to **Float Browser** section
3. Click **"Configure Shortcuts"**
4. Set your preferred key combinations
5. Shortcuts are validated to prevent conflicts

---

## 📚 Documentation

### User Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete feature documentation
- **[Keyboard Shortcuts](docs/SHORTCUTS.md)** - All shortcuts reference
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Developer Documentation

- **[Float Architecture](FLOAT_ARCHITECTURE.md)** - Technical architecture
- **[Float Modifications](FLOAT_MODIFICATIONS.md)** - Changes to Min Browser
- **[Build Guide](BUILD_GUIDE.md)** - Building from source
- **[Min Update Guide](MIN_UPDATE_GUIDE.md)** - Updating Min Browser base

---

## 🐛 Known Issues

### Security Warning on First Launch

**Issue:** macOS shows a security warning when opening Float Browser for the first time.

**Reason:** The app is code-signed but not notarized by Apple.

**Workaround:** Right-click the app and select "Open" to bypass the warning.

**Status:** Notarization will be enabled in a future release.

### Transparency Performance

**Issue:** On some older Macs, changing opacity may cause brief visual lag.

**Workaround:** Use opacity presets (100%, 90%, 80%) instead of the slider.

**Status:** Performance optimizations planned for v2.1.0.

---

## 🔄 Upgrading from Min Browser

Float Browser is a separate application and can coexist with Min Browser.

### Migrating Data

Float Browser uses separate data directories, so your Min Browser data is not automatically imported.

To migrate:

1. **Bookmarks:** Export from Min, import to Float
2. **Settings:** Manually configure in Float settings
3. **History:** Not migrated (starts fresh)

### Running Both

You can run both Min Browser and Float Browser simultaneously. They use different:
- Application bundles
- Data directories
- Settings files
- Window management

---

## 🙏 Credits and Attribution

### Based on Min Browser

Float Browser is built on [Min Browser](https://minbrowser.org/) v1.35.2 by PalmerAL.

- **Min Browser:** https://github.com/minbrowser/min
- **License:** Apache 2.0
- **Modifications:** See [FLOAT_MODIFICATIONS.md](FLOAT_MODIFICATIONS.md)

### Float Browser Development

- **Float Features:** Custom window management layer
- **Integration:** Seamless integration with Min's architecture
- **Maintenance:** Designed for easy Min Browser updates

### Open Source

Float Browser is open source under the Apache 2.0 license, same as Min Browser.

---

## 📞 Support

### Getting Help

- **Documentation:** Check [docs/](docs/) directory
- **Troubleshooting:** See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Issues:** Report bugs on GitHub (link TBD)

### Reporting Bugs

When reporting bugs, please include:

1. **macOS version** (`sw_vers`)
2. **Architecture** (Intel or Apple Silicon)
3. **Float Browser version** (2.0.0)
4. **Steps to reproduce**
5. **Expected vs actual behavior**
6. **Console logs** (if applicable)

### Feature Requests

We welcome feature requests! Please check existing issues first to avoid duplicates.

---

## 🗺️ Roadmap

### Planned for v2.1.0

- ✨ Apple notarization for seamless installation
- ✨ Cloud sync for settings and profiles
- ✨ Advanced window management (tiling, snapping)
- ✨ Multi-monitor profile support
- ✨ Conditional profiles (time-based, app-based)
- ✨ Custom themes for Float UI

### Future Considerations

- Windows and Linux support
- Browser extension API
- Advanced automation features
- Integration with system shortcuts

---

## 📄 License

Float Browser is licensed under the Apache License 2.0, same as Min Browser.

See [LICENSE.txt](LICENSE.txt) for the full license text.

---

## 🎊 Thank You

Thank you for using Float Browser! We hope it enhances your browsing experience and productivity.

Special thanks to the Min Browser project and community for creating an excellent foundation.

---

**Float Browser v2.0.0**  
*A transparent, always-on-top browser for macOS*  
Built on Min Browser v1.35.2
