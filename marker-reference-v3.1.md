# DaVinci Resolve Markers - Quick Reference v3.1

## 🎨 Marker Color System

### Identifier & Control
```
🟡 Yellow  = Identifier Marker
           Format: "AB[#] [Descriptor] Tag[Version] ([Axis][Direction])"
           Example: "AB6 Single Tag1.0 (X+)"
           
🔴 Red     = Error Zone Toggle
           First red = Start exclusion
           Second red = End exclusion
           (Excludes from statistics)
```

### Action & Activation Pairs
```
🟢 Green   = TagOn Action
           Format: "TagOn #[Run]"
           Example: "TagOn #1"
           
🩷 Pink    = TagOn Activation
           [Any name - pairs with Green]
           Measures placement response
           
🔵 Cyan    = TagOff Action
           Format: "TagOff #[Run]"
           Example: "TagOff #23"
           
🍋 Lemon   = TagOff Activation
           [Any name - pairs with Cyan]
           Measures removal response
```

### Placeholder
```
🔷 Blue    = Ignore (placeholder)
```

## 📝 Naming Formats

### Yellow Identifier Components:
- **AB[#]**: AB6, AB17, AB25
- **Descriptor**: Single, Multi, Play, Test
- **Tag[Version]**: Tag1.0, Tag1.1, Tag2.0
- **([Axis][Dir])**: (X+), (Y-), (Z+)

### Action Marker Components:
- **Tag[Action]**: TagOn, TagOff, TagOnActivation
- **#[Run]**: #1, #2, #23, #100

## ⚡ Latency Measurements
```
TagOn Latency  = Pink time - Green time
TagOff Latency = Lemon time - Cyan time
```

## 📊 Example Timeline
```
Time        Color   Marker                  Action
────────────────────────────────────────────────────
00:00.000   Yellow  AB6 Single Tag1.0 (X+)  [Identifier]
00:05.000   Green   TagOn #1                [Action]
00:06.500   Pink    Experience activated    → 1.500s latency
00:08.000   Red     Error zone start        [Exclude begin]
00:10.000   Green   TagOn #2                [Action]
00:11.333   Pink    Experience activated    (excluded)
00:12.000   Red     Error zone end          [Exclude end]
00:15.000   Cyan    TagOff #1               [Action]
00:16.200   Lemon   Experience activated    → 1.200s latency
```

## 📈 Statistics Rules

### Included ✅
- Paired events (Green→Pink, Cyan→Lemon)
- Events outside red zones
- Valid latency measurements

### Excluded ❌
- Unmatched markers
- Events between red markers
- Markers labeled "Error"

## ✨ New in v3.1

### Axis Statistics:
- Min/Avg/Max per axis
- Pass rate with ratio
- Outlier detection
- Error counts

### Enhanced Editing:
- Edit in grouped view
- Delete in grouped view
- Persistent changes

### Visual Indicators:
- ⚠ Outlier warning
- (excluded) label
- Pass/fail coloring
- Axis grouping with stats

## 🚀 Quick Workflow

1. **Mark timeline in DaVinci:**
   - Yellow for test identification
   - Green/Cyan for actions
   - Pink/Lemon for activations
   - Red for error zones

2. **Export as CSV**

3. **Import to tool:**
   - Auto-pairs markers
   - Calculates latencies
   - Excludes error zones
   - Shows axis statistics

4. **Analyze:**
   - Group by axis
   - Sort by latency
   - Review outliers
   - Check pass rates

---
*Keep this card handy while marking in DaVinci Resolve!*