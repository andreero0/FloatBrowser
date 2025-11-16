---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../user/)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# Min Browser Update Guide

This guide explains how to pull upstream updates from Min Browser into Float Browser while preserving Float-specific features.

## Overview

Float Browser is built on top of Min Browser, with Float features added as an enhancement layer. When Min Browser releases updates, we want to incorporate bug fixes, security patches, and new features while maintaining our Float functionality.

## Prerequisites

Before updating, ensure you have:

1. **Git configured with Min Browser as upstream**:
   ```bash
   git remote add upstream https://github.com/minbrowser/min.git
   git fetch upstream
   ```

2. **Clean working directory**:
   ```bash
   git status  # Should show no uncommitted changes
   ```

3. **Current Float Browser working**:
   ```bash
   npm run start  # Verify everything works before updating
   ```

4. **Backup of current state**:
   ```bash
   git branch backup-before-update-$(date +%Y%m%d)
   ```

## Update Process

### Step 1: Fetch Upstream Changes

```bash
# Fetch latest Min Browser changes
git fetch upstream

# View available tags/versions
git tag -l | grep upstream

# Or view branches
git branch -r | grep upstream
```

### Step 2: Review Changes

Before merging, review what changed in Min Browser:

```bash
# See commits since last sync
git log HEAD..upstream/master --oneline

# See file changes
git diff HEAD..upstream/master --stat

# Review specific files that Float modifies
git diff HEAD..upstream/master -- main/main.js
git diff HEAD..upstream/master -- js/browserUI.js
git diff HEAD..upstream/master -- js/default.js
git diff HEAD..upstream/master -- main/menu.js
git diff HEAD..upstream/master -- pages/settings/index.html
git diff HEAD..upstream/master -- pages/settings/settings.js
```

### Step 3: Create Update Branch

```bash
# Create a new branch for the update
git checkout -b update-min-$(date +%Y%m%d)
```

### Step 4: Merge Upstream Changes

```bash
# Merge upstream changes
git merge upstream/master

# Or merge a specific version
git merge v1.35.3  # Replace with desired version
```

**Expected Result**: Git will automatically merge most files, but will report conflicts in files that both Min and Float have modified.

### Step 5: Resolve Conflicts

Git will report conflicts in files that both projects modified. Common conflict files:

#### High-Priority Conflicts (Must Resolve Carefully)

1. **`main/main.js`** - Core initialization
2. **`package.json`** - Project metadata
3. **`scripts/buildMain.js`** - Build configuration

#### Medium-Priority Conflicts (Review Carefully)

4. **`js/browserUI.js`** - UI initialization
5. **`js/default.js`** - Module initialization
6. **`main/menu.js`** - Menu structure
7. **`pages/settings/index.html`** - Settings UI
8. **`pages/settings/settings.js`** - Settings logic
9. **`js/util/settings/settingsPreload.js`** - Settings IPC
10. **`js/menuRenderer.js`** - Menu IPC
11. **`scripts/buildBrowserStyles.js`** - CSS build
12. **`README.md`** - Documentation

For each conflict:

```bash
# View conflict
git status

# Edit the file to resolve conflicts
# Look for conflict markers: <<<<<<<, =======, >>>>>>>
```

### Step 6: Resolve Specific Files

#### Resolving `main/main.js`

This file has the most Float modifications. Conflicts typically occur in:

1. **Imports section** (top of file):
   - Keep Float module imports
   - Add any new Min imports

2. **Window creation** (~lines 200-210):
   - Keep Float's transparency options: `transparent: true`, `backgroundColor: '#00000000'`, `opacity: initialOpacity`
   - Merge any new Min window options

3. **Post-window creation** (~lines 350-365):
   - Keep Float manager initialization
   - Keep Float profiles initialization
   - Keep Float shortcuts registration
   - Merge any new Min initialization

4. **IPC handlers** (~lines 465-700):
   - Keep all Float IPC handlers
   - Add any new Min IPC handlers

5. **App lifecycle** (~lines 450-458):
   - Keep Float state saving on quit
   - Merge any new Min lifecycle handlers

**Resolution Strategy**:
```bash
# Open the file
code main/main.js

# For each conflict:
# 1. Keep Float additions (marked with // Float or /* Float */)
# 2. Merge Min changes around Float code
# 3. Test that both work together
```

#### Resolving `package.json`

