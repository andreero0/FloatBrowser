# Float Browser

Float Browser is a transparent, always-on-top web browser for macOS that combines the professional UI and features of Min Browser with unique window management capabilities. Keep web content visible and accessible while working in other applications.

## Float Features

- **Window Transparency**: Adjust opacity from 30% to 100% with a convenient slider
- **Always-On-Top**: Keep the browser above all other applications across all spaces
- **Picture-in-Picture Mode**: Compact window mode for minimal screen footprint
- **Window Profiles**: Save and quickly switch between window size presets
- **Global Shortcuts**: Control the browser from any application with system-wide keyboard shortcuts

## Min Browser Features (Included)

Float Browser is built on Min Browser and includes all its excellent features:

- Full-text search for visited pages
- Ad and tracker blocking
- Automatic reader view
- Tasks (tab groups)
- Bookmark tagging
- Password manager integration
- Dark theme

## Based on Min Browser

Float Browser v2.0.0 is based on [Min Browser v1.35.2](https://github.com/minbrowser/min). All credit for the core browser functionality goes to the Min Browser team and contributors.

## Support Min Browser

Float Browser is built on the excellent foundation of Min Browser. Please consider supporting the original Min Browser project:

- [Min Browser on GitHub](https://github.com/minbrowser/min)
- [Become a Min Browser sponsor](https://github.com/sponsors/PalmerAL)

## Screenshots

Float Browser includes all Min Browser features with added window management capabilities.

<img alt="The search bar, showing information from DuckDuckGo" src="http://minbrowser.org/tour/img/searchbar_duckduckgo_answers.png" width="650"/>

<img alt="The Tasks Overlay" src="http://minbrowser.org/tour/img/tasks.png" width="650"/>

<img alt="Reader View" src="https://user-images.githubusercontent.com/10314059/53312382-67ca7d80-387a-11e9-9ccc-88ac592c9b1c.png" width="650"/>

## Installing

### System Requirements

- **macOS 10.13 (High Sierra) or later**
- Intel x64 or Apple Silicon (ARM64) processor
- 200 MB disk space

### Installation from DMG (Recommended)

1. Download the latest Float Browser DMG from the releases page
2. Open the DMG file
3. Drag Float Browser to your Applications folder
4. Launch Float Browser from Applications
5. If prompted by macOS security, go to System Preferences → Security & Privacy and click "Open Anyway"

### Building from Source

If you want to build Float Browser yourself:

1. Install [Node.js](https://nodejs.org) (v16 or later recommended)
2. Clone this repository: `git clone https://github.com/yourusername/float-browser-min.git`
3. Navigate to the directory: `cd float-browser-min`
4. Install dependencies: `npm install`
5. Build for your platform:
   - Intel Macs: `npm run buildMacIntel`
   - Apple Silicon Macs: `npm run buildMacArm`
6. The built application will be in the `dist/` directory

**Note**: Float Browser v2.0 is designed specifically for macOS and includes window management features that leverage macOS APIs.

## Float Browser Shortcuts

Float Browser includes these global keyboard shortcuts:

- `Cmd+Shift+F` - Toggle window visibility
- `Cmd+Shift+A` - Toggle always-on-top
- `Cmd+Shift+P` - Toggle Picture-in-Picture mode
- `Cmd+1/2/3` - Apply window profiles (Small/Medium/Large)

## Getting Started

* Float Browser includes all Min Browser features. See the [Min Browser wiki](https://github.com/minbrowser/min/wiki) for an overview of available features and keyboard shortcuts.
* Float Browser supports userscripts. See the [Min userscript documentation](https://github.com/minbrowser/min/wiki/userscripts) for instructions.
* For Min Browser support, join the [Min Discord server](https://discord.gg/bRpqjJ4).

## Developing

If you want to develop Float Browser:

- Install [Node](https://nodejs.org).
- Run `npm install` to install dependencies.
- Start Float Browser in development mode by running `npm run start`.
- After you make changes, press `opt+cmd+r` to reload the browser UI.
- See `FLOAT_MODIFICATIONS.md` for details on Float-specific code and integration points.

### Testing

Float Browser includes test scripts for verifying code signing and notarization:

```bash
# Test code signing configuration
npm run testSigning

# Test notarization configuration
npm run testNotarization
```

For detailed information on code signing and notarization, see [CODE_SIGNING_GUIDE.md](CODE_SIGNING_GUIDE.md).

### Building binaries

Float Browser is designed for macOS. To build from source:

- `npm run buildMacIntel` - Build for Intel Macs
- `npm run buildMacArm` - Build for Apple Silicon Macs

**Requirements for macOS builds**:
- Install Xcode and command-line tools
- You may need to set your default SDK to macOS 11.0 or higher: `export SDKROOT=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.1.sdk`
- The exact command depends on your Xcode installation and SDK version

**Note**: While the underlying Min Browser supports Windows and Linux, Float Browser's window management features are currently macOS-specific.

## Contributing to Float Browser

Thanks for your interest in Float Browser!

### Getting Help

If you're experiencing a bug or have a suggestion for Float Browser, please open an issue.

### Contributing Code

- Start by following the development instructions listed above.
- Review `FLOAT_MODIFICATIONS.md` to understand Float-specific code organization.
- See the [Min Browser architecture overview](https://github.com/minbrowser/min/wiki/Architecture) for the underlying browser architecture.
- Float Browser uses the [Standard](https://github.com/feross/standard) code style; [most editors](https://standardjs.com/#are-there-text-editor-plugins) have plugins available to auto-format your code.

### Contributing to Min Browser

For contributions to the underlying Min Browser features, please contribute directly to the [Min Browser project](https://github.com/minbrowser/min).

## License

Float Browser is licensed under Apache-2.0, the same license as Min Browser.

## Acknowledgments

Float Browser is built on [Min Browser](https://github.com/minbrowser/min) by PalmerAL and contributors. All core browser functionality is provided by the Min Browser project.
