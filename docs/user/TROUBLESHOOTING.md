---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# Float Browser Troubleshooting Guide

This guide helps you resolve common issues with Float Browser.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Window Management Issues](#window-management-issues)
3. [Transparency Issues](#transparency-issues)
4. [Always-On-Top Issues](#always-on-top-issues)
5. [Global Shortcuts Issues](#global-shortcuts-issues)
6. [Performance Issues](#performance-issues)
7. [Settings Issues](#settings-issues)
8. [Min Browser Features](#min-browser-features)
9. [Resetting Float Browser](#resetting-float-browser)
10. [Reporting Bugs](#reporting-bugs)

---

## Installation Issues

### macOS Won't Open Float Browser (Security Warning)

**Problem**: macOS shows "Float Browser can't be opened because it is from an unidentified developer"

**Solution**:
1. Go to **System Preferences** → **Security & Privacy**
2. Click the **General** tab
3. Click **Open Anyway** next to the Float Browser message
4. Click **Open** in the confirmation dialog

**Alternative**:
1. Right-click (or Control-click) Float Browser in Applications
2. Select **Open**
3. Click **Open** in the dialog

### Float Browser Won't Launch

**Problem**: Float Browser doesn't start or crashes immediately

**Solutions**:

1. **Check macOS version**: Float Browser requires macOS 10.13 or later
   - Click  → **About This Mac** to check your version

2. **Check for corrupted download**:
   - Delete Float Browser from Applications
   - Re-download the DMG
   - Reinstall

3. **Check for conflicting applications**:
   - Quit other window management tools (Magnet, Rectangle, etc.)
   - Try launching Float Browser again

4. **Check Console logs**:
   - Open **Console.app**
   - Search for "Float Browser" or "Electron"
   - Look for error messages

### Installation Fails on Apple Silicon

**Problem**: Float Browser won't install on M1/M2/M3 Macs

**Solution**:
- Ensure you downloaded the ARM64 version (not Intel)
- If you built from source, use `npm run buildMacArm`
- Check that Rosetta 2 is installed (for Intel builds): `softwareupdate --install-rosetta`

---

## Window Management Issues

### Window Doesn't Stay On Top

**Problem**: Always-on-top mode doesn't work or window goes behind other apps

**Solutions**:

1. **Verify always-on-top is enabled**:
   - Check if the pin button (📌) in the toolbar is highlighted
   - Try toggling it off and on again (`Cmd+Shift+A`)

2. **Check for fullscreen apps**:
   - Always-on-top may not work when other apps are in fullscreen mode
   - Exit fullscreen in the other app or use Split View instead

3. **Restart Float Browser**:
   - Quit Float Browser (`Cmd+Q`)
   - Relaunch from Applications

4. **Check macOS permissions**:
   - Go to **System Preferences** → **Security & Privacy** → **Accessibility**
   - Ensure Float Browser has accessibility permissions

### PIP Mode Doesn't Work

**Problem**: Picture-in-Picture mode doesn't activate or window doesn't resize

**Solutions**:

1. **Try the keyboard shortcut**: Press `Cmd+Shift+P`

2. **Check current window state**:
   - Exit fullscreen mode if active
   - Ensure window is not minimized

3. **Reset window bounds**:
   - Manually resize the window to a normal size
   - Try PIP mode again

4. **Check settings**:
   - Open Settings (`Cmd+,`)
   - Scroll to Float Browser section
   - Try resetting to defaults

### Window Profiles Don't Apply

**Problem**: Pressing `Cmd+1/2/3` doesn't change window size

**Solutions**:

1. **Verify shortcuts are registered**:
   - Open Settings (`Cmd+,`)
   - Check Float Browser → Global Shortcuts
   - Ensure shortcuts are configured

2. **Check for shortcut conflicts**:
   - Other apps may be using the same shortcuts
   - Try customizing the shortcuts

3. **Apply via menu instead**:
   - Click **Float** → **Window Profiles** → Select profile
   - If this works, the issue is with shortcuts

4. **Reset profiles**:
   - Open Settings (`Cmd+,`)
   - Float Browser → Window Profiles → Manage
   - Delete custom profiles and test with defaults

---

## Transparency Issues

### Opacity Slider Doesn't Work

**Problem**: Moving the opacity slider doesn't change window transparency

**Solutions**:

1. **Check transparency support**:
   - Transparency requires macOS 10.13 or later
   - Some older Macs may have limited transparency support

2. **Restart Float Browser**:
   - Quit (`Cmd+Q`) and relaunch
   - Transparency state should restore

3. **Try opacity presets**:
   - Use **Float** menu → **Opacity** → Select a percentage
   - If this works, the slider may need to be reset

4. **Check for compositor issues**:
   - Restart your Mac
   - Some GPU drivers may have transparency issues

### Window Appears Completely Transparent

**Problem**: Float Browser is invisible or nearly invisible

**Solutions**:

1. **Reset opacity to 100%**:
   - Press `Cmd+Shift+F` to show the window (if hidden)
   - Click **Float** menu → **Opacity** → **100%**
   - Or use the slider to drag to the right

2. **Use keyboard navigation**:
   - Press `Cmd+,` to open settings
   - Navigate to Float Browser section
   - Reset default opacity to 95%

3. **Reset settings** (see [Resetting Float Browser](#resetting-float-browser))

### Transparency Causes Visual Artifacts

**Problem**: Window shows flickering, tearing, or visual glitches

**Solutions**:

1. **Increase opacity**:
   - Very low opacity (30-40%) can cause rendering issues
   - Try 70% or higher

2. **Disable hardware acceleration**:
   - This is a Min Browser setting
   - See Min Browser documentation

3. **Update macOS**:
   - Older macOS versions may have compositor bugs
   - Update to the latest version

4. **Check GPU**:
   - Integrated graphics may struggle with transparency
   - Try on a different Mac to isolate the issue

---

## Always-On-Top Issues

### Always-On-Top Doesn't Work Across Spaces

**Problem**: Window goes behind other apps when switching Spaces

**Solutions**:

1. **Check macOS Mission Control settings**:
   - Go to **System Preferences** → **Mission Control**
   - Uncheck "Displays have separate Spaces" (if you want always-on-top across monitors)

2. **Verify always-on-top is enabled**:
   - Check the pin button is highlighted
   - Try toggling off and on

3. **Restart Float Browser**:
   - Always-on-top state should persist after restart

### Always-On-Top Conflicts with Other Apps

**Problem**: Other window management apps interfere with always-on-top

**Solutions**:

1. **Disable conflicting apps**:
   - Quit apps like Magnet, Rectangle, BetterTouchTool temporarily
   - Test Float Browser alone

2. **Check app priorities**:
   - Some window managers have their own always-on-top features
   - Disable those features for Float Browser

3. **Use Float Browser's built-in features**:
   - Float Browser's always-on-top should take precedence
   - If not, report as a bug

---

## Global Shortcuts Issues

### Global Shortcuts Don't Work

**Problem**: Pressing `Cmd+Shift+F`, `Cmd+Shift+A`, etc. doesn't do anything

**Solutions**:

1. **Check Accessibility permissions**:
   - Go to **System Preferences** → **Security & Privacy** → **Privacy**
   - Select **Accessibility** in the left sidebar
   - Ensure Float Browser is checked
   - If not listed, click the lock, then click **+** to add Float Browser

2. **Check for shortcut conflicts**:
   - Go to **System Preferences** → **Keyboard** → **Shortcuts**
   - Look for conflicts with system shortcuts
   - Disable conflicting shortcuts or customize Float Browser shortcuts

3. **Verify shortcuts are registered**:
   - Open Float Browser Settings (`Cmd+,`)
   - Check Float Browser → Global Shortcuts
   - Try re-configuring the shortcuts

4. **Restart Float Browser**:
   - Shortcuts are registered on launch
   - Quit and relaunch to re-register

### Shortcuts Work Inconsistently

**Problem**: Global shortcuts sometimes work, sometimes don't

**Solutions**:

1. **Check for app-specific conflicts**:
   - Some apps capture keyboard input globally
   - Try in different apps to isolate the issue

2. **Check system load**:
   - High CPU usage can delay shortcut response
   - Check Activity Monitor

3. **Restart Float Browser**:
   - Shortcut registration may have failed
   - Relaunch to re-register

### Can't Customize Shortcuts

**Problem**: Shortcut customization doesn't save or apply

**Solutions**:

1. **Check for invalid combinations**:
   - Shortcuts must include Cmd or Ctrl
   - Single keys are not allowed

2. **Check for conflicts**:
   - Float Browser will warn about conflicts
   - Choose a different combination

3. **Reset to defaults**:
   - Open Settings → Float Browser → Global Shortcuts
   - Click **Reset to Defaults**

---

## Performance Issues

### Float Browser is Slow or Laggy

**Problem**: UI is unresponsive or animations are choppy

**Solutions**:

1. **Increase opacity**:
   - Very low opacity (30-50%) uses more GPU resources
   - Try 70% or higher

2. **Close unnecessary tabs**:
   - Too many tabs can slow down the browser
   - Close tabs you're not using

3. **Clear browsing data**:
   - Press `Cmd+Shift+Delete`
   - Clear cache and history

4. **Restart Float Browser**:
   - Memory leaks can accumulate over time
   - Restart to free memory

5. **Check Activity Monitor**:
   - Open Activity Monitor
   - Look for high CPU or memory usage
   - Identify problematic tabs or processes

### High Memory Usage

**Problem**: Float Browser uses too much RAM

**Solutions**:

1. **Close unused tabs and tasks**:
   - Each tab uses memory
   - Use `Cmd+W` to close tabs

2. **Disable extensions** (if any):
   - Extensions can increase memory usage

3. **Clear cache**:
   - Press `Cmd+Shift+Delete`
   - Select cache and clear

4. **Restart Float Browser**:
   - Fresh start clears accumulated memory

### Transparency Causes Performance Issues

**Problem**: Low opacity makes the browser slow

**Solutions**:

1. **Increase opacity to 70% or higher**:
   - Lower opacity requires more GPU processing

2. **Disable transparency temporarily**:
   - Set opacity to 100%
   - Test if performance improves

3. **Check GPU**:
   - Older or integrated GPUs may struggle
   - Consider using higher opacity on older Macs

---

## Settings Issues

### Settings Don't Save

**Problem**: Changes to settings are lost after restart

**Solutions**:

1. **Check file permissions**:
   - Settings are stored in `~/Library/Application Support/Float Browser/`
   - Ensure you have write permissions

2. **Check disk space**:
   - Ensure you have free disk space
   - Settings can't save if disk is full

3. **Reset settings** (see [Resetting Float Browser](#resetting-float-browser))

4. **Check for file corruption**:
   - Quit Float Browser
   - Navigate to `~/Library/Application Support/Float Browser/`
   - Rename `settings.json` to `settings.json.backup`
   - Restart Float Browser (creates new settings file)

### Settings Are Corrupted

**Problem**: Float Browser shows error about corrupted settings

**Solutions**:

1. **Float Browser should auto-reset**:
   - Float Browser detects corruption and resets to defaults
   - You should see a notification

2. **Manual reset** (see [Resetting Float Browser](#resetting-float-browser))

3. **Restore from backup**:
   - If you have a backup of `settings.json`, restore it
   - Located in `~/Library/Application Support/Float Browser/`

---

## Min Browser Features

### Min Browser Features Not Working

**Problem**: Bookmarks, history, or other Min features don't work

**Solutions**:

1. **Check Min Browser documentation**:
   - See [Min Browser wiki](https://github.com/minbrowser/min/wiki)
   - Float Browser includes all Min features

2. **Clear Min Browser data**:
   - Press `Cmd+Shift+Delete`
   - Clear relevant data

3. **Check for database corruption**:
   - Quit Float Browser
   - Navigate to `~/Library/Application Support/Float Browser/`
   - Rename `places.db` to `places.db.backup`
   - Restart (creates new database)

### Tabs or Tasks Not Working

**Problem**: Can't create tabs, switch tasks, etc.

**Solutions**:

1. **Check keyboard shortcuts**:
   - `Cmd+T` for new tab
   - `Cmd+N` for new task
   - `Cmd+E` for task overlay

2. **Restart Float Browser**:
   - UI state may be corrupted

3. **Reset to defaults**:
   - See [Resetting Float Browser](#resetting-float-browser)

---

## Resetting Float Browser

### Reset Float Settings Only

To reset only Float-specific settings (keeps Min Browser data):

1. Quit Float Browser (`Cmd+Q`)
2. Open Terminal
3. Run:
   ```bash
   defaults delete com.float-browser.float
   ```
4. Restart Float Browser

### Reset All Settings

To reset all settings (keeps browsing data):

1. Quit Float Browser (`Cmd+Q`)
2. Open Finder
3. Press `Cmd+Shift+G` and go to:
   ```
   ~/Library/Application Support/Float Browser/
   ```
4. Rename `settings.json` to `settings.json.backup`
5. Restart Float Browser

### Complete Reset

To completely reset Float Browser (deletes all data):

**Warning**: This deletes all bookmarks, history, and settings!

1. Quit Float Browser (`Cmd+Q`)
2. Open Finder
3. Press `Cmd+Shift+G` and go to:
   ```
   ~/Library/Application Support/
   ```
4. Delete the `Float Browser` folder
5. Restart Float Browser

### Reset Window Position

If Float Browser window is off-screen or stuck:

1. Quit Float Browser
2. Open Terminal
3. Run:
   ```bash
   defaults delete com.float-browser.float windowBounds
   ```
4. Restart Float Browser

---

## Reporting Bugs

### Before Reporting

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Try resetting settings** (see above)
4. **Test on a clean user account** (to rule out system conflicts)

### What to Include in Bug Reports

When reporting a bug, please include:

1. **Float Browser version**:
   - Click **Float Browser** → **About Float Browser**

2. **macOS version**:
   - Click  → **About This Mac**

3. **Mac model**:
   - Intel or Apple Silicon
   - Year and model

4. **Steps to reproduce**:
   - Detailed steps to trigger the bug
   - What you expected to happen
   - What actually happened

5. **Screenshots or videos**:
   - Visual evidence helps a lot

6. **Console logs** (if applicable):
   - Open Console.app
   - Filter for "Float Browser"
   - Copy relevant error messages

7. **Settings** (if relevant):
   - Your Float Browser settings
   - Any custom configurations

### Where to Report

- **GitHub Issues**: [Float Browser GitHub Repository]
- **Email**: [Your support email]

### Feature Requests

For feature requests:
- Check if it already exists in GitHub Issues
- Describe the use case and benefit
- Explain how it would work

---

## Getting Help

### Resources

- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Keyboard Shortcuts**: [SHORTCUTS.md](SHORTCUTS.md)
- **Min Browser Wiki**: [https://github.com/minbrowser/min/wiki](https://github.com/minbrowser/min/wiki)

### Community

- **Min Browser Discord**: [https://discord.gg/bRpqjJ4](https://discord.gg/bRpqjJ4)
- **GitHub Discussions**: [Float Browser Discussions]

---

## Common Error Messages

### "Failed to register global shortcut"

**Cause**: Another app is using the same shortcut

**Solution**: Customize the shortcut in Settings → Float Browser → Global Shortcuts

### "Failed to set opacity"

**Cause**: Window management API error

**Solution**: Restart Float Browser. If persists, check macOS version compatibility.

### "Settings file corrupted"

**Cause**: Settings file is invalid JSON or corrupted

**Solution**: Float Browser auto-resets to defaults. Your browsing data is safe.

### "Accessibility permissions required"

**Cause**: Float Browser needs accessibility permissions for global shortcuts

**Solution**: Go to System Preferences → Security & Privacy → Accessibility → Enable Float Browser

---

**Still having issues?** Please report them on GitHub with detailed information!
