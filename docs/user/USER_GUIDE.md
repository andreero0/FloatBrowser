---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# Float Browser User Guide

Welcome to Float Browser! This guide will help you make the most of Float Browser's unique window management features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Window Transparency](#window-transparency)
3. [Always-On-Top Mode](#always-on-top-mode)
4. [Picture-in-Picture Mode](#picture-in-picture-mode)
5. [Window Profiles](#window-profiles)
6. [Global Shortcuts](#global-shortcuts)
7. [Settings](#settings)
8. [Tips and Tricks](#tips-and-tricks)

---

## Getting Started

Float Browser combines all the features of Min Browser with powerful window management capabilities. When you first launch Float Browser, you'll see the familiar Min Browser interface with additional Float controls in the toolbar.

### Float Controls Location

Float controls are located in the main toolbar, to the right of the address bar:

- **Opacity Slider**: Adjust window transparency
- **Pin Button**: Toggle always-on-top mode
- **PIP Button**: Toggle Picture-in-Picture mode

---

## Window Transparency

The opacity slider allows you to make Float Browser transparent, so you can see content behind the browser window while browsing.

### Using the Opacity Slider

1. **Locate the slider**: Find the opacity slider in the toolbar (shows a percentage value)
2. **Adjust transparency**: Click and drag the slider left (more transparent) or right (less transparent)
3. **Range**: Opacity can be adjusted from 30% (very transparent) to 100% (fully opaque)
4. **Real-time preview**: The window transparency updates instantly as you move the slider

### Opacity Presets

You can quickly set opacity to common values using the Float menu:

1. Click **Float** in the menu bar
2. Hover over **Opacity**
3. Select a preset: 100%, 90%, 80%, 70%, or 50%

### Use Cases

- **Reference browsing**: Keep documentation visible at 70% opacity while coding in another window
- **Video watching**: Set to 50% opacity to monitor a video while working
- **Multitasking**: Use 80% opacity to keep an eye on multiple sources simultaneously

### Tips

- Lower opacity (30-50%) works best with light-colored content
- Higher opacity (80-100%) is better for reading text-heavy pages
- Your opacity setting is saved and restored when you restart Float Browser

---

## Always-On-Top Mode

Always-on-top keeps Float Browser above all other windows, even when you click on other applications.

### Enabling Always-On-Top

**Method 1: Toolbar Button**
1. Click the **pin button** (📌) in the toolbar
2. The button will highlight to show always-on-top is active

**Method 2: Keyboard Shortcut**
- Press `Cmd+Shift+A` to toggle always-on-top on/off

**Method 3: Menu**
1. Click **Float** in the menu bar
2. Click **Always on Top** (checkmark shows when active)

### How It Works

When always-on-top is enabled:
- Float Browser stays above all other application windows
- Works across all macOS Spaces and desktops
- Remains on top even when other apps are in focus
- Persists until you manually disable it

### Use Cases

- **Reference material**: Keep documentation or tutorials visible while working
- **Monitoring**: Watch dashboards, social media, or live streams while doing other tasks
- **Communication**: Keep chat or video calls visible during work
- **Note-taking**: Reference web content while writing in another application

### Disabling Always-On-Top

Use any of the three methods above to toggle always-on-top off. The pin button will no longer be highlighted.

---

## Picture-in-Picture Mode

Picture-in-Picture (PIP) mode creates a compact, always-on-top window perfect for minimal screen footprint.

### Activating PIP Mode

**Method 1: Toolbar Button**
1. Click the **PIP button** (⤢) in the toolbar
2. The window will resize to a compact 400×300 pixel size

**Method 2: Keyboard Shortcut**
- Press `Cmd+Shift+P` to toggle PIP mode on/off

**Method 3: Menu**
1. Click **Float** in the menu bar
2. Click **Picture-in-Picture Mode**

### PIP Mode Features

When PIP mode is active:
- Window automatically resizes to 400×300 pixels
- Always-on-top is automatically enabled
- Your previous window size and position are saved
- All browser features remain fully functional
- Toolbar and controls remain accessible

### Exiting PIP Mode

Use any of the three methods above to exit PIP mode. Float Browser will restore your previous window size and position.

### Use Cases

- **Video watching**: Watch videos in a small corner while working
- **Quick reference**: Keep a small reference window visible
- **Monitoring**: Monitor a webpage with minimal screen space
- **Chat windows**: Keep messaging apps visible in a compact form

### Tips

- PIP mode works great with video content
- Combine with lower opacity (50-70%) for an unobtrusive overlay
- The compact size makes it easy to position in a corner of your screen

---

## Window Profiles

Window profiles let you save and quickly switch between different window configurations.

### Default Profiles

Float Browser includes three built-in profiles:

1. **Small** (`Cmd+1`)
   - Size: 400×300 pixels
   - Opacity: 80%
   - Always-on-top: Enabled
   - Perfect for: Quick reference, monitoring

2. **Medium** (`Cmd+2`)
   - Size: 800×600 pixels
   - Opacity: 90%
   - Always-on-top: Enabled
   - Perfect for: Documentation, tutorials

3. **Large** (`Cmd+3`)
   - Size: 1200×800 pixels
   - Opacity: 100%
   - Always-on-top: Disabled
   - Perfect for: Primary browsing, reading

### Applying Profiles

**Method 1: Keyboard Shortcuts**
- Press `Cmd+1` for Small profile
- Press `Cmd+2` for Medium profile
- Press `Cmd+3` for Large profile

**Method 2: Menu**
1. Click **Float** in the menu bar
2. Hover over **Window Profiles**
3. Click the profile you want to apply

### Creating Custom Profiles

1. Set up your desired window configuration:
   - Resize the window to your preferred size
   - Set your preferred opacity
   - Enable/disable always-on-top as desired

2. Open Settings (`Cmd+,`)
3. Scroll to the **Float Browser** section
4. Click **Manage** next to Window Profiles
5. Click **Create New Profile**
6. Enter a name for your profile
7. Click **Save**

### Managing Profiles

To edit or delete custom profiles:

1. Open Settings (`Cmd+,`)
2. Scroll to the **Float Browser** section
3. Click **Manage** next to Window Profiles
4. Select a profile to edit or delete

### Use Cases

- **Work profile**: Large window, 100% opacity for focused work
- **Reference profile**: Medium window, 70% opacity, always-on-top for documentation
- **Monitor profile**: Small window, 50% opacity, always-on-top for background monitoring
- **Video profile**: Small window, 80% opacity, always-on-top for video content

---

## Global Shortcuts

Global shortcuts work system-wide, even when Float Browser is not in focus.

### Available Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+Shift+F` | Toggle Visibility | Show/hide Float Browser window |
| `Cmd+Shift+A` | Toggle Always-On-Top | Enable/disable always-on-top mode |
| `Cmd+Shift+P` | Toggle PIP Mode | Enter/exit Picture-in-Picture mode |
| `Cmd+1` | Small Profile | Apply Small window profile |
| `Cmd+2` | Medium Profile | Apply Medium window profile |
| `Cmd+3` | Large Profile | Apply Large window profile |

### Using Global Shortcuts

Global shortcuts work from any application:

1. You can be working in any app (Xcode, VS Code, Photoshop, etc.)
2. Press a Float Browser global shortcut
3. Float Browser responds immediately without needing to switch to it

### Example Workflow

1. Working in your code editor
2. Press `Cmd+Shift+F` to show Float Browser with documentation
3. Press `Cmd+2` to apply Medium profile for comfortable reading
4. Press `Cmd+Shift+A` to enable always-on-top
5. Click back to your code editor - Float Browser stays visible
6. Press `Cmd+Shift+F` when done to hide Float Browser

### Customizing Shortcuts

1. Open Settings (`Cmd+,`)
2. Scroll to the **Float Browser** section
3. Click **Configure** next to Global Shortcuts
4. Click on a shortcut to change it
5. Press your desired key combination
6. Click **Save**

**Note**: Float Browser will warn you if a shortcut conflicts with system shortcuts or other applications.

---

## Settings

Float Browser settings are integrated into the Min Browser settings panel.

### Accessing Settings

- Press `Cmd+,` (Command + Comma)
- Or click **Float Browser** → **Preferences** in the menu bar

### Float Browser Settings Section

Scroll down to find the **Float Browser** section with these options:

#### Default Opacity
Set the opacity level for new windows (30% to 100%). This is the opacity Float Browser will use when it starts.

#### Start Always-On-Top
Enable this to have Float Browser start in always-on-top mode by default.

#### Global Shortcuts
Click **Configure** to customize global keyboard shortcuts.

#### Window Profiles
Click **Manage** to create, edit, or delete window profiles.

### Other Min Browser Settings

Float Browser includes all Min Browser settings:
- Search engine preferences
- Privacy and security options
- Content blocking settings
- Password manager integration
- Theme selection (light/dark)
- And more...

See the [Min Browser wiki](https://github.com/minbrowser/min/wiki) for details on Min Browser features.

---

## Tips and Tricks

### Optimal Opacity Levels

- **Reading text**: 90-100% opacity
- **Reference material**: 70-80% opacity
- **Background monitoring**: 50-60% opacity
- **Subtle overlay**: 30-40% opacity

### Combining Features

**Transparent Reference Window**
1. Set opacity to 70%
2. Enable always-on-top
3. Apply Medium profile
4. Position on one side of your screen

**Minimal Video Player**
1. Enable PIP mode (`Cmd+Shift+P`)
2. Set opacity to 80%
3. Position in a corner
4. Always-on-top is automatic in PIP mode

**Quick Toggle Workflow**
1. Use `Cmd+Shift+F` to show/hide Float Browser as needed
2. Keep it configured with your preferred opacity and always-on-top settings
3. Instantly access web content without disrupting your workflow

### Working with Multiple Monitors

- Float Browser's always-on-top works across all monitors
- Position Float Browser on a secondary monitor for reference material
- Use window profiles to quickly size for different monitor configurations

### macOS Spaces Integration

- Always-on-top works across all Spaces
- Float Browser remains visible even when switching Spaces
- Use `Cmd+Shift+F` to hide Float Browser when switching to a Space where you don't need it

### Performance Tips

- Higher opacity (80-100%) uses slightly less GPU resources
- Very low opacity (30-40%) may impact performance on older Macs
- If you experience slowness, try increasing opacity to 70% or higher

### Keyboard-Driven Workflow

Master these shortcuts for maximum efficiency:
1. `Cmd+Shift+F` - Show Float Browser
2. `Cmd+2` - Apply Medium profile
3. `Cmd+Shift+A` - Enable always-on-top
4. `Cmd+L` - Focus address bar (Min Browser shortcut)
5. Type your search or URL
6. `Cmd+Shift+F` - Hide when done

---

## Need More Help?

- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- **Keyboard Shortcuts**: See [SHORTCUTS.md](SHORTCUTS.md) for a complete reference
- **Min Browser Features**: See the [Min Browser wiki](https://github.com/minbrowser/min/wiki)
- **Report Issues**: Open an issue on the Float Browser GitHub repository

---

**Enjoy Float Browser!** 🎈
