# Documentation System Design

## Overview

This design creates a unified documentation system for Float Browser that organizes 40+ scattered markdown files into a coherent, navigable structure. The system provides a master index, consistent navigation, automated link validation, and clear categorization while preserving all existing content.

## Architecture

### Directory Structure

```
float-browser-min/
├── README.md                          # Main entry point (updated)
├── DOCUMENTATION_INDEX.md             # Master documentation index (NEW)
│
├── docs/                              # User-facing documentation
│   ├── README.md                      # User docs overview (existing)
│   ├── user/                          # User guides (NEW)
│   │   ├── USER_GUIDE.md             # Moved from docs/
│   │   ├── SHORTCUTS.md              # Moved from docs/
│   │   └── TROUBLESHOOTING.md        # Moved from docs/
│   │
│   ├── developer/                     # Developer documentation (NEW)
│   │   ├── README.md                 # Developer docs index (NEW)
│   │   ├── ARCHITECTURE.md           # Renamed from FLOAT_ARCHITECTURE.md
│   │   ├── BUILD_GUIDE.md            # Moved from root
│   │   ├── CODE_SIGNING_GUIDE.md     # Moved from root
│   │   ├── MODIFICATIONS.md          # Renamed from FLOAT_MODIFICATIONS.md
│   │   ├── MIN_UPDATE_GUIDE.md       # Moved from root
│   │   ├── ENV_SETUP.md              # Moved from root
│   │   └── LINTING_EXPLANATION.md    # Moved from root
│   │
│   ├── testing/                       # Testing documentation (NEW)
│   │   ├── README.md                 # Testing docs index (NEW)
│   │   ├── MANUAL_TESTING_GUIDE.md   # Moved from root
│   │   ├── MANUAL_TESTING_CHECKLIST.md # Moved from root
│   │   ├── START_MANUAL_TESTING.md   # Moved from root
│   │   ├── COMPREHENSIVE_TEST_PLAN.md # Moved from tests/
│   │   ├── INTEGRATION_TESTS_SUMMARY.md # Moved from tests/
│   │   ├── PERFORMANCE_OPTIMIZATIONS.md # Moved from tests/
│   │   ├── PERFORMANCE_REPORT.md     # Moved from tests/
│   │   └── CRITICAL_BUGS.md          # Moved from tests/
│   │
│   ├── release/                       # Release documentation (NEW)
│   │   ├── README.md                 # Release docs index (NEW)
│   │   ├── RELEASE_CHECKLIST.md      # Moved from root
│   │   ├── DISTRIBUTION_CHECKLIST.md # Moved from root
│   │   ├── NOTARIZATION_SETUP.md     # Moved from root
│   │   ├── NOTARIZATION_TROUBLESHOOTING.md # Moved from root
│   │   ├── RELEASE_NOTES.md          # Moved from root
│   │   ├── RELEASE_NOTES_SHORT.md    # Moved from root
│   │   ├── RELEASE_PACKAGE_STATUS.md # Moved from root
│   │   └── INSTALLATION_TEST_REPORT.md # Moved from root
│   │
│   └── archive/                       # Archived documentation (NEW)
│       ├── README.md                 # Archive index (NEW)
│       ├── CHANGELOG.md              # Consolidated task summaries (NEW)
│       ├── TASK_24_SUMMARY.md        # Moved from root
│       ├── TASK_26_COMPLETION_SUMMARY.md # Moved from root
│       ├── TASK_27.2_COMPLETION_SUMMARY.md # Moved from root
│       └── FLOAT_BROWSER_SPEC_SUMMARY.md # Moved from root
│
├── .kiro/specs/                       # Spec files (unchanged)
│   └── float-browser-v2/
│       ├── requirements.md
│       ├── design.md
│       ├── tasks.md
│       └── CODEBASE_ANALYSIS.md
│
├── tests/                             # Test files (cleaned up)
│   ├── README.md                     # Test execution guide (updated)
│   ├── *.test.js                     # Test files (unchanged)
│   └── integration/                  # Integration tests (unchanged)
│
└── scripts/                           # Build scripts (unchanged)
    └── validateDocs.js               # Link validation script (NEW)
```

## Components

### 1. Master Documentation Index

