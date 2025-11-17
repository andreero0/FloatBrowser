---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[📦 Archive Overview](README.md)** | **[📝 Changelog](CHANGELOG.md)**

---

> **Note**: This document has been archived as it contains historical information about the v2.0.0 release announcement. It has been preserved for reference.

---

# Float Browser v2.0.0 - Official Release Announcement

**Release Date:** November 16, 2024

---

## 🎉 Introducing Float Browser v2.0.0

We're excited to announce the release of **Float Browser v2.0.0** - a transparent, always-on-top web browser for macOS that transforms how you browse while working.

Float Browser combines the clean, professional interface of Min Browser with powerful window management features, creating the perfect reference browser for developers, designers, researchers, and anyone who needs to keep web content visible while working in other applications.

---

## 🌟 What Makes Float Browser Special?

### The Problem We Solve

Ever needed to reference documentation while coding? Watch a tutorial while following along? Monitor a dashboard while working? Traditional browsers force you to constantly switch windows, breaking your flow and losing context.

### The Float Browser Solution

Float Browser stays visible above your work, with adjustable transparency so you can see both your work and your reference material simultaneously. It's like having a second monitor, but better - because it's exactly where you need it, when you need it.

---

## ✨ Key Features

### 🔍 **Adjustable Window Transparency**
Make Float Browser as transparent or opaque as you need. The smooth opacity slider lets you adjust from 30% (very transparent) to 100% (fully opaque) in real-time. Perfect for keeping reference material visible without obscuring your work.

**Use Cases:**
- Keep documentation visible at 70% while coding
- Monitor dashboards at 50% opacity while working
- Watch tutorials at 80% while following along

### 📌 **Always-On-Top Mode**
Float Browser stays above all other windows, even when you're working in other applications. Works seamlessly across all macOS Spaces, Mission Control, and even when other apps go fullscreen.

**Use Cases:**
- Reference API documentation while coding
- Keep chat or video calls visible during work
- Monitor social media or news feeds
- Display live data dashboards

### 🖼️ **Picture-in-Picture Mode**
Compact 400×300 window mode for minimal screen footprint. Perfect for video content, monitoring, or quick reference. Automatically enables always-on-top and saves your previous window size for easy restoration.

**Use Cases:**
- Watch videos in a corner while working
- Monitor a specific webpage with minimal space
- Keep messaging apps visible in compact form

### ⌨️ **Global Keyboard Shortcuts**
Control Float Browser from any application with system-wide shortcuts. No need to switch windows or break your flow.

- `Cmd+Shift+F` - Show/hide Float Browser instantly
- `Cmd+Shift+A` - Toggle always-on-top mode
- `Cmd+Shift+P` - Toggle Picture-in-Picture mode
- `Cmd+1/2/3` - Quick-switch between window profiles

### 📐 **Window Size Profiles**
Save and instantly switch between different window configurations. Three built-in profiles plus unlimited custom profiles.

**Built-in Profiles:**
- **Small** (400×300) - 80% opacity, always-on-top - Perfect for monitoring
- **Medium** (800×600) - 90% opacity, always-on-top - Great for documentation
- **Large** (1200×800) - 100% opacity, normal mode - Ideal for primary browsing

---

## 🏗️ Built on Min Browser