```bash
# Open the file
code package.json

# Keep Float values:
# - name: "float-browser"
# - productName: "Float Browser"
# - version: "2.x.x" (Float version)
# - description: Float description

# Merge Min changes:
# - dependencies (update to Min's versions)
# - devDependencies (update to Min's versions)
# - scripts (merge any new scripts)
# - build configuration (merge changes)

# Keep Float metadata:
# - float.basedOn (update to new Min version)
# - float.upstream
```

#### Resolving `js/browserUI.js`

```bash
# Open the file
code js/browserUI.js

# Keep Float import:
# var FloatControls = require('float/floatControls.js')

# Merge any new Min imports or initialization
```

#### Resolving `js/default.js`

```bash
# Open the file
code js/default.js

# Keep Float initialization:
# var FloatControls = require('float/floatControls.js')
# var floatControls = new FloatControls()
# floatControls.initialize()

# Merge any new Min module initializations
```

#### Resolving `main/menu.js`

```bash
# Open the file
code main/menu.js

# Keep Float menu integration:
# - Float menu template creation
# - Float menu insertion between View and Developer menus
# - null filter on template array

# Merge any changes to Min's menu structure
```

#### Resolving Settings Files

```bash
# pages/settings/index.html
# Keep Float settings section (lines ~380-430)
# Merge any changes to Min's settings structure

# pages/settings/settings.js
# Keep Float settings handlers (lines ~690-750)
# Merge any changes to Min's settings logic

# js/util/settings/settingsPreload.js
# Keep Float IPC handlers (lines ~18-24)
# Merge any changes to Min's IPC handling
```

#### Resolving Build Files

```bash
# scripts/buildMain.js
# Keep Float modules in concatenation list:
# - js/float/floatSettings.js
# - js/float/floatWindowManager.js
# - js/float/floatShortcuts.js
# - js/float/floatProfiles.js
# - js/float/floatWelcome.js
# Merge any changes to build process

# scripts/buildBrowserStyles.js
# Keep Float CSS:
# - css/float/floatControls.css
# Merge any changes to CSS build process
```

#### Resolving `README.md`

```bash
# Open the file
code README.md

# Keep Float content:
# - Float Browser title and description
# - Float features section
# - Attribution to Min Browser
# - Float-specific instructions

# Merge useful Min updates:
# - New Min features (add to "Min Browser Features" section)
# - Updated system requirements
# - New troubleshooting info
```

### Step 7: Mark Conflicts as Resolved

After editing each file:

```bash
# Mark as resolved
git add main/main.js
git add package.json
git add js/browserUI.js
# ... etc for each resolved file

# Check status
git status  # Should show "all conflicts fixed"
```

### Step 8: Complete the Merge

```bash
# Commit the merge
git commit -m "Merge Min Browser v1.35.3 (or version number)

- Merged upstream changes from Min Browser
- Preserved Float features and modifications
- Resolved conflicts in main/main.js, package.json, etc.
- Updated dependencies to Min's versions
- Tested all Float features working correctly"
```

### Step 9: Update Float Metadata

Update `package.json` to reflect the new Min version:

```json
{
  "float": {
    "basedOn": "Min Browser v1.35.3",
    "upstream": "https://github.com/minbrowser/min",
    "lastSync": "2025-11-16"
  }
}
```

Update `FLOAT_MODIFICATIONS.md`:

```markdown
## Version Tracking

- **Float Browser Version**: 2.0.0
- **Based on Min Browser Version**: 1.35.3
- **Last Upstream Sync**: 2025-11-16
- **Electron Version**: 38.3.0 (or updated version)
```

### Step 10: Rebuild and Test

```bash
# Install any new dependencies
npm install

# Rebuild everything
npm run build

# Start in development mode
npm run start
```

### Step 11: Comprehensive Testing

Test all functionality:

#### Float Features
- [ ] Opacity slider (30-100%)
- [ ] Always-on-top toggle
- [ ] PIP mode toggle
- [ ] Global shortcuts (Cmd+Shift+F, A, P)
- [ ] Window profiles (Cmd+1, 2, 3)
- [ ] Float menu items
- [ ] Float settings page
- [ ] Welcome screen (first launch)
- [ ] State persistence across restarts

#### Min Features (Regression Testing)
- [ ] Tab management (create, close, switch)
- [ ] Address bar and search
- [ ] Bookmarks (create, edit, delete)
- [ ] History and full-text search
- [ ] Downloads
- [ ] Reader view
- [ ] PDF viewer
- [ ] Password manager integration
- [ ] Content blocking
- [ ] Dark mode
- [ ] Settings page (all sections)
- [ ] Keyboard shortcuts