**File**: `DOCUMENTATION_INDEX.md`

**Purpose**: Central hub for all documentation with categorized links and descriptions

**Structure**:
```markdown
# Float Browser Documentation Index

Quick navigation to all Float Browser documentation.

## Getting Started
- [README](README.md) - Project overview and quick start
- [User Guide](docs/user/USER_GUIDE.md) - Complete user documentation
- [Keyboard Shortcuts](docs/user/SHORTCUTS.md) - All shortcuts reference

## User Documentation
- [User Guide](docs/user/USER_GUIDE.md) - Features, settings, and usage
- [Keyboard Shortcuts](docs/user/SHORTCUTS.md) - Complete shortcuts reference
- [Troubleshooting](docs/user/TROUBLESHOOTING.md) - Common issues and solutions

## Developer Documentation
- [Developer Overview](docs/developer/README.md) - Developer docs index
- [Architecture](docs/developer/ARCHITECTURE.md) - System architecture and design
- [Build Guide](docs/developer/BUILD_GUIDE.md) - Building for all platforms
- [Code Signing Guide](docs/developer/CODE_SIGNING_GUIDE.md) - macOS signing and notarization
- [Modifications](docs/developer/MODIFICATIONS.md) - Float-specific code changes
- [Min Update Guide](docs/developer/MIN_UPDATE_GUIDE.md) - Syncing with upstream Min
- [Environment Setup](docs/developer/ENV_SETUP.md) - Development environment
- [Linting](docs/developer/LINTING_EXPLANATION.md) - Code style and linting

## Testing Documentation
- [Testing Overview](docs/testing/README.md) - Testing docs index
- [Manual Testing Guide](docs/testing/MANUAL_TESTING_GUIDE.md) - Manual test procedures
- [Manual Testing Checklist](docs/testing/MANUAL_TESTING_CHECKLIST.md) - Test checklist
- [Start Manual Testing](docs/testing/START_MANUAL_TESTING.md) - Quick start for testing
- [Comprehensive Test Plan](docs/testing/COMPREHENSIVE_TEST_PLAN.md) - Full test coverage
- [Integration Tests Summary](docs/testing/INTEGRATION_TESTS_SUMMARY.md) - Integration test results
- [Performance Optimizations](docs/testing/PERFORMANCE_OPTIMIZATIONS.md) - Performance improvements
- [Performance Report](docs/testing/PERFORMANCE_REPORT.md) - Performance metrics
- [Critical Bugs](docs/testing/CRITICAL_BUGS.md) - Known critical issues

## Release Documentation
- [Release Overview](docs/release/README.md) - Release docs index
- [Release Checklist](docs/release/RELEASE_CHECKLIST.md) - Pre-release checklist
- [Distribution Checklist](docs/release/DISTRIBUTION_CHECKLIST.md) - Distribution steps
- [Notarization Setup](docs/release/NOTARIZATION_SETUP.md) - Apple notarization setup
- [Notarization Troubleshooting](docs/release/NOTARIZATION_TROUBLESHOOTING.md) - Notarization issues
- [Release Notes](docs/release/RELEASE_NOTES.md) - Current release notes
- [Release Notes (Short)](docs/release/RELEASE_NOTES_SHORT.md) - Brief release notes
- [Release Package Status](docs/release/RELEASE_PACKAGE_STATUS.md) - Build status
- [Installation Test Report](docs/release/INSTALLATION_TEST_REPORT.md) - Installation testing

## Archived Documentation
- [Archive Overview](docs/archive/README.md) - Archived docs index
- [Changelog](docs/archive/CHANGELOG.md) - Historical task summaries
- [Task Summaries](docs/archive/) - Individual task completion reports

## Spec Files
- [Float Browser v2 Spec](.kiro/specs/float-browser-v2/) - Complete feature specification
  - [Requirements](.kiro/specs/float-browser-v2/requirements.md)
  - [Design](.kiro/specs/float-browser-v2/design.md)
  - [Tasks](.kiro/specs/float-browser-v2/tasks.md)
  - [Codebase Analysis](.kiro/specs/float-browser-v2/CODEBASE_ANALYSIS.md)

## External Documentation
- [Min Browser Wiki](https://github.com/minbrowser/min/wiki) - Upstream Min Browser docs
- [Electron Documentation](https://www.electronjs.org/docs/latest/) - Electron framework
- [electron-builder](https://www.electron.build/) - Build tool documentation
```

