# Flyff Skill Simulator Changelog

All notable changes to this project will be documented in this file.

## 📍 [1.4.0] - 2025-07-05

- added: Class data caching system with 1-day cache duration
- added: Image caching system with 7-day cache duration for FlyFF API images
- added: Custom EdgeLabel component with better text stroke rendering
- added: Skill level controls (increase, decrease, max, reset to 0)
- added: Tooltip close button (X) for skill information
- added: Select component from shadcn/ui for class selection
- updated: Multi-language support for class names (en, th, jp, vi, cns)
- changed: ClassSelected from DropdownMenu to Select component
- changed: Tooltip to only wrap skill images instead of entire skill nodes
- changed: API optimization - fetch all class data in single request
- improved: Skill tree edge labels with better zoom visibility
- improved: Tooltip UI with responsive text sizes and separators
- fixed: Tooltip event handling to prevent conflicts with skill controls

## 📍 [1.3.0] - 2025-07-02

- added: DEMO! Multi-Language & Font system (en, th, jp, vi, cns)
- updated: cspell.json file

## 📍 [1.2.1] - 2025-07-02

- fixed: theme color issue (on SkillNode Tooltip)

## 📍 [1.2.0] - 2025-07-01

- added: CHANGELOG.md
- added: Cursor file (Grab, Help, Idle, Pointer)
- added: Theme Color (default, red, rose, orange, green, blue, yellow, violet)
- added: shadcn/ui menubar
- changed: SkillNode UX/UI Design
- changed: websiteStore (removed: guidePanel, added: colorTheme)
- changed: websiteStore temporary -> persist store
- changed: Navbar UX/UI Design
- changed: Layout.tsx code pattern
- removed: GuideButton
- removed: GuidePanel
- removed: SkillStyleToggle
- removed: ThemeToggle

## 📍 [1.0.0-1.1.1] - 2025-05-13

Release first version - Flyff Universe Skill Simulator with React Flow