#### Integration Testing
- [ ] Float controls appear in navbar
- [ ] Float menu appears in menu bar
- [ ] Float settings appear in settings page
- [ ] No visual inconsistencies
- [ ] No console errors
- [ ] No performance regressions

### Step 12: Run Automated Tests

```bash
# Run unit tests
npm test

# Run Float-specific tests
node tests/floatWindowManager.test.js
node tests/floatSettings.test.js
node tests/floatProfiles.test.js

# Run integration tests
node tests/integration/runAll.js
```

### Step 13: Build Distribution

If all tests pass:

```bash
# Build for macOS
npm run buildMacIntel   # Intel
npm run buildMacArm     # Apple Silicon

# Test the built application
open dist/mac-arm64/Float\ Browser.app
```

### Step 14: Commit and Tag

```bash
# Merge update branch to main
git checkout main
git merge update-min-$(date +%Y%m%d)

# Tag the release
git tag -a v2.0.1 -m "Float Browser v2.0.1 - Based on Min v1.35.3"

# Push changes
git push origin main
git push origin v2.0.1
```

## Troubleshooting

### Build Fails After Merge

**Problem**: `npm run build` fails with errors

**Solution**:
1. Check if new dependencies need to be installed: `npm install`
2. Check if build scripts changed: review `scripts/build*.js`
3. Check if Float modules are still in build order: review `scripts/buildMain.js`
4. Check console for specific error messages

### Float Features Don't Work

**Problem**: Float features broken after merge

**Solution**:
1. Check if Float modules are loaded: look for errors in console
2. Check if IPC handlers are registered: review `main/main.js`
3. Check if Float UI is initialized: review `js/default.js`
4. Check if Float CSS is loaded: review `pages/index.html`

### Min Features Broken

**Problem**: Original Min features broken after merge

**Solution**:
1. Review conflict resolutions - may have accidentally removed Min code
2. Check if Min's initialization order changed
3. Check if Min's dependencies updated (run `npm install`)
4. Compare with upstream Min to see what changed

### Conflicts Too Complex

**Problem**: Too many conflicts to resolve manually

**Solution**:
1. Abort the merge: `git merge --abort`
2. Review Min's changelog to understand changes
3. Consider updating in smaller increments (merge intermediate versions)
4. Consider cherry-picking specific commits instead of full merge

## Best Practices

### 1. Update Regularly

Don't wait too long between updates. Smaller, frequent updates are easier to merge than large, infrequent ones.

**Recommended**: Update every 1-2 months or when critical security patches are released.

### 2. Test Thoroughly

Always test both Float and Min features after merging. Regressions can be subtle.

### 3. Document Changes

Update `FLOAT_MODIFICATIONS.md` if the merge required changes to Float integration points.

### 4. Keep Float Code Isolated

When adding new Float features, keep them in `js/float/` and `css/float/` directories. This minimizes merge conflicts.

### 5. Use Feature Flags

For experimental Float features, use feature flags so they can be disabled if they conflict with Min updates.

### 6. Maintain Test Suite

Keep Float tests up to date. They'll catch regressions after merges.

## Emergency Rollback

If the update causes critical issues:

```bash
# Rollback to previous state
git reset --hard backup-before-update-$(date +%Y%m%d)

# Or rollback to specific commit
git reset --hard <commit-hash>

# Force push if already pushed (use with caution)
git push origin main --force
```

## Getting Help

If you encounter issues during the update process:

1. **Check Min Browser's changelog**: Understand what changed
2. **Review Min Browser's issues**: See if others reported similar problems
3. **Check Float Browser's issues**: See if update issues are documented
4. **Consult FLOAT_MODIFICATIONS.md**: Review integration points
5. **Ask for help**: Open an issue with details about the conflict

## Checklist

Use this checklist for each update:

- [ ] Backup current state
- [ ] Fetch upstream changes
- [ ] Review Min Browser changelog
- [ ] Create update branch
- [ ] Merge upstream changes
- [ ] Resolve all conflicts
- [ ] Update Float metadata (package.json, FLOAT_MODIFICATIONS.md)
- [ ] Rebuild application
- [ ] Test all Float features
- [ ] Test all Min features (regression testing)
- [ ] Run automated tests
- [ ] Build distribution packages
- [ ] Test built application
- [ ] Commit and tag
- [ ] Update documentation if needed

---

**Last Updated**: 2025-11-16
**Maintained By**: Float Browser Development Team
