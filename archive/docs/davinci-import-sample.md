# DaVinci Resolve Import - Sample Analysis

## Source File: AB6_TileTag1_0.csv

### Import Summary
- **Total Markers Found**: 53
- **Tag Names (Yellow)**: 10 tags identified
- **TagOn Events (Green)**: 22 events
- **TagOff Events (Cyan)**: 12 events
- **Ignored (Blue)**: 9 placeholders

### Tag Distribution

| Tag # | Test Runs | TagOn Events | TagOff Events |
|-------|-----------|--------------|---------------|
| 1     | 1         | 1            | 0             |
| 2     | 1         | 1            | 0             |
| 3     | 1         | 1            | 0             |
| 4     | 1         | 1            | 0             |
| 5     | 1         | 1            | 0             |
| 6     | 1         | 1            | 0             |
| 7     | 1         | 1            | 0             |
| 8     | 1         | 1            | 0             |
| 9     | 1         | 1            | 0             |
| 10    | 12        | 12           | 12            |

### Sample Latency Calculations (Tag #10)

| Run # | TagOn Time | TagOff Time | Latency | Status |
|-------|------------|-------------|---------|--------|
| 10.1  | 4271.967   | 4276.167    | 4.200s  | ✓      |
| 10.2  | 4278.133   | 4282.233    | 4.100s  | ✓      |
| 10.3  | 4285.567   | 4287.333    | 1.767s  | ✓      |
| 10.4  | 4290.333   | 4293.500    | 3.167s  | ✓      |
| 10.5  | 4297.100   | 4300.533    | 3.433s  | ✓      |
| 10.6  | 4303.100   | 4307.233    | 4.133s  | ✓      |
| 10.7  | 4310.000   | 4312.333    | 2.333s  | ✓      |
| 10.8  | 4316.067   | 4317.433    | 1.367s  | ✓      |
| 10.9  | 4322.300   | 4323.933    | 1.633s  | ✓      |
| 10.10 | 4328.600   | 4330.367    | 1.767s  | ✓      |
| 10.11 | 4334.167   | 4335.400    | 1.233s  | ✓      |
| 10.12 | 4338.367   | 4339.533    | 1.167s  | ✓      |

### Statistics for Tag #10
- **Minimum Latency**: 1.167s (Run #12)
- **Maximum Latency**: 4.200s (Run #1)
- **Average Latency**: 2.525s
- **Standard Deviation**: 1.224s
- **Outliers**: None detected

### Timecode Conversion Examples

| DaVinci Timecode | Converted Time | Description |
|------------------|----------------|-------------|
| 01:11:11:29      | 4271.967       | TagOn #10.1 |
| 01:11:16:05      | 4276.167       | TagOff #10.1 |
| 01:11:18:04      | 4278.133       | TagOn #10.2 |
| 01:11:22:07      | 4282.233       | TagOff #10.2 |

### Import Process
1. ✅ CSV file parsed successfully
2. ✅ Timecodes converted (30 fps assumed)
3. ✅ Markers categorized by color
4. ✅ Tag numbers extracted from notes
5. ✅ Test run numbers identified
6. ✅ Events sorted chronologically
7. ✅ Latencies calculated automatically

### Notes
- Frame rate: 30 fps (from source)
- Each frame = 33.33ms
- All timestamps preserved with millisecond precision
- Original marker notes retained for reference
- Blue markers filtered out as placeholders