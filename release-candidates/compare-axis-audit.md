# Compare Axis Entry Point Audit (v3.9 RC3)

## Previous navigation behavior
1. **Execution → Comparison jump:** Clicking any **Compare axis** button inside the execution view invoked `addToComparison()` with the selected axis and then immediately called `changeView('comparison')`, pulling the reviewer away from the timestamps they were editing.
2. **Header action jump:** The global **Add to Comparison** shortcut in the execution header shared the same behavior, so even queueing an entire execution would force a navigation to the comparison screen.
3. **No breadcrumbs or context reminder:** After the forced navigation there was no persistent breadcrumb to highlight where the request originated, making it harder to resume edits on the source test execution.

## Documented UX gaps
- Reviewers could not select multiple axes/directions in a single action; they had to repeat the “Compare axis → navigate → go back” loop for every axis.
- The lack of inline messaging or an option to open the comparison dashboard in a new tab caused unnecessary back/forward churn.
- Axis selections were not persisted across sessions and could not be adjusted directly inside the comparison dashboard, so any mistake required returning to the execution view.

## Remediation overview
- A side-panel modal now opens from every **Compare axis** and **Add to Comparison** button, enabling multi-axis selection without leaving the execution context.
- Breadcrumb-style UX copy in the execution view reminds users they are still inside the originating test case/execution, offers a “View comparison” button, and exposes a dedicated “Open in new tab” action.
- Comparison cards now expose inline axis toggles, and the queue is persisted via `localStorage`, so axis add/remove operations can be audited and adjusted quickly.

## Data view coverage (RC4+)
- **Axis execution cards** now render one card per queued axis/direction, keeping the per-device narrative focused on min/avg/max latency plus **test run totals** for that specific movement. Inline axis filters and “test run” terminology ensure the metrics match the report view while allowing quick cross-device, cross-test comparisons.
- **Axis Comparison Matrix** now accepts axis-specific distance metric toggles (min respond, max tested, out-of-range guard). Reviewers can focus on whichever boundary is relevant for the active axis while comparing latency deltas across every queued execution without re-tagging requirements.
- **Result Statistics** aggregates all included devices into histograms, normal-distribution overlays, percentiles, and distance markers. Axis and device filters keep the panel scoped to the right subset of test runs, so latency regressions surface instantly across a fleet without exporting data.
- Switching between cards, the matrix, and statistics is instant—no reloads or extra tabs—so exploratory investigations and report-ready screenshots live in one place.
