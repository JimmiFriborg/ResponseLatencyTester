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