### 2. Navigation Headers

**Purpose**: Consistent navigation in every documentation file

**Template**:
```markdown
---
**[📚 Documentation Index](../../DOCUMENTATION_INDEX.md)** | **[👤 User Docs](../README.md)** | **[🔧 Developer Docs](../developer/README.md)** | **[🧪 Testing](../testing/README.md)** | **[🚀 Release](../release/README.md)**

---

# [Document Title]

[Document content...]
```

**Placement**: At the top of every documentation file (after frontmatter if present)

**Customization**: Links adjusted based on file location and category

### 3. Category Index Files

**Purpose**: Provide overview and navigation within each category

#### docs/developer/README.md
```markdown
# Developer Documentation

Documentation for developers working on Float Browser.

## Quick Links
- [Architecture](ARCHITECTURE.md) - System design and architecture
- [Build Guide](BUILD_GUIDE.md) - Building for all platforms
- [Code Signing](CODE_SIGNING_GUIDE.md) - macOS signing and notarization

## Getting Started
1. Read the [Architecture](ARCHITECTURE.md) to understand the system
2. Follow [Environment Setup](ENV_SETUP.md) to configure your dev environment
3. Review [Modifications](MODIFICATIONS.md) to see Float-specific changes
4. Check [Build Guide](BUILD_GUIDE.md) to build the application

## Architecture & Design
- [Architecture](ARCHITECTURE.md) - Complete system architecture
- [Modifications](MODIFICATIONS.md) - Float-specific code changes
- [Min Update Guide](MIN_UPDATE_GUIDE.md) - Syncing with upstream

## Development
- [Environment Setup](ENV_SETUP.md) - Dev environment configuration
- [Linting](LINTING_EXPLANATION.md) - Code style and linting rules
- [Build Guide](BUILD_GUIDE.md) - Building for all platforms
- [Code Signing](CODE_SIGNING_GUIDE.md) - Signing and notarization

## Related Documentation
- [Testing Documentation](../testing/README.md)
- [Release Documentation](../release/README.md)
- [User Documentation](../user/)
```

#### docs/testing/README.md
```markdown
# Testing Documentation

Documentation for testing Float Browser.

## Quick Start
1. Read [Start Manual Testing](START_MANUAL_TESTING.md) for quick start
2. Follow [Manual Testing Guide](MANUAL_TESTING_GUIDE.md) for procedures
3. Use [Manual Testing Checklist](MANUAL_TESTING_CHECKLIST.md) to track progress

## Manual Testing
- [Start Manual Testing](START_MANUAL_TESTING.md) - Quick start guide
- [Manual Testing Guide](MANUAL_TESTING_GUIDE.md) - Complete procedures
- [Manual Testing Checklist](MANUAL_TESTING_CHECKLIST.md) - Test checklist

## Test Plans & Reports
- [Comprehensive Test Plan](COMPREHENSIVE_TEST_PLAN.md) - Full test coverage
- [Integration Tests Summary](INTEGRATION_TESTS_SUMMARY.md) - Integration results
- [Performance Report](PERFORMANCE_REPORT.md) - Performance metrics
- [Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md) - Improvements

## Issues
- [Critical Bugs](CRITICAL_BUGS.md) - Known critical issues

## Automated Tests
See [tests/README.md](../../tests/README.md) for automated test execution.

## Related Documentation
- [Developer Documentation](../developer/README.md)
- [Release Documentation](../release/README.md)
```

