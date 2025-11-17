# Changelog

This document captures the functional evolution of the Hardware Latency Tester family of builds that ship inside this repository.

## [v4.0] - Planned
- Introduces per-event axis capture plus axis performance dashboards in execution and comparison views, allowing every direction to be benchmarked without grouping constraints (see `v4.0-release-notes.md`).
- Stores dedicated hardware assignments and requirement profiles per test case, keeping firmware, accessory, and threshold context with the exported data (`v4.0-release-notes.md`).
- Comparison intelligence calls out requirement sources, pass/fail outcomes, and per-axis deltas so reviewers can reconcile multiple executions quickly (`v4.0-release-notes.md`).
- Architecture/plan documents detail the upcoming media engine, marker management, pattern recognition, and export upgrades (video/waveform sync, WaveSurfer integration, template-based detection, FFmpeg.wasm packaging, etc.) as captured in `v4.0-architecture.md`.

## [v3.9-rc3] - Release Candidate 3
- Promotes the sandbox to `release-candidates/latency-tester-v3.9-rc3.html`, pointing the defect view at `v3.9-rc3-defects.json` while preserving the original `v3.9-rc1-defects.json` backlog for reference.
- Honors manual test-case distance overrides throughout the report and comparison dashboards and surfaces badges that reveal when a template value is supplying the bound.
- Expands the comparison cards with explicit axis/distance context and upgrades the defect register with ID-aware search plus severity/status filters and summary chips.

## [v3.9-rc2] - Release Candidate 2
- Spins up `release-candidates/latency-tester-v3.9-rc2.html`, clearly labeling the UI as the second RC build so it is not deployed in production workflows.
- Adds a reusable hardware bank that mirrors the requirement template workflow, allowing executions and imports to pull device presets instead of re-typing metadata each time.
- Refreshes the defect register to `release-candidates/v3.9-rc2-defects.json`, carrying the resolved template navigation and report metadata items that shipped earlier in RC1.

## [v3.9-rc] - Release Candidate
- Spins up `release-candidates/latency-tester-v3.9-rc.html`, clearly labeling the UI as a release candidate so it is not deployed in production workflows.
- Adds reusable requirement templates plus the relocated pass/fail controls that were previously prototyped in v3.8.1.
- Introduces a built-in defect register view that reads/writes `release-candidates/v3.9-rc-defects.json`, allowing QA to edit the canonical document directly or through the GUI.
- Reorganizes the repository structure so deprecated builds and docs live under `archive/`, keeping the root scoped to the production build, current RC, and planning artifacts.

## [v3.8.1] - Professional Edition Patch 1
- Fixes the duplicate execution-deletion helper and stray closing tags that prevented `latency-tester-v3.8.html` from loading in modern browsers. The deduped helper now accepts an optional test-case override so execution CRUD continues to work from any context.
- Produces a dedicated `latency-tester-v3.8.1.html` build (with matching UI copy) plus a redirecting `latency-tester-v3.8.html` shim so bookmarks continue to resolve after the patch upgrade.
- Updates documentation, launch scripts, and release notes to call out the patched build and the changelog entry that were missing from the original 3.8 drop.

## [v3.8] - Professional Edition
- Rebuilt UI with execution, requirements, and report views, providing CSV parsing with FPS auto-detection, manual per-axis distances, requirements management, error grouping, and printable reports (`v3.8-release-notes.md`).
- Adds include/exclude toggles, inline editing for test cases, and report selection workflows to streamline day-to-day work (`v3.8-release-notes.md`).
- Maintains and extends v3.2/v3.4 capabilities: per-axis statistics, grouped views, flexible exports, original timecode displays, and distance detection now live alongside the new multi-view layout (`v3.2-release-notes.md`, `v3.4-release-notes.md`).
- Requirements editor ensures the global pass/fail thresholds introduced in earlier versions are still enforced, satisfying the need for feature continuity from prior releases (`v3.8-release-notes.md`).

## [v3.4] - Working Version
- Fixed JSX loading issues, range display (now mm distances), and restored original timestamp visibility with detailed calculation explanations (`v3.4-release-notes.md`).
- Enhanced statistics panel shows per-axis breakdowns with distance context plus comprehensive timestamp table columns and visual pass/fail indicators (`v3.4-release-notes.md`).
- Import/export workflow highlights tested distances, axis-specific stats, and sample outputs for validation (`v3.4-release-notes.md`).

## [v3.2] - Final Production Release
- Axis grouping is default with enhanced statistics: overall min/avg/max/pass-fail plus detailed per-axis metrics and pass rates (`v3.2-release-notes.md`).
- Export options expanded to JSON/CSV/PDF, ensuring downstream compatibility and re-import support (`v3.2-release-notes.md`).
- Adds prominent test specification headers, timestamp calculation displays, strict statistics rules, and refined stage formatting for consistent reporting (`v3.2-release-notes.md`).

## [v3.0] - Enhanced Features
- Debuted column sorting, automatic error detection, axis-based grouping, and pass/fail highlighting controls for the DaVinci marker workflow (`v3-features-guide.md`).
- Improved metadata parsing for marker names plus import workflow changes that flag unmatched markers and preserve axis context (`v3-features-guide.md`).
- Delivered workflow tips, visual cues, and performance benefits that later versions build upon (`v3-features-guide.md`).

