# Float Browser v2.0 - Requirements Document

## Introduction

Float Browser v2.0 is a transparent, always-on-top web browser for macOS that combines the professional UI and features of Min Browser with unique window management capabilities. The system enables users to keep web content visible and accessible while working in other applications, providing a floating reference browser with a familiar, standards-compliant interface.

## Glossary

- **Float Browser**: The complete application system combining Min Browser UI with window management features
- **Min Browser**: The base browser platform providing standard browser functionality and UI
- **System**: Refers to Float Browser v2.0 as a whole
- **Window Manager**: The component responsible for transparency, always-on-top, and PIP functionality
- **Opacity**: The transparency level of the browser window (30% to 100%)
- **Always-On-Top**: Window behavior where the browser stays above all other applications
- **PIP Mode**: Picture-in-Picture mode providing a compact window size
- **Window Profile**: A saved configuration of window size, position, opacity, and always-on-top state
- **Global Shortcut**: System-wide keyboard shortcut that works from any application
- **Tab**: A browser tab displaying web content
- **BrowserView**: Electron component that renders web content
- **IPC**: Inter-Process Communication between main and renderer processes

## Requirements

### Requirement 1: Browser Foundation from Min Browser

**User Story:** As a user, I want all standard browser functionality so that I can browse the web effectively

#### Acceptance Criteria

1.1 THE System SHALL provide multi-tab browsing with a Chrome-style tab bar

1.2 THE System SHALL provide an address bar with autocomplete and search functionality

1.3 THE System SHALL provide bookmark management with folders and import/export capabilities

1.4 THE System SHALL provide browsing history with search functionality

1.5 THE System SHALL provide a download manager with progress tracking


### Requirement 2: Window Transparency Control

**User Story:** As a user, I want to adjust window transparency so that I can see content behind the browser while browsing

#### Acceptance Criteria

2.1 THE System SHALL provide an opacity slider control in the main toolbar

2.2 THE System SHALL allow opacity adjustment from 30 percent to 100 percent in increments of 1 percent

2.3 WHEN the user adjusts the opacity slider, THE System SHALL update window transparency within 50 milliseconds

2.4 THE System SHALL display the current opacity percentage value next to the slider

2.5 THE System SHALL persist the opacity setting across application restarts

### Requirement 3: Always-On-Top Window Behavior

**User Story:** As a user, I want the browser to stay on top of other windows so that I can reference web content while working in other applications

#### Acceptance Criteria

3.1 THE System SHALL provide a toggle button for always-on-top functionality in the main toolbar

3.2 WHEN always-on-top is enabled, THE System SHALL keep the window above all other applications

3.3 WHILE always-on-top is enabled, THE System SHALL maintain this behavior across all macOS spaces and desktops

3.4 THE System SHALL provide visual indication when always-on-top is active

3.5 THE System SHALL persist the always-on-top state across application restarts

### Requirement 4: Picture-in-Picture Mode

**User Story:** As a user, I want a compact browser mode so that I can minimize screen footprint while keeping content visible

#### Acceptance Criteria

4.1 THE System SHALL provide a toggle button for PIP mode in the main toolbar

4.2 WHEN PIP mode is activated, THE System SHALL resize the window to 400x300 pixels

4.3 WHEN PIP mode is activated, THE System SHALL save the current window bounds for restoration

4.4 WHEN PIP mode is deactivated, THE System SHALL restore the previous window size and position

4.5 WHILE in PIP mode, THE System SHALL maintain all browser functionality

### Requirement 5: Global Keyboard Shortcuts

**User Story:** As a user, I want system-wide keyboard shortcuts so that I can control the browser from any application

#### Acceptance Criteria

5.1 THE System SHALL register Cmd+Shift+F as a global shortcut to toggle window visibility

5.2 WHEN Cmd+Shift+F is pressed, THE System SHALL show the window if hidden or hide the window if visible

5.3 THE System SHALL register Cmd+Shift+A as a global shortcut to toggle always-on-top state

5.4 THE System SHALL register Cmd+Shift+P as a global shortcut to toggle PIP mode state

5.5 IF shortcut registration fails, THEN THE System SHALL log the error and continue operation

### Requirement 6: Window Size Profiles

**User Story:** As a user, I want to save and quickly switch between window size presets so that I can adapt the browser to different use cases

#### Acceptance Criteria

6.1 THE System SHALL provide three predefined Window Profiles named Small (400x300 pixels), Medium (800x600 pixels), and Large (1200x800 pixels)

6.2 THE System SHALL allow users to create custom Window Profiles with name, size, opacity, and always-on-top settings

6.3 THE System SHALL provide keyboard shortcuts Cmd+1, Cmd+2, and Cmd+3 to apply the first three Window Profiles

6.4 THE System SHALL persist all Window Profiles across application restarts

6.5 WHEN a Window Profile is applied, THE System SHALL update window bounds, opacity, and always-on-top state within 100 milliseconds

### Requirement 7: Float Controls UI Integration

**User Story:** As a user, I want Float controls integrated into the browser UI so that they are easily accessible and don't clutter the interface

#### Acceptance Criteria

7.1 THE System SHALL integrate the opacity slider into the Min Browser toolbar

7.2 THE System SHALL integrate the always-on-top toggle button into the Min Browser toolbar

7.3 THE System SHALL integrate the PIP mode toggle button into the Min Browser toolbar

