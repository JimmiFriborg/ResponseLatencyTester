# EmbroiderSize – “SimpleSkale” Implementation Plan

*(Technical, ready-to-paste, English)*

---

## 1. Core Goals

**Primary goal:**
Provide a *fast, safe, PP1-friendly* stitch scaling workflow that feels as simple as a photo editor’s zoom, but under the hood keeps stitch density, stitch length, and machine limits within safe ranges.

**Design priorities (in order):**

1. **UX first** – zero-confusion UI, instant feedback, minimal jargon.
2. **Safe scaling** – avoid broken designs (too dense, too long stitches, etc.).
3. **PP1-optimized** but extensible to other machines later.
4. **Modular architecture** – SimpleSkale is a distinct module we can later replace/augment with the “smart/AI scaler” without rewriting the UI.

---

## 2. Recommended Tech Stack

### 2.1 UI + Shell

**Option A – Tauri + React/TypeScript (recommended)**

* Cross-platform desktop (Windows/macOS/Linux).
* Uses web tech for UI (React), but compiles into a lightweight desktop app.
* Good balance of performance and developer experience.
* Easy to evolve into a web version later if needed.

**Option B – Electron + React/TypeScript**

* More mature ecosystem, but heavier footprint.
* Similar dev experience, but worse performance and bigger installer.

**Chosen:** **Tauri + React/TypeScript**
Reason: modern, fast, enables a polished UI and is future-proof for adding local AI later (Rust side).

### 2.2 Core Logic / Stitch Engine

**Core stitch engine language:** **TypeScript initially**, with a clear separation so it can be ported to Rust later if needed.

* Pros: Fast development, good tooling, easy refactor.
* Later: move hot paths (parsing, scaling) into Rust via Tauri commands if needed.

---

## 3. High-Level Architecture

**Layers:**

1. **UI Layer (React)**

   * File open/save dialogs
   * Scaling controls (slider, presets, numeric input)
   * Preview canvas
   * Warnings & “PP1 Safe” indicators
   * Machine profile selection (PP1 first, more later)

2. **Application Layer (TypeScript)**

   * Handles state, undo/redo, history
   * Orchestrates calls to Stitch Engine and Scaling Engine
   * Owns the concept of “Document”

3. **Stitch Engine (TypeScript module)**

   * File parsers (PES/DST/PEC)
   * Normalized data model
   * Exporters (PES/DST initially)
   * Utility functions (bounding box, stitch count, statistics)

4. **SimpleSkale Engine (TypeScript module)**

   * Scaling logic (coordinate scaling + density-safe adjustments)
   * Machine constraint enforcement (PP1 limits)
   * Metrics and warnings calculation (density, stitch length)
   * Different strategies per stitch type (run/fill/satin if we support it)

5. **Render Engine (TypeScript / Canvas/WebGL)**

   * Renders stitch paths on a canvas
   * Supports zoom/pan
   * Color-coded stitches (runs, jumps, trims, etc.)
   * “Before/After” overlay or side-by-side view

---

## 4. Data Model

Define a normalized internal model independent of file format.

```ts
// Base units: millimeters in logical design space.
type Point = { x: number; y: number };

type StitchType = "run" | "bean" | "satin" | "fill" | "jump" | "trim";

interface Stitch {
  position: Point;
  type: StitchType;
  colorIndex: number;
  // For bean/run combos, grouping is handled at sequence level
}

interface ColorBlock {
  colorIndex: number;
  stitches: Stitch[];
}

interface MachineProfile {
  id: string;
  name: string;
  maxHoopWidthMm: number;
  maxHoopHeightMm: number;
  maxStitchLengthMm: number;
  minStitchLengthMm: number;
  recommendedMaxDensityStitchesPerMm2: number;
  recommendedMinDensityStitchesPerMm2: number;
  // PP1 will be extremely conservative here
}

interface DesignDocument {
  id: string;
  name: string;
  originalFormat: "PES" | "DST" | "PEC" | string;
  colorBlocks: ColorBlock[];
  machineProfile: MachineProfile;
  metadata: {
    originalWidthMm: number;
    originalHeightMm: number;
    scaleFactor: number; // current applied scaling
  };
}
```

