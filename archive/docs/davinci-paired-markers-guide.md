# DaVinci Resolve Paired Marker System - Complete Guide

## 🎯 Overview
The new paired marker system provides precise latency measurements between trigger events and experience responses, enabling frame-accurate analysis of hardware response times.

## 📌 Marker Color System

### Primary Markers (Triggers)
- 🟡 **Yellow**: Tag identification markers
  - Purpose: Group related test executions
  - Format: `Tile Tag 1.0 #[tag_number]`
  - Example: `Tile Tag 1.0 #10`

### Paired Event Markers

#### TagOn Events (Tag Detection)
- 🟢 **Green**: TagOn trigger marker
  - Purpose: Marks when tag is placed/detected
  - Format: `AB6 TagOn - TileTag 1.0 #[tag].[run]`
  - Example: `AB6 TagOn - TileTag 1.0 #10.1`

- 🩷 **Pink**: TagOn experience marker
  - Purpose: Marks when experience responds to tag detection
  - Format: Any identifier (e.g., `Marker 360`)
  - Must follow Green marker to create pair

#### TagOff Events (Tag Removal)
- 🔵 **Cyan**: TagOff trigger marker
  - Purpose: Marks when tag is removed
  - Format: `AB6 TagOff - TileTag 1.0 #[tag].[run]`
  - Example: `AB6 TagOff - TileTag 1.0 #10.1`

- 🍋 **Lemon/Lime**: TagOff experience marker
  - Purpose: Marks when experience activates in response to tag removal
  - Format: Any identifier
  - Must follow Cyan marker to create pair
  - Note: This is the experience being triggered BY the removal, not stopping

### Ignored Markers
- 🔷 **Blue**: Placeholder markers (ignored)
- 🔴 **Red**: Additional placeholders (ignored)

## 📊 Latency Calculations

### Paired Latency
When markers are properly paired, the tool automatically calculates:
```
TagOn Latency = Pink timestamp - Green timestamp
TagOff Latency = Lemon timestamp - Cyan timestamp
```

### Example from Your Data

#### Tag #10, Run 1 Analysis:
```
Green Marker:  01:11:11:29 (4271.967s) - TagOn triggered
Pink Marker:   01:11:13:17 (4273.567s) - Experience responds
Latency:       1.600s (1600ms)

Cyan Marker:   01:11:16:05 (4276.167s) - TagOff triggered
Lemon Marker:  [Not present in sample] - Would show experience response
```

## 📈 Complete Test Flow

### Single Test Run Example
```
1. Yellow:  Tile Tag 1.0 #10        [Tag identified]
2. Green:   AB6 TagOn #10.1         [Tag placed at 4271.967s]
3. Pink:    Experience activated     [Experience responds to placement at 4273.567s]
   → TagOn Latency: 1.600s ✓
4. Cyan:    AB6 TagOff #10.1        [Tag removed at 4276.167s]
5. Lemon:   Experience activated     [Experience responds to removal at 4277.xxx]
   → TagOff Latency: X.XXXs ✓
```

### Key Understanding:
- **Pink marker**: Experience activates because tag was PLACED
- **Lemon marker**: Experience activates because tag was REMOVED
- Both measure how quickly the experience responds to the change

## 📝 Naming Conventions

### Tag Numbering
- Format: `#[tag_number].[run_number]`
- Examples:
  - `#10.1` = Tag 10, Run 1
  - `#10.2` = Tag 10, Run 2
  - `#10.12` = Tag 10, Run 12

### Best Practices
1. **Consistent Naming**: Use same tag number for all runs of same physical tag
2. **Sequential Runs**: Number runs sequentially (1, 2, 3...)
3. **Clear Descriptions**: Include test type in marker notes

## 🔧 DaVinci Resolve Workflow

### Setting Up Markers
1. **Import footage** into DaVinci Resolve
2. **Add markers** at precise frames:
   - `M` key to add marker
   - `Shift+M` to edit marker properties
3. **Set colors** according to the system:
   - Yellow for tag identification
   - Green for TagOn trigger
   - Pink for TagOn experience
   - Cyan for TagOff trigger
   - Lemon for TagOff experience

### Exporting Markers
1. **File** → **Export** → **Timeline Markers to EDL**
2. Choose **CSV** format
3. Save with descriptive filename

