# Repository status, handoff notes, and cleanup plan

## Current deliverables at a glance
- **Production HTML (v3.8.1)** – `latency-tester-v3.8.1.html` remains the supported operational build. Keep this checked in for easy distribution alongside the legacy release notes under `archive/docs/`.
- **Release candidate sandbox (v3.9-rc5)** – `release-candidates/latency-tester-v3.9-rc5.html` and its defect register JSON files stay available for regression triage and historical reference.
- **React + TypeScript workspace (v4 portable)** – The active source of record under `src/` powers the portable bundle `dist/latency-tester.html`. Hash-based navigation exposes Execution, Hardware, Comparison, Traceability, Requirements, Report, and Defects views from a single-page shell.

## Implemented in the current workspace
- **Execution import guards** keep CSV parsing, troubleshooting, and JSON session restores separate, avoiding accidental overwrites while surfacing validation issues inline.
- **Persisted comparison queue** supports baseline/candidate selection, axis diff summaries, and clipboard export with a fallback “simple-tag” mode that disables delta math when only a single marker is captured.
- **Hardware traceability** normalizes profiles, summarizes accessory/firmware coverage, and surfaces execution-to-hardware linkage for audits.
- **Requirements visibility** tracks template revisions and staged edits, encouraging review before saving.
- **Print-friendly reporting** renders execution summaries in a constrained layout suitable for PDFs without in-app formatting drift.
- **Canonical defect register** fetches `release-candidates/v3.9-rc5-defects.json` directly so the UI and exported data reference the same source.

## Not yet implemented from the v4 roadmap (high priority)
- Per-event axis metadata, timestamp templates, and expanded hardware context capture called out in the instrumentation pillar remain unbuilt.
- Analytics deliverables (axis comparison matrices with regressions, execution summaries with requirement context, anomaly detection hooks, and trend visualizations) are still pending.
- Governance features—including per-test-case requirements, versioned hardware assignment workflows, inline commentary, and role-based export presets—have not been wired into the React workspace.
- Platform work (state persistence/recovery, accessibility hardening, and automation APIs with schema samples) has not been started.

## Documentation and user-guide actions
- Update `README.md` to clearly distinguish the supported v3.8.1 HTML, the v3.9 release candidate sandbox, and the in-progress v4 React workspace, linking to the portable bundle and archived guides.
- Add a short “workspace quickstart” to the README covering hash routes, import/export flows, and where the defect register lives.
- Move legacy DaVinci marker references and quick-reference docs into `archive/docs/` (completed) and annotate their new location from the README so new users are not confused by old files at the root.
- Produce a focused user guide for the React workspace (Execution, Comparison, Hardware, Requirements, Report, Defects) once the next development increment lands, keeping legacy guides scoped to v3.x behavior.

## Code cleanup and follow-up tasks
- Replace seeded sessions, requirements, and hardware profiles in `App.tsx` with persisted fixtures or sample data toggles so user-entered content drives the experience.
- Harden JSON import validation in `ExecutionView` by enforcing the execution schema instead of trusting arbitrary fields from parsed JSON.
- Swap the `window.prompt` annotation flow in `ComparisonView` for an in-app modal that persists notes alongside comparison state.
- Extend `HardwareView` and `TraceabilityView` with edit/add flows so the hardware library is not hardcoded.
- Expand `DefectsView` with error states, refresh affordances, and export actions aligned with the canonical register to support shared QA workflows.