---

## 5. SimpleSkale Algorithm – Overview

Goal: Scale a design by factor `s` while keeping density and stitch lengths within machine-safe limits.

### 5.1 Pipeline (Conceptual)

1. **Load design** → `DesignDocument`.
2. **Select machine profile** (default: Brother PP1).
3. **User chooses scaling factor** (`s`, e.g. 0.5, 1.2, etc.).
4. **SimpleSkale Engine**:

   * Scale coordinates.
   * Recompute stitch lengths.
   * Adjust stitch density for fills (if any) by thinning/spacing.
   * Clamp/merge too-short stitches.
   * Flag too-long stitches or split them.
5. **Recalculate metrics**:

   * Stitch count
   * Average density
   * Max density hotspots
   * Min/max stitch length
6. **Return updated `DesignDocument` for rendering + export.**

---

## 6. SimpleSkale Algorithm – Technical Details

### 6.1 Scaling Coordinates

For each stitch in each color block:

```ts
stitch.position.x *= s;
stitch.position.y *= s;
```

### 6.2 Recompute Stitch Lengths

Compute vector distance between consecutive stitches (ignoring JUMP/TRIM):

```ts
function computeStitchLengths(block: ColorBlock): number[] {
  const lengths: number[] = [];
  for (let i = 1; i < block.stitches.length; i++) {
    const a = block.stitches[i - 1].position;
    const b = block.stitches[i].position;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    lengths.push(Math.sqrt(dx*dx + dy*dy)); // in mm
  }
  return lengths;
}
```

### 6.3 Density Estimation (Simple but Effective)

Approximate density by:

* Total number of stitches in a region
* Divided by design area (bounding box) or per color block area

For a first iteration:

```ts
density = totalStitches / (widthMm * heightMm); // stitches per mm²
```

Later, more advanced segmentation can refine this, but for SimpleSkale we can:

* Estimate global density
* Compare against MachineProfile recommendations
* Mark design unsafe if density exceeds threshold

### 6.4 Handling Downscaling (s < 1)

Problem: density increases.

Strategy for SimpleSkale:

1. **Increase minimum stitch length**:

   * If `length < minStitchLengthMm`, we either:

     * merge with neighboring stitches, or
     * remove stitch, if within safe error bounds.

2. **Optionally thin fill-like sequences** (if we detect repeated parallel runs):

   * Drop every N-th stitch or row after detection of very dense patterns.
   * For the MVP, we can limit this to simple heuristics:

     * If many consecutive short stitches in same direction → treat as “fill-like” and thin.

3. **Deny extreme downscales** (e.g. `< 30%` of original) unless user overrides with “Advanced” mode:

   * Show explicit warning:
     “Scaling below 30% may cause excessive stitch density; consider using a smaller original design.”

### 6.5 Handling Upscaling (s > 1)

Problem: density decreases, long stitches may appear.

Strategy:

1. **Clamp maximum stitch length**:

   * If `length > machineProfile.maxStitchLengthMm`, split the segment into multiple shorter stitches.

2. **Warn on low density**:

   * If global density drops below `recommendedMinDensityStitchesPerMm2`, show warning:
     “This design may appear sparse at this size.”

3. **Optionally allow “loose, sketchy” look** for PP1 (this may be fine for doodle-style).

### 6.6 PP1-Specific “Safe Mode”

MachineProfile for Brother Skitch PP1:

* Very low recommended max density.
* Low max stitch length.
* Very cautious with short stitches.

In Safe Mode:

* Automatically prevent density from exceeding PP1’s recommended threshold.
* If user tries to scale in a way that would break that, show a blocking dialog:

  > “At this scale, stitch density is too high for Brother Skitch. Try a smaller downscale or simplify the design.”

---

## 7. UI / UX Design

