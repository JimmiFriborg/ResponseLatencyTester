# ResponseLatencyTester

A collection of self-contained Hardware Latency Tester builds (portable HTML+JS) together with the planning artifacts that document how each version evolved.

## Functionality Overview
- **Latency execution workspace** – Manage test cases, executions, timestamps, and requirements with the multi-view React interface delivered in `latency-tester-v3.8.1.html` (the v3.8.1 patch build). CSV parsing includes FPS auto-detection, manual per-axis distances, grouped error handling, include/exclude toggles, and professional PDF-ready reporting. (See `v3.8-release-notes.md` for the full feature rundown.)
- **Versioned HTML packages** – Standalone HTML builds for every milestone (`latency-tester-v3.0.html` through `latency-tester-v3.8.1.html`, plus the in-flight v4.0 planning docs) make it easy to bisect functionality or run older workflows. The legacy `latency-tester-v3.8.html` remains as a redirect shim for compatibility with older bookmarks.
- **DaVinci Resolve marker support** – Timestamp parsing honors the marker naming convention introduced in v3.0, including axis/direction metadata extraction, automatic pairing, and error detection noted in `v3-features-guide.md`.
- **Reporting & exports** – v3.2 and later releases expose JSON/CSV/PDF exports, per-axis statistics, requirements compliance summaries, and distance-aware report layouts, enabling teams to adopt whichever artifact best fits their process (`v3.2-release-notes.md`, `v3.4-release-notes.md`).

## Usage Guide
### Run the professional build (v3.8.1)
1. Open `latency-tester-v3.8.1.html` in a Chromium, Firefox, or Safari browser (older references to `latency-tester-v3.8.html` will automatically redirect).
2. Import DaVinci Resolve CSV exports or JSON bundles via the import controls.
3. Capture manual axis distances, configure requirements, and curate which test cases should appear in the printable report view.
4. Export CSV/JSON/PDF artifacts directly from the UI for archival or sharing.

### Run the portable build with embedded Babel
1. Keep `latency-tester-portable.html` and the `vendor/` folder (especially `vendor/babel-standalone.min.js`) in the same directory before opening the file.
2. Double-click the HTML file; React/ReactDOM are still served from the CDN, but Babel now loads from the local vendor copy, ensuring offline compatibility. If Babel fails to initialize, the page now explains which file is missing.
3. Because the portable build mirrors the v3.8.1 feature set, any exports you create remain compatible with other v3.8+ builds.

### Optional launch scripts
- `launch.py` boots a lightweight static file server when you prefer to run the app from `http://localhost:8000/` instead of double-clicking the HTML file.
- `launch-unix.sh` and `launch-windows.bat` wrap the same behavior for shell users.

## Feature Set Timeline
### Past releases (v3.0 → v3.4)
- v3.0 delivered the foundation: sortable tables, axis grouping, pass/fail highlighting, and improved metadata parsing (`v3-features-guide.md`).
- v3.2 made grouped axis statistics the default view, introduced multi-format exports, and tightened timestamp/stage presentations (`v3.2-release-notes.md`).
- v3.4 fixed JSX loading bugs, added mm-based distance displays, original timecode references, and refined statistics/timestamp cards (`v3.4-release-notes.md`).

### Current release (v3.8.1)
- The Professional Edition rebuild spans execution, requirements, and report views with FPS auto-detection, manual axis distances, error grouping, include/exclude toggles, editable test cases, and curated print exports (`v3.8-release-notes.md`).
- Requirements settings remain backwards-compatible so every feature introduced in v3.0–v3.4 (grouped axes, metadata parsing, exports, timecode explanations) is still available and now surfaced more prominently.

### Future scope (v4.0)
- Planning documents outline per-event axis capture, hardware profile binding, comparison intelligence, synchronized media engines (video + waveform), pattern recognition via templates, IndexedDB caching, and expanded export packaging (CSV/JSON/PDF/annotated video). See `v4.0-release-notes.md`, `v4.0-architecture.md`, and `v4.0-implementation-plan.md` for the design roadmap.

## Portable Runtime Notes
- The portable build now embeds `vendor/babel-standalone.min.js` so JSX transforms run even when CDNs are blocked.
- A guard script detects when Babel fails to load and shows actionable recovery guidance, preventing a blank screen when the runtime is missing.
- Keep the HTML file and vendor directory together when sharing archives to guarantee full functionality.

## Changelog (Summary)
A detailed change log lives in [`CHANGELOG.md`](./CHANGELOG.md). The highlights below mirror that document:

### v4.0 (planned)
- Per-event axis capture, axis dashboards, hardware-aware requirements, comparison intelligence, and the upgraded media/marker architecture.

### v3.8.1 (current)
- Multi-view professional UI with FPS auto-detection, manual axis distances, requirements management, report selection, and backwards compatibility with v3.x data.

### v3.4 (stabilized)
- Range display fixes, original timestamp resurfacing, per-axis stats with distance context, and JSX loading corrections.

### v3.2 (final 3.2 production)
- Default grouped axes, expanded exports, and enriched timestamp/specification displays.

### v3.0 (foundational)
- Sorting, axis grouping, pass/fail highlighting, automatic error detection, and marker metadata parsing for DaVinci CSVs.