#### docs/release/README.md
```markdown
# Release Documentation

Documentation for releasing Float Browser.

## Quick Start
1. Review [Release Checklist](RELEASE_CHECKLIST.md)
2. Follow [Distribution Checklist](DISTRIBUTION_CHECKLIST.md)
3. Check [Release Package Status](RELEASE_PACKAGE_STATUS.md)

## Release Process
- [Release Checklist](RELEASE_CHECKLIST.md) - Pre-release checklist
- [Distribution Checklist](DISTRIBUTION_CHECKLIST.md) - Distribution steps
- [Release Package Status](RELEASE_PACKAGE_STATUS.md) - Current build status

## Notarization
- [Notarization Setup](NOTARIZATION_SETUP.md) - Apple notarization setup
- [Notarization Troubleshooting](NOTARIZATION_TROUBLESHOOTING.md) - Common issues

## Release Artifacts
- [Release Notes](RELEASE_NOTES.md) - Detailed release notes
- [Release Notes (Short)](RELEASE_NOTES_SHORT.md) - Brief version
- [Installation Test Report](INSTALLATION_TEST_REPORT.md) - Installation testing

## Related Documentation
- [Build Guide](../developer/BUILD_GUIDE.md)
- [Code Signing Guide](../developer/CODE_SIGNING_GUIDE.md)
- [Testing Documentation](../testing/README.md)
```

#### docs/archive/README.md
```markdown
# Archived Documentation

Historical documentation and task completion summaries.

## Changelog
- [Consolidated Changelog](CHANGELOG.md) - All task summaries in one place

## Task Completion Summaries
- [Task 24 Summary](TASK_24_SUMMARY.md) - Code signing and notarization
- [Task 26 Summary](TASK_26_COMPLETION_SUMMARY.md) - Testing and bug fixes
- [Task 27.2 Summary](TASK_27.2_COMPLETION_SUMMARY.md) - Final polish

## Spec Summaries
- [Float Browser Spec Summary](FLOAT_BROWSER_SPEC_SUMMARY.md) - Original spec overview

## Why Archived?
These documents contain valuable historical information but are not needed for current development or usage. They've been preserved for reference.

## Related Documentation
- [Current Spec](.kiro/specs/float-browser-v2/) - Active specification
- [Developer Documentation](../developer/README.md)
```

### 4. Consolidated Changelog

**File**: `docs/archive/CHANGELOG.md`

**Purpose**: Single document containing all task completion summaries

**Structure**:
```markdown
# Float Browser Development Changelog

Historical record of major development milestones and task completions.

## Task 27.2: Final Polish and Release Preparation
**Completed**: [Date]

[Content from TASK_27.2_COMPLETION_SUMMARY.md]

---

## Task 26: Testing and Bug Fixes
**Completed**: [Date]

[Content from TASK_26_COMPLETION_SUMMARY.md]

---

## Task 24: Code Signing and Notarization
**Completed**: [Date]

[Content from TASK_24_SUMMARY.md]

---

## Earlier Development
See individual task summary files in this directory for earlier milestones.
```

### 5. Link Validation Script

**File**: `scripts/validateDocs.js`

**Purpose**: Automated validation of all internal markdown links

**Functionality**:
- Scan all markdown files
- Extract all internal links (relative paths)
- Verify target files exist
- Verify anchor links point to valid headings
- Report broken links with file and line number
- Exit with error code if broken links found

**Usage**:
```bash
node scripts/validateDocs.js
```

**Integration**: Add to package.json scripts:
```json
{
  "scripts": {
    "validate-docs": "node scripts/validateDocs.js",
    "build": "npm run validate-docs && ..."
  }
}
```

**Output Example**:
```
Validating documentation links...

✓ README.md - 12 links OK
✓ docs/user/USER_GUIDE.md - 8 links OK
✗ docs/developer/BUILD_GUIDE.md - 1 broken link
  Line 45: Link to 'CODE_SIGNING.md' not found (should be 'CODE_SIGNING_GUIDE.md')

Found 1 broken link(s)
```

## Data Flow

### File Migration Flow

```
1. Create new directory structure
   ↓
2. Copy files to new locations
   ↓
3. Update internal links in moved files
   ↓
4. Create navigation headers
   ↓
5. Create category index files
   ↓
6. Create master index
   ↓
7. Update README.md
   ↓
8. Create redirect notes in old locations
   ↓
9. Validate all links
   ↓
10. Remove old files (after validation)
```

### Link Update Flow

```
For each moved file:
  1. Read file content
  2. Find all markdown links
  3. For each link:
     a. Determine if internal or external
     b. If internal:
        - Calculate new relative path from new location
        - Update link
  4. Add navigation header
  5. Write updated content
```

## Migration Strategy

### Phase 1: Preparation
1. Create new directory structure
2. Create category index files
3. Create master index
4. Create validation script