7.4 THE System SHALL render Float controls using the same CSS classes and visual styling as Min Browser controls

7.5 WHILE the window width is 400 pixels or greater, THE System SHALL display all Float controls

### Requirement 8: Float Menu Integration

**User Story:** As a user, I want access to Float features through standard menu navigation so that I can discover and use all features

#### Acceptance Criteria

8.1 THE System SHALL provide a Float menu in the menu bar containing all Float feature controls

8.2 THE System SHALL provide opacity preset menu items for 100 percent, 90 percent, 80 percent, 70 percent, and 50 percent

8.3 THE System SHALL display keyboard shortcuts in menu items where shortcuts exist

8.4 THE System SHALL display checkmarks next to menu items representing the current active state

8.5 THE System SHALL provide a Window Profiles submenu containing all saved Window Profiles

### Requirement 9: Settings Integration

**User Story:** As a user, I want to configure Float features in the settings panel so that I can customize default behavior

#### Acceptance Criteria

9.1 THE System SHALL provide a Float section in the Min Browser settings panel

9.2 THE System SHALL allow users to configure default opacity value for new windows

9.3 THE System SHALL allow users to configure default always-on-top state for new windows

9.4 THE System SHALL allow users to configure Global Shortcut key combinations

9.5 THE System SHALL allow users to create, edit, and delete Window Profiles in settings

### Requirement 10: Performance Requirements

**User Story:** As a user, I want the browser to perform well so that Float features don't impact browsing experience

#### Acceptance Criteria

10.1 WHEN Opacity is changed, THE System SHALL apply the change within 50 milliseconds

10.2 THE System SHALL maintain memory usage within 10 percent of the Min Browser baseline memory usage

10.3 THE System SHALL maintain startup time within 500 milliseconds of the Min Browser baseline startup time

10.4 WHILE rendering web content at any Opacity level from 30 percent to 100 percent, THE System SHALL maintain frame rate above 30 frames per second

10.5 WHEN Opacity changes occur at intervals less than 100 milliseconds, THE System SHALL render updates without visual artifacts

### Requirement 11: Compatibility Requirements

**User Story:** As a user, I want the browser to work on my Mac so that I can use it regardless of my hardware

#### Acceptance Criteria

11.1 THE System SHALL support macOS version 10.13 or later

11.2 THE System SHALL provide a universal binary supporting both Intel x64 and Apple Silicon ARM64 architectures

11.3 THE System SHALL maintain window management features when used with multiple monitors

11.4 THE System SHALL maintain Always-On-Top behavior when used with macOS Spaces and Mission Control

11.5 THE System SHALL maintain Always-On-Top behavior when other applications enter fullscreen mode

### Requirement 12: Reliability Requirements

**User Story:** As a user, I want the browser to be stable so that I don't lose my work

#### Acceptance Criteria

12.1 IF a window management operation fails, THEN THE System SHALL log the error and continue operation

12.2 IF Opacity setting fails to apply, THEN THE System SHALL revert to the previous Opacity value

12.3 IF Always-On-Top activation fails, THEN THE System SHALL display an error notification to the user

12.4 THE System SHALL save window state every 30 seconds

12.5 IF the settings file is corrupted, THEN THE System SHALL restore default settings and display a notification to the user

### Requirement 13: Min Browser Feature Preservation

**User Story:** As a user, I want all Min Browser features to work so that I don't lose functionality

#### Acceptance Criteria

13.1 THE System SHALL provide all Min Browser tab management features

13.2 THE System SHALL provide all Min Browser bookmark features

13.3 THE System SHALL provide all Min Browser history features

13.4 THE System SHALL provide all Min Browser privacy features

13.5 THE System SHALL provide all Min Browser keyboard shortcuts without key combination conflicts

### Requirement 14: Code Signing and Distribution

**User Story:** As a user, I want to install the browser easily so that macOS doesn't block it

#### Acceptance Criteria

14.1 THE System SHALL be code-signed with a valid Apple Developer certificate

14.2 THE System SHALL be notarized by Apple for Gatekeeper compatibility

14.3 THE System SHALL provide a DMG installer package

14.4 THE System SHALL include entitlements for window management operations

14.5 WHEN installed on macOS, THE System SHALL pass Gatekeeper security checks without displaying warnings

### Requirement 15: Documentation Requirements

**User Story:** As a user, I want clear documentation so that I can learn how to use Float features

#### Acceptance Criteria

15.1 THE System SHALL provide a README file containing feature overview and installation instructions

15.2 THE System SHALL provide a user guide documenting all Float features

15.3 THE System SHALL provide a keyboard shortcuts reference document

15.4 THE System SHALL provide a troubleshooting guide documenting common issues and solutions

15.5 WHEN the System is launched for the first time, THE System SHALL display a welcome screen explaining Float features

### Requirement 16: Maintainability Requirements

**User Story:** As a developer, I want Float code to be maintainable so that I can update Min Browser easily

#### Acceptance Criteria

16.1 THE System SHALL isolate Float-specific code in separate module directories

16.2 THE System SHALL provide documentation listing all modifications to Min Browser code files

16.3 THE System SHALL implement Float functionality in separate modules from Min Browser functionality

16.4 THE System SHALL provide a migration guide documenting the process for integrating upstream Min Browser updates

16.5 THE System SHALL implement Float features using Min Browser architecture patterns