Float Browser is built on the excellent foundation of [Min Browser v1.35.2](https://github.com/minbrowser/min), which means you get all of Min's powerful features:

✅ **Full-text search** for browsing history  
✅ **Built-in ad and tracker blocking**  
✅ **Automatic reader view** for articles  
✅ **Tasks system** for organizing tab groups  
✅ **Bookmark management** with tagging  
✅ **Password manager integration** (Bitwarden, 1Password, Keychain)  
✅ **Dark mode support**  
✅ **Page translation**  
✅ **Focus mode** to prevent distractions  

All Min Browser features work identically in Float Browser - we've added Float features without compromising any of Min's excellent functionality.

---

## 💻 System Requirements

- **macOS 10.13 (High Sierra) or later**
- **Intel x64 or Apple Silicon (ARM64)**
- **Universal Binary** - One app works on both architectures
- **200 MB disk space**

### Full Compatibility

✅ Intel Macs - Native x64 support  
✅ Apple Silicon Macs - Native ARM64 support  
✅ Multiple monitors - Full multi-display support  
✅ macOS Spaces - Always-on-top across all spaces  
✅ Mission Control - Maintains features across desktops  
✅ Fullscreen apps - Always-on-top persists  

---

## 📦 Download and Installation

### Download

**Float Browser v2.0.0 Universal Binary**
- File: `Float Browser-2.0.0-universal.dmg`
- Size: 204 MB
- Works on both Intel and Apple Silicon Macs

[Download from Releases Page](#) *(link to be added)*

### Quick Installation

1. Download the DMG file
2. Open the DMG
3. Drag Float Browser to Applications
4. Launch from Applications

### First Launch Note

On first launch, macOS may show a security warning because the app is not yet notarized:

1. Right-click Float Browser.app
2. Select "Open" from the menu
3. Click "Open" in the dialog

The app is code-signed with an Apple Developer certificate. Notarization will be enabled in a future release.

---

## 🚀 Quick Start

### 5-Minute Getting Started Guide

1. **Launch Float Browser** from Applications
2. **Browse normally** - all standard browser features work as expected
3. **Try transparency** - drag the opacity slider in the toolbar
4. **Enable always-on-top** - click the pin button (📌)
5. **Test PIP mode** - click the compress button (⤢)
6. **Use global shortcuts** - press `Cmd+Shift+F` from any app to show/hide Float Browser

### Recommended First-Time Setup

1. Open Preferences (`Cmd+,`)
2. Scroll to "Float Browser" section
3. Set your preferred default opacity (we recommend 90%)
4. Enable "Start Always-On-Top" if you want it on by default
5. Try the three built-in window profiles (`Cmd+1`, `Cmd+2`, `Cmd+3`)

---

## 🎯 Real-World Use Cases

### For Developers

**Scenario:** You're coding and need to reference API documentation.

**Float Browser Solution:**
1. Press `Cmd+Shift+F` to show Float Browser
2. Press `Cmd+2` for Medium profile (800×600)
3. Set opacity to 70% with the slider
4. Always-on-top is already enabled
5. Position on the right side of your screen
6. Code in your editor while documentation stays visible

**Result:** No more window switching. Documentation is always visible but doesn't obscure your code.

### For Designers

**Scenario:** You're designing in Figma and need to reference inspiration or client feedback.

**Float Browser Solution:**
1. Apply Small profile (`Cmd+1`) for compact reference
2. Set opacity to 60% for subtle overlay
3. Position in a corner
4. Reference images stay visible while you design

**Result:** Seamless reference without disrupting your creative flow.

### For Researchers

**Scenario:** You're writing a paper and need to reference multiple sources.

**Float Browser Solution:**
1. Use Large profile (`Cmd+3`) for comfortable reading
2. Keep opacity at 90-100% for text readability
3. Use Min Browser's Tasks feature to organize sources by topic
4. Toggle always-on-top on/off as needed

**Result:** Efficient research with organized sources and easy reference.

### For Content Creators

**Scenario:** You're editing a video and following a tutorial.

**Float Browser Solution:**
1. Enable PIP mode (`Cmd+Shift+P`) for compact tutorial window
2. Set opacity to 80%
3. Position in a corner of your screen
4. Tutorial stays visible while you work in your video editor

**Result:** Follow along without pausing or switching windows.

### For Multitaskers

**Scenario:** You need to monitor multiple things while working.

**Float Browser Solution:**
1. Use Medium profile for monitoring dashboards
2. Set opacity to 50% for subtle background presence
3. Enable always-on-top
4. Monitor social media, news, or live data while working

**Result:** Stay informed without constant window switching.

---

## 📚 Documentation

We've created comprehensive documentation to help you get the most out of Float Browser:

### User Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete feature walkthrough with examples
- **[Keyboard Shortcuts](docs/SHORTCUTS.md)** - All shortcuts reference (Float + Min)
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Release Notes](RELEASE_NOTES.md)** - Detailed release information

### Developer Documentation

- **[Float Architecture](FLOAT_ARCHITECTURE.md)** - Technical architecture overview
- **[Float Modifications](FLOAT_MODIFICATIONS.md)** - Changes to Min Browser codebase
- **[Build Guide](BUILD_GUIDE.md)** - Building Float Browser from source
- **[Min Update Guide](MIN_UPDATE_GUIDE.md)** - Updating the Min Browser base

---

## 🎬 See Float Browser in Action

### Screenshots

*(Screenshots to be added - see ANNOUNCEMENT_MEDIA_GUIDE.md for requirements)*

1. **Main Interface** - Float Browser with opacity slider and Float controls
2. **Transparency Demo** - Browser at 70% opacity over code editor
3. **Always-On-Top** - Float Browser staying visible over other apps
4. **PIP Mode** - Compact window mode in action
5. **Window Profiles** - Quick-switching between profiles
6. **Settings Panel** - Float Browser settings integration

### Demo Video

*(Demo video to be created - see ANNOUNCEMENT_MEDIA_GUIDE.md for script)*

**Video Outline:**
1. Introduction (0:00-0:15)
2. Transparency feature demo (0:15-0:45)
3. Always-on-top demo (0:45-1:15)
4. PIP mode demo (1:15-1:45)
5. Global shortcuts demo (1:45-2:15)
6. Window profiles demo (2:15-2:45)
7. Real-world use case (2:45-3:30)
8. Call to action (3:30-3:45)

---

## 🙏 Credits and Thanks

### Min Browser Team

Float Browser would not exist without the excellent foundation provided by [Min Browser](https://minbrowser.org/). Huge thanks to PalmerAL and all Min Browser contributors for creating such a solid, privacy-focused browser.

**Please support Min Browser:**
- [Min Browser on GitHub](https://github.com/minbrowser/min)
- [Become a Min Browser sponsor](https://github.com/sponsors/PalmerAL)

### Open Source

Float Browser is open source under the Apache 2.0 license, same as Min Browser. We believe in transparency and community-driven development.

---

## 🗺️ What's Next?

### Planned for v2.1.0

- ✨ **Apple Notarization** - Seamless installation without security warnings
- ✨ **Cloud Sync** - Sync settings and profiles across devices
- ✨ **Advanced Window Management** - Tiling, snapping, and positioning presets
- ✨ **Multi-Monitor Profiles** - Different profiles for different monitor setups
- ✨ **Conditional Profiles** - Auto-switch profiles based on time or active app
- ✨ **Custom Themes** - Personalize Float Browser's appearance

### Long-Term Vision

- Cross-platform support (Windows, Linux)
- Browser extension API
- Advanced automation features
- Integration with system-wide shortcuts and workflows

---

## 💬 Community and Support

### Get Help

- **Documentation:** Check the [docs/](docs/) directory
- **Troubleshooting:** See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Issues:** Report bugs on GitHub *(link to be added)*

### Share Your Experience

We'd love to hear how you're using Float Browser! Share your workflows, tips, and feedback:

- Twitter: *(handle to be added)*
- GitHub Discussions: *(link to be added)*
- Discord: *(link to be added)*

### Contributing

Float Browser is open source and welcomes contributions:

- Report bugs and request features on GitHub
- Submit pull requests for improvements
- Help improve documentation
- Share Float Browser with others who might find it useful

---

## 📄 License

Float Browser is licensed under the Apache License 2.0, same as Min Browser.

---

## 🎊 Download Float Browser Today

**Float Browser v2.0.0** is available now for macOS.

[**Download Float Browser**](#) *(link to be added)*

Transform your browsing workflow. Keep web content visible while you work. Browse without boundaries.

---

**Float Browser v2.0.0**  
*A transparent, always-on-top browser for macOS*  
Built on Min Browser v1.35.2

---

## Frequently Asked Questions

### Is Float Browser free?

Yes! Float Browser is free and open source under the Apache 2.0 license.

### How is Float Browser different from Min Browser?

Float Browser adds window management features (transparency, always-on-top, PIP mode, profiles, global shortcuts) to Min Browser. All Min Browser features remain unchanged.

### Can I use Float Browser alongside Min Browser?

Yes! Float Browser and Min Browser are separate applications and can run simultaneously. They use different data directories and settings.

### Will Float Browser receive updates?

Yes! We plan to maintain Float Browser and add new features. We'll also pull in updates from Min Browser to keep the foundation current.

### Does Float Browser support Windows or Linux?

Currently, Float Browser is macOS-only because the window management features use macOS-specific APIs. Cross-platform support is being considered for future releases.

### Why isn't Float Browser notarized?

Notarization requires an Apple Developer Program membership ($99/year). We're working on getting this set up for v2.1.0. The app is code-signed and safe to use.

### How do I migrate from Min Browser?

Float Browser uses separate data directories. You can export bookmarks from Min and import them to Float. Settings need to be configured manually. Both browsers can coexist.

### Can I customize the global shortcuts?

Yes! Go to Preferences → Float Browser → Configure Shortcuts to customize all global keyboard shortcuts.

### Does transparency affect performance?

Transparency uses GPU acceleration and has minimal performance impact on modern Macs. On older Macs, you may notice slight lag when changing opacity. Using preset opacity values (100%, 90%, 80%) instead of the slider can help.

### How do I report bugs or request features?

Open an issue on the Float Browser GitHub repository *(link to be added)*. Please include your macOS version, architecture (Intel/Apple Silicon), and steps to reproduce.

---

**Thank you for your interest in Float Browser!**

We hope Float Browser enhances your productivity and transforms how you browse while working.

*Happy Floating!* 🎈
