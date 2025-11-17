# ResponseLatencyTester

A collection of self-contained Hardware Latency Tester builds (portable HTML+JS) together with the planning artifacts that document how each version evolved.

## Functionality Overview
- **Latency execution workspace (production)** – `latency-tester-v3.8.1.html` remains the supported release for operations and certification work. It contains the multi-view React interface with FPS auto-detection, per-axis distances, grouped error handling, include/exclude toggles, and PDF-ready reporting. (See `v3.8-release-notes.md` for the full feature rundown.)
- **Release candidate sandbox** – `release-candidates/latency-tester-v3.9-rc3.html` exposes the in-progress requirement template workflow along with the defect register view. It automatically reads/writes `release-candidates/v3.9-rc3-defects.json`, and the historical `v3.9-rc1-defects.json` document catalogs the backlog that fed this RC.
- **Curated archives** – Deprecated HTML builds, the JSX playground, portable/offline variants, and legacy release notes now live under `archive/` (for example `archive/legacy-html/latency-tester-portable.html`). This keeps the repo root focused on the currently supported deliverables while still preserving history for reference.
- **DaVinci Resolve marker support** – Timestamp parsing honors the marker naming convention introduced in v3.0, including axis/direction metadata extraction, automatic pairing, and error detection noted in the legacy feature guides stored in `archive/docs/`.
- **Reporting & exports** – v3.2 and later releases expose JSON/CSV/PDF exports, per-axis statistics, requirements compliance summaries, and distance-aware report layouts, enabling teams to adopt whichever artifact best fits their process (`v3.2-release-notes.md`, `v3.4-release-notes.md`).

## Usage Guide
### Run the production build (v3.8.1)
1. Open `latency-tester-v3.8.1.html` in a Chromium, Firefox, or Safari browser.
2. Import DaVinci Resolve CSV exports or JSON bundles via the import controls.
3. Capture manual axis distances, configure requirements, and curate which test cases should appear in the printable report view.
4. Export CSV/JSON/PDF artifacts directly from the UI for archival or sharing.

### Evaluate the v3.9 Release Candidate
1. Navigate to `release-candidates/` and open `latency-tester-v3.9-rc3.html`.
2. Treat the UI banner and the dedicated **Defects** view as a reminder that this is not production software.
3. Add, edit, or delete defects either directly inside the GUI or by editing `release-candidates/v3.9-rc3-defects.json`. The import/export buttons accept that JSON file so you can round-trip the canonical document without touching test-case data.
4. Capture any new regressions in the defect register before promoting another RC.

### Legacy portable & historical builds
Legacy HTML builds (including the offline portable variant) now reside in `archive/legacy-html/`. When you need the Babel-enabled portable build, copy `archive/legacy-html/latency-tester-portable.html` alongside the `vendor/` directory before opening the file. The historical release notes and feature guides that describe those builds are located in `archive/docs/` for quick reference.

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

