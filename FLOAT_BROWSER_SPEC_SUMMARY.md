# Float Browser v2.0 - Spec Summary

## What This Is

Complete specification for building Float Browser v2.0 by adding window management features to Min Browser.

## Spec Location

`.kiro/specs/float-browser-v2/`

- **requirements.md** - 16 requirements with acceptance criteria (EARS/INCOSE compliant)
- **design.md** - Architecture, components, integration strategy
- **tasks.md** - 27 major tasks with 100+ subtasks organized in 11 phases

## Quick Start

1. **Read the requirements** to understand what we're building
2. **Read the design** to understand how we'll build it
3. **Start with Task 1** in tasks.md - analyze Min Browser's codebase

## Key Principles

1. **Study Min First** - Before implementing anything, study how Min does it
2. **Match Min's Style** - Float controls must look native to Min Browser
3. **Additive Approach** - Add Float modules, minimal modifications to Min
4. **Isolated Code** - All Float code in `js/float/` and `css/float/`

## What We're Adding

- **Transparency Control** - Opacity slider (30-100%)
- **Always-On-Top** - Window stays above all apps
- **PIP Mode** - Compact 400x300 window
- **Window Profiles** - Save/load window configurations
- **Global Shortcuts** - Cmd+Shift+F/A/P
- **Menu Integration** - Float menu with all features
- **Settings Integration** - Float section in Min's settings

## Implementation Timeline

- **Phase 1-2** (Days 1-5): Setup & core window management
- **Phase 3** (Days 6-8): Float UI controls
- **Phase 4** (Days 9-10): Global shortcuts
- **Phase 5** (Days 11-12): Window profiles
- **Phase 6** (Days 13-14): Menu integration
- **Phase 7** (Days 15-16): Settings integration
- **Phase 8** (Days 17-19): Testing
- **Phase 9** (Days 20-21): Documentation
- **Phase 10** (Days 22-23): Build & distribution
- **Phase 11** (Days 24-25): Final polish

**Total**: ~25 days

## Files to Create

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
```

## Files to Modify

- `main/main.js` - Window creation, IPC handlers
- `js/browserUI.js` - Initialize Float controls
- `js/settings.js` - Add Float settings section
- `pages/index.html` - Add Float CSS
- `js/menuRenderer.js` - Add Float menu

## Success Criteria

Float Browser v2.0 is ready when:

1. All Min features work without regression
2. Transparency works smoothly (30-100%)
3. Always-on-top works across all macOS contexts
4. PIP mode works correctly
5. Global shortcuts work from any application
6. Window profiles work
7. Float controls match Min's design exactly
8. Settings integrate seamlessly
9. Menu items work correctly
10. Performance impact < 10% vs Min
11. Universal binary works on Intel and Apple Silicon
12. Code signing and notarization successful
13. Documentation complete
14. All tests pass
15. No critical bugs

## Next Steps

1. Open `.kiro/specs/float-browser-v2/requirements.md` and read it
2. Open `.kiro/specs/float-browser-v2/design.md` and read it
3. Open `.kiro/specs/float-browser-v2/tasks.md` and start with Task 1

## Getting Help

- **Requirements unclear?** - Review requirements.md acceptance criteria
- **Don't know how to implement?** - Check design.md for patterns
- **Stuck on a task?** - Break it into smaller subtasks
- **Min Browser confusing?** - Study Min's code first (Task 1)

## Important Notes

- **Work Location**: `/Users/aero/float-browser-min`
- **Base**: Min Browser (already cloned here)
- **Approach**: Additive, not replacement
- **Testing**: Test after each phase
- **Documentation**: Update FLOAT_MODIFICATIONS.md as you modify Min files

Good luck! 🚀
