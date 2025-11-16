# Float Browser Tests

This directory contains unit and integration tests for the Float Browser modules.

## Test Files

### Unit Tests
- **floatWindowManager.test.js** - Tests for FloatWindowManager (opacity, always-on-top, PIP mode, state persistence)
- **floatSettings.test.js** - Tests for FloatSettings (get/set methods, validation, corrupted settings handling)
- **floatProfiles.test.js** - Tests for FloatProfiles (profile creation, application, deletion)

### Integration Tests (integration/)
- **minFeatures.test.js** - Tests Min Browser features work with Float enhancements
- **uiIntegration.test.js** - Tests visual consistency, window sizes, menu and settings integration
- **performance.test.js** - Tests opacity change speed, memory usage, and startup time
- **compatibility.test.js** - Tests macOS compatibility, architecture support, and multi-monitor scenarios

### Test Runners
- **runAll.js** - Runs all tests (unit + integration)
- **integration/runAll.js** - Runs only integration tests

## Running Tests

### Run all tests (unit + integration):
```bash
node tests/runAll.js
```

### Run only unit tests:
```bash
node tests/floatWindowManager.test.js
node tests/floatSettings.test.js
node tests/floatProfiles.test.js
```

### Run only integration tests:
```bash
node tests/integration/runAll.js
```

### Run individual integration tests:
```bash
node tests/integration/minFeatures.test.js
node tests/integration/uiIntegration.test.js
node tests/integration/performance.test.js
node tests/integration/compatibility.test.js
```

## Test Coverage

### FloatWindowManager (14 tests)
- Constructor validation
- Opacity control (valid/invalid values, boundaries)
- Always-on-top toggle
- PIP mode (enter/exit, bounds restoration)
- State persistence (save/restore)

### FloatSettings (15 tests)
- Constructor validation
- Default values initialization
- Get/set methods (simple keys and dot notation)
- Save and load persistence
- Validation (opacity, bounds, profiles)
- Corrupted JSON handling
- Reset to defaults

### FloatProfiles (18 tests)
- Constructor validation
- Default profiles (small, medium, large)
- Profile CRUD operations (create, read, update, delete)
- Profile application to window
- Validation
- Performance (< 100ms requirement)
- Reset to defaults

## Requirements Coverage

### Unit Tests
These tests cover the following requirements:

- **2.2, 2.3** - Opacity control and validation
- **3.2** - Always-on-top functionality
- **4.2** - PIP mode functionality
- **6.1, 6.2, 6.5** - Window profiles
- **9.1, 9.2, 9.3** - Settings management
- **12.2, 12.3, 12.5** - Error handling and validation

### Integration Tests
These tests cover the following requirements:

- **7.4, 7.5** - Float controls UI integration and responsive design
- **8.1** - Float menu integration
- **9.1** - Settings integration
- **10.1, 10.2, 10.3, 10.4** - Performance requirements
- **11.1, 11.2, 11.3, 11.4, 11.5** - Compatibility requirements
- **13.1, 13.2, 13.3, 13.4, 13.5** - Min Browser feature preservation

## Test Approach

The tests use:
- Node.js built-in `assert` module
- Mock objects for Electron components (BrowserWindow)
- Temporary directories for file system tests
- Synchronous operations where possible for test reliability

## Test Results

All tests pass successfully:
- **Unit Tests**: 47/47 ✓
  - FloatWindowManager: 14 tests
  - FloatSettings: 15 tests
  - FloatProfiles: 18 tests
- **Integration Tests**: 40/40 ✓
  - Min Features: 10 tests
  - UI Integration: 10 tests
  - Performance: 10 tests
  - Compatibility: 10 tests
- **Total**: 87/87 ✓

## Notes

- Tests are designed to be minimal and focused on core functionality
- Mock objects simulate Electron's BrowserWindow API
- File system tests use temporary directories that are cleaned up after each test
- All tests run independently and can be executed in any order
- Integration tests verify Float features work seamlessly with Min Browser
- Performance tests ensure Float features meet speed and memory requirements
- Compatibility tests verify support for macOS 10.13+, Intel/Apple Silicon, and multi-monitor setups
