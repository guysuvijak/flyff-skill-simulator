# Flyff Skill Simulator Changelog

All notable changes to this project will be documented in this file.

## 📍 [1.5.2] - 2025-07-09

- fixed: Load build from file (issue load skill)
- changed: separate dialog file (load build & share build)

## 📍 [1.5.1] - 2025-07-09

- fixed: Load build dialog (translate not load)

## 📍 [1.5.0] - 2025-07-09

This major release introduces comprehensive build sharing and loading functionality, allowing users to save, share, and load their skill
builds with others. The new system supports both URL-based sharing and file-based import/export, making it easier than ever to collaborate on
builds and backup your configurations.

- added: Build sharing system with URL generation and file import/export
- added: Build loading with support for URLs and encoded data
- added: File upload/download for JSON build files
- added: Copy-to-clipboard for build links and data
- improved: Build data encoding with LZ-string compression
- improved: UX/UI Design for cleat & clean (Load & Share build)
- fixed: Build validation and error handling

## 📍 [1.4.2] - 2025-07-07

This patch addresses a long-standing critical issue where skill points would reset after upgrading skills, preventing users from properly leveling up their character builds. We've also enhanced the overall UX/UI to provide better user experience and clearer feedback about what's happening during skill operations.

- improved: Loading state UX by showing loader in ReactFlow area instead of full screen
- improved: Error state display to maintain navbar visibility
- improved: setToMaxLevel function to upgrade skills with available points even when insufficient for full upgrade
- changed: Loading and error states to use conditional rendering within ReactFlow container
- changed: Package.json description, keywords
- fixed: Skill upgrade button disabled state to allow partial upgrades when points are limited
- fixed: Critical bug where skill points would disappear after increasing/decreasing skill levels, preventing proper character progression (resolved)
- fixed: metadata github username

## 📍 [1.4.1] - 2025-07-06

- added: Comprehensive SEO optimization with enhanced metadata
- added: Structured data (JSON-LD) for better search engine understanding (WebApplication)
- added: Sitemap.xml for improved search engine indexing (single-page application)
- added: Robots.txt for search engine crawling guidance
- added: Browserconfig.xml for Windows tiles support
- added: Enhanced manifest.json with PWA features and shortcuts
- added: Next-SEO configuration file for advanced SEO settings
- added: New language support (Brazilian Portuguese, German, French, Indonesian, Korean, Spanish)
- updated: Meta tags with comprehensive keywords for all Flyff classes
- updated: OpenGraph and Twitter card metadata for better social sharing
- updated: Description to be more SEO-friendly and descriptive
- updated: Application name and PWA configuration
- improved: Search engine visibility with proper robots directives
- improved: Mobile app experience with enhanced PWA configuration

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