### Phase 2: Migration
1. Copy files to new locations (don't delete originals yet)
2. Update internal links in copied files
3. Add navigation headers to all files
4. Update README.md

### Phase 3: Validation
1. Run link validation script
2. Fix any broken links
3. Manual review of key documents
4. Test navigation flow

### Phase 4: Cleanup
1. Create redirect notes in old locations
2. Update any external references (CI, scripts, etc.)
3. Delete original files
4. Final validation

### Phase 5: Documentation
1. Update CONTRIBUTING.md with new structure
2. Update any developer onboarding docs
3. Announce changes to team

## Link Update Rules

### Relative Path Calculation

**Rule**: All internal links use relative paths from the current file

**Examples**:

From `docs/developer/BUILD_GUIDE.md` to `docs/developer/CODE_SIGNING_GUIDE.md`:
```markdown
[Code Signing Guide](CODE_SIGNING_GUIDE.md)
```

From `docs/developer/BUILD_GUIDE.md` to `docs/user/USER_GUIDE.md`:
```markdown
[User Guide](../user/USER_GUIDE.md)
```

From `docs/developer/BUILD_GUIDE.md` to `README.md`:
```markdown
[README](../../README.md)
```

From `README.md` to `docs/developer/BUILD_GUIDE.md`:
```markdown
[Build Guide](docs/developer/BUILD_GUIDE.md)
```

### Anchor Links

**Rule**: Preserve anchor links when updating paths

**Example**:
```markdown
<!-- Old -->
[Troubleshooting](TROUBLESHOOTING.md#installation-issues)

<!-- New (from root) -->
[Troubleshooting](docs/user/TROUBLESHOOTING.md#installation-issues)
```

### External Links

**Rule**: External links (http://, https://) remain unchanged

**Example**:
```markdown
[Min Browser](https://github.com/minbrowser/min)
```

## Backward Compatibility

### Redirect Notes

**Purpose**: Help users find moved documentation

**Implementation**: Create small markdown files in old locations

**Example** (`FLOAT_ARCHITECTURE.md` in root):
```markdown
# Document Moved

This document has been moved to maintain better organization.

**New Location**: [docs/developer/ARCHITECTURE.md](docs/developer/ARCHITECTURE.md)

This redirect will be removed in a future version.
```

### Git History Preservation

**Strategy**: Use `git mv` to preserve file history

```bash
git mv FLOAT_ARCHITECTURE.md docs/developer/ARCHITECTURE.md
git mv BUILD_GUIDE.md docs/developer/BUILD_GUIDE.md
# etc.
```

## Error Handling

### Missing Files

**Scenario**: Link points to non-existent file

**Detection**: Validation script checks file existence

**Resolution**: 
1. Fix link to correct path
2. Or create missing file
3. Or remove broken link

### Invalid Anchors

**Scenario**: Anchor link points to non-existent heading

**Detection**: Validation script parses headings

**Resolution**:
1. Fix anchor to match actual heading
2. Or add missing heading
3. Or remove anchor

### Circular References

**Scenario**: Document A links to B, B links to A

**Detection**: Not a problem (circular references are valid)

**Resolution**: No action needed

## Performance Considerations

### Validation Speed

**Target**: Validate all docs in < 5 seconds

**Optimization**:
- Cache file reads
- Parallel file processing
- Skip node_modules and dist directories

### Build Impact

**Target**: Add < 1 second to build time

**Implementation**:
- Run validation in parallel with other build steps
- Cache validation results
- Only re-validate changed files in watch mode

## Testing Strategy

### Manual Testing

1. **Navigation Testing**:
   - Click through all links in master index
   - Verify all category indexes work
   - Test navigation headers in each file

2. **Content Verification**:
   - Verify no content lost during migration
   - Check all code blocks render correctly
   - Verify all images display

3. **Search Testing**:
   - Test IDE search across new structure
   - Verify file names are discoverable

### Automated Testing

1. **Link Validation**:
   - Run validation script
   - Verify all internal links work
   - Check anchor links

2. **Structure Validation**:
   - Verify all expected files exist
   - Check directory structure
   - Validate file naming conventions

3. **Content Validation**:
   - Check for duplicate content
   - Verify frontmatter if used
   - Validate markdown syntax

## Maintenance

### Adding New Documentation

**Process**:
1. Determine appropriate category
2. Create file in correct directory
3. Add navigation header
4. Add entry to category index
5. Add entry to master index
6. Run validation script

### Updating Documentation

**Process**:
1. Edit file in place
2. Update links if needed
3. Run validation script
4. Update category index if title changed

### Removing Documentation

**Process**:
1. Move to archive if historical value
2. Or delete if truly obsolete
3. Remove from category index
4. Remove from master index
5. Update any links to removed doc
6. Run validation script

## Future Enhancements

### Potential Improvements

1. **Search Functionality**:
   - Add search index
   - Implement documentation search
   - Integrate with IDE search

2. **Version Control**:
   - Track documentation versions
   - Link docs to code versions
   - Show "last updated" dates

3. **Auto-generation**:
   - Generate API docs from code
   - Auto-update index files
   - Generate table of contents

4. **Interactive Features**:
   - Add copy buttons to code blocks
   - Implement collapsible sections
   - Add breadcrumb navigation

5. **Documentation Site**:
   - Generate static site from markdown
   - Host on GitHub Pages
   - Add search and navigation

## Security Considerations

### File Permissions

**Requirement**: Documentation files should be world-readable

**Implementation**: Standard file permissions (644)

### Link Safety

**Requirement**: No links to sensitive information

**Validation**: Review all external links before commit

### Content Safety

**Requirement**: No credentials or secrets in documentation

**Validation**: Scan for common secret patterns

## Success Metrics

### Quantitative Metrics

1. **Link Health**: 100% of internal links valid
2. **Coverage**: All markdown files included in index
3. **Validation Speed**: < 5 seconds
4. **Build Impact**: < 1 second added to build time

### Qualitative Metrics

1. **Discoverability**: Users can find docs in < 30 seconds
2. **Navigation**: Users can move between related docs easily
3. **Maintenance**: Adding new docs takes < 5 minutes
4. **Clarity**: Documentation structure is self-explanatory

## Implementation Notes

### File Naming Conventions

- Use UPPERCASE for major documents (README.md, ARCHITECTURE.md)
- Use kebab-case for multi-word files (CODE_SIGNING_GUIDE.md)
- Use .md extension for all markdown files
- Avoid special characters in filenames

### Directory Naming Conventions

- Use lowercase for directories (user/, developer/, testing/)
- Use singular nouns (user/ not users/)
- Keep names short and descriptive

### Content Conventions

- Use ATX-style headers (# Header)
- Use relative links for internal references
- Use absolute URLs for external references
- Include code language in fenced code blocks
- Use tables for structured data
- Include alt text for images

## Rollback Plan

### If Migration Fails

1. **Immediate Rollback**:
   ```bash
   git reset --hard HEAD~1
   ```

2. **Partial Rollback**:
   - Keep new structure
   - Restore original files
   - Fix broken links manually

3. **Forward Fix**:
   - Identify specific issues
   - Fix in place
   - Re-run validation

### Backup Strategy

1. Create branch before migration
2. Tag current state
3. Keep original files until validation passes
4. Document rollback procedure

## Timeline Estimate

- **Phase 1 (Preparation)**: 2-3 hours
- **Phase 2 (Migration)**: 3-4 hours
- **Phase 3 (Validation)**: 1-2 hours
- **Phase 4 (Cleanup)**: 1 hour
- **Phase 5 (Documentation)**: 1 hour

**Total**: 8-11 hours

## Dependencies

### Required Tools

- Node.js (for validation script)
- Git (for file moves)
- Text editor with markdown support

### Required Knowledge

- Markdown syntax
- Git operations
- File system operations
- Regular expressions (for link parsing)

## Conclusion

This design provides a comprehensive solution for organizing Float Browser's documentation. The system is:

- **Navigable**: Master index and category indexes provide clear navigation
- **Maintainable**: Clear structure and validation tools make maintenance easy
- **Scalable**: Easy to add new documentation as project grows
- **Backward Compatible**: Redirect notes help users find moved content
- **Automated**: Validation script catches broken links early

The implementation follows a phased approach with clear rollback options, ensuring a safe migration path.