UX is the top priority. The goal is that a non-technical user can succeed without understanding stitch density or machine constraints.

### 7.1 Main Screen Layout

**Top bar:**

* `Open Design…` button
* Current file name
* Machine profile dropdown (default: “Brother Skitch PP1 (Safe)”)

**Left panel:**

* Scaling controls:

  * Slider: `20% – 200%`
  * Numeric input: `%` or target width/height in mm
  * Quick presets:

    * “Fit to 100×100 mm”
    * “50%”
    * “80%”
    * “Original size”
  * Toggle: `PP1 Safe Mode [ON/OFF]`

**Center area:**

* Canvas preview
* Option buttons:

  * “Before/After split view”
  * “Show density heatmap” (overlay)
  * “Show stitches” / “Show simple preview”

**Right panel:**

* Info box:

  * Original size (mm)
  * New size (mm)
  * Original stitch count vs new
  * Estimated density (original vs new)
  * Warnings list:

    * “OK for PP1” (green)
    * “High density in some areas” (yellow)
    * “Not recommended for PP1” (red)

**Bottom bar:**

* `Reset`
* `Export as PES`
* `Export as DST`

### 7.2 Interaction Flow

1. User opens `.pes` or `.dst`.
2. Preview loads immediately at original size.
3. SimpleSkale is applied dynamically as the user moves the slider.
4. All changes are live-updated in preview and info panel.
5. User sees “PP1 Safe” or warnings in real-time.
6. User clicks `Export` to save the scaled design.

No separate “Apply” button is needed; changes are live but revertible via `Reset` and undo.

---

## 8. Implementation Phases (For SimpleSkale Only)

### Phase 1 – Foundation

* Set up Tauri + React project.
* Implement file open/save dialogs.
* Implement PES/DST parsing to normalized `DesignDocument`.
* Basic canvas renderer drawing stitch paths.
* Hardcode PP1 `MachineProfile`.

### Phase 2 – SimpleSkale Engine (Core)

* Implement coordinate scaling (`s`).
* Recompute stitch lengths.
* Implement min/max stitch length enforcement (split or merge).
* Implement basic density estimation.
* Implement PP1 Safe Mode logic (acceptable thresholds).
* Hook engine into UI slider & numeric scale input.

### Phase 3 – UX Polish

* Implement Before/After toggle.
* Implement density heatmap overlay.
* Add presets (50%, 80%, fit hoop).
* Add inline explanations when warnings appear (tooltip-style, human language).
* Add undo/redo for scaling and machine profile changes.

### Phase 4 – Robustness and Edge Cases

* Handle designs with very few stitches gracefully.
* Handle jump/trim stitches correctly (don’t merge across them).
* Add unit tests for:

  * scaling
  * density calculations
  * PP1 constraints
* Add small sample designs bundled with the app for quick trial.

---

## 9. Extensibility Considerations

* Keep **Stitch Engine** and **SimpleSkale Engine** as separate modules so they can be replaced by:

  * More advanced SmartSkale (heuristic region-based)
  * AI-based ParametricScaler in the future.

* Machine profiles should be defined as data (JSON), not code, so new profiles can be added without code changes.

* Render Engine should accept an abstract `RenderableDesign` so we can later add:

  * per-region overlays
  * region selection
  * detailed debug views for developer mode.

---

## 10. Summary

This plan delivers:

* A **real, functional, safe stitch scaler** optimized for Brother Skitch PP1.
* A **modern, clean, intuitive UI** built with React + Tauri.
* A **modular architecture** that supports future evolution into high-end AI-based re-digitizing.

The first shipped version of SimpleSkale does **one thing extremely well**:

> “Let hobby users safely scale stitch designs up or down for their machine, without needing to understand embroidery engineering.”

If you want next, I can draft:

* A concrete **React component structure** for the UI
* A **TypeScript interface file** for the Stitch Engine and SimpleSkale Engine
* Or a **sample UX wireframe description** you can hand to a designer.