### Importing to Latency Tester
1. Click **Import** button
2. Select your CSV file
3. Tool automatically:
   - Pairs Green→Pink markers
   - Pairs Cyan→Lemon markers
   - Calculates latencies
   - Groups by tag number
   - Sorts chronologically

## 📊 Analysis Features

### Automatic Calculations
- **Per-pair latency**: Each Green→Pink and Cyan→Lemon pair
- **Tag statistics**: Min/Max/Average per tag number
- **Run comparison**: Compare multiple runs of same tag
- **Outlier detection**: Automatic flagging of unusual latencies

### Visual Indicators
- Paired events show with arrow (→) between times
- Pre-calculated latencies displayed immediately
- Color-coded statistics for quick analysis

## 🎯 Example Statistics

### From Your Sample Data (Tag #10)

| Run | TagOn Time | Experience | Latency | Status |
|-----|------------|------------|---------|--------|
| 1   | 4271.967   | 4273.567   | 1.600s  | ✓      |
| 2   | 4278.133   | 4279.100   | 0.967s  | ✓      |
| 3   | 4285.567   | 4286.933   | 1.367s  | ✓      |
| 4   | 4290.333   | 4293.100   | 2.767s  | ✓      |
| 5   | 4297.100   | 4297.933   | 0.833s  | ✓      |
| 6   | 4303.100   | 4304.033   | 0.933s  | ✓      |
| 7   | 4310.000   | 4311.267   | 1.267s  | ✓      |
| 8   | 4316.067   | 4316.900   | 0.833s  | ✓      |
| 9   | 4322.300   | 4323.900   | 1.600s  | ✓      |
| 10  | 4328.600   | 4329.933   | 1.333s  | ✓      |
| 11  | 4334.167   | 4335.167   | 1.000s  | ✓      |
| 12  | 4338.367   | 4339.200   | 0.833s  | ✓      |

**Statistics:**
- Minimum: 0.833s
- Maximum: 2.767s
- Average: 1.278s
- Standard Deviation: 0.522s

## ⚡ Benefits of Paired System

1. **Precise Measurement**: Exact latency between trigger and response
2. **Separate Metrics**: Different latencies for TagOn vs TagOff
3. **Video Sync**: Frame-accurate correlation with footage
4. **Batch Testing**: Multiple runs per tag with clear organization
5. **Quality Control**: Easy identification of failed detections
6. **Performance Tracking**: Compare latencies across different conditions

## 🔍 Troubleshooting

### Unpaired Markers
If a Green marker has no following Pink:
- Shows as "No experience marker found"
- No latency calculated for that event
- Check if experience marker was missed in timeline

### Import Issues
- Ensure CSV export includes all columns
- Check marker colors match the system
- Verify marker notes follow naming convention

### Latency Concerns
- Frame rate affects precision (30fps = 33.33ms per frame)
- Consider using higher frame rates for more precision
- Multiple runs help identify consistency

## 📤 Export Options

### JSON Export
- Complete test data with all metadata
- Paired marker relationships preserved
- Import to other sessions or devices

### CSV Export
- Spreadsheet-compatible format
- Includes calculated latencies
- Ready for further analysis in Excel

### Print/PDF
- Professional reports with statistics
- Visual representation of test results
- Documentation for compliance/QA

## 🚀 Advanced Usage

### Multi-Stage Testing
Track different stages within same test:
```
Green: AB6 TagOn - TileTag 1.0 #10.1 - Stage A
Pink: Experience Stage A
Green: AB6 TagOn - TileTag 1.0 #10.1 - Stage B
Pink: Experience Stage B
```

### Environmental Variables
Include test conditions in marker notes:
```
Green: AB6 TagOn - TileTag 1.0 #10.1 - 20°C
Green: AB6 TagOn - TileTag 1.0 #10.2 - 25°C
Green: AB6 TagOn - TileTag 1.0 #10.3 - 30°C
```

### Batch Comparison
Import multiple CSV files to compare:
- Different hardware versions
- Various firmware updates
- Environmental conditions
- Tag types or sizes

---
*Hardware Latency Tester - DaVinci Resolve Integration v2.0*
*Paired Marker System for Professional Testing*