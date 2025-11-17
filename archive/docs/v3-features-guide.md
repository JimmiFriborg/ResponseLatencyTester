# Hardware Latency Tester v3.0 - Enhanced Features

## 🎯 What's New in Version 3.0

### 1. **Sorting Capabilities** 
- Click any column header to sort ascending/descending
- Available sorts: Index (#), Time, Label, Axis, Latency
- Visual indicators (↑↓) show active sort direction

### 2. **Automatic Error Detection**
- Unmatched markers (no paired experience marker) automatically marked as "Error"
- Visual highlighting with red background in label field
- Error count shown in import summary
- Warning banner when errors are present

### 3. **Axis-Based Grouping**
- Toggle "Group by Axis" checkbox to organize data by axis/direction
- Groups: X+, X-, Y+, Y-, Z+, Z-, No Axis
- Each group shows event count and maintains its own table
- Perfect for comparing performance across different axes

### 4. **Pass/Fail Row Highlighting**
- Toggle "Highlight Pass/Fail" checkbox to enable visual feedback
- Color coding:
  - 🟢 Green background: Passed (latency within criteria)
  - 🔴 Red background: Failed (latency exceeds criteria)
  - 🟡 Yellow background: Error (unmatched markers)
- Only active when pass/fail criteria is enabled

### 5. **Enhanced Yellow Marker Parsing**

Yellow markers now parse and store comprehensive metadata:

#### New Naming Scheme:
```
"AB[#] [Descriptor] Tag[Version] ([Axis][Direction])"

Example: "AB6 Single Tag1.0 (X+)"
```

#### Parsed Components:
- **AB Number**: AB6, AB17, etc.
- **Test Descriptor**: Single, Play, Multi, etc.
- **Tag Version**: 1.0, 1.1, 2.0, etc.
- **Axis**: X, Y, or Z
- **Direction**: + or -

### 6. **Enhanced Action Markers**

Green and Cyan markers follow the same naming convention:
- `"AB6 Single Tag1.0 (X+)"` - TagOn marker
- `"AB17 Multi Tag1.1 (Z-)"` - TagOff marker

This metadata is:
- Automatically extracted during import
- Displayed in the Axis column
- Used for grouping and filtering
- Preserved in exports

## 📊 **New Table Features**

### Column Enhancements:
- **Axis Column**: Shows axis and direction (e.g., "X+")
- **Sortable Headers**: Click to sort by any column
- **Error Highlighting**: Unmatched markers shown in red
- **Pass/Fail Colors**: Visual feedback based on latency criteria

### Control Panel:
- **Group by Axis**: Organize data by measurement axis
- **Highlight Pass/Fail**: Color-code rows by performance
- **Compare Button**: Add execution to comparison
- **Add Button**: Manually add timestamps

## 🔄 **Workflow Improvements**

### Import Process:
1. Yellow markers establish test metadata
2. Action markers inherit metadata from most recent yellow
3. Unpaired markers automatically flagged as errors
4. Summary shows paired vs unmatched counts

### Visual Feedback:
- Import banner shows source and marker type
- Unmatched warning appears when errors exist
- Metadata displayed in sidebar for each test case
- Axis grouping provides instant organization

## 💡 **Usage Tips**

### For Best Results:
1. **Naming Convention**: Follow the strict format for markers
2. **Yellow First**: Always start with yellow marker to set metadata
3. **Pair Markers**: Ensure every Green has Pink, every Cyan has Lemon
4. **Check Errors**: Review unmatched markers in error state

### Sorting Strategy:
- Sort by **Time** for chronological view
- Sort by **Latency** to find best/worst performers
- Sort by **Axis** to group similar measurements
- Sort by **Label** to separate TagOn/TagOff/Errors

### Grouping Benefits:
- Compare performance across axes
- Identify axis-specific issues
- Organize large datasets
- Export grouped reports

## 🎨 **Visual Indicators**

### Row Colors (with Pass/Fail enabled):
- **Light Green**: ✅ Passed latency criteria
- **Light Red**: ❌ Failed latency criteria
- **Light Yellow**: ⚠️ Error/Unmatched marker

### Label Colors:
- **Green Badge**: TagOn events
- **Blue Badge**: TagOff events
- **Red Badge**: Error events

### Status Icons:
- ↑↓ Sort indicators
- → Paired marker indicator
- ⚠ Unmatched marker warning

## 📝 **Example Data Structure**

### Yellow Marker:
```
"AB6 Single Tag1.0 (X+)"
Parsed as:
{
  abNumber: "AB6",
  descriptor: "Single",
  tagVersion: "1.0",
  axis: "X",
  direction: "+"
}
```

### Complete Test Flow:
1. Yellow: `"AB6 Single Tag1.0 (X+)"` - Sets metadata
2. Green: `"AB6 Single Tag1.0 (X+) #1.1"` - TagOn trigger
3. Pink: Response marker - Creates paired event
4. Cyan: `"AB6 Single Tag1.0 (X+) #1.1"` - TagOff trigger
5. Lemon: Response marker - Creates paired event

### Result:
- Two paired events with calculated latencies
- Both tagged with X+ axis
- Grouped together when axis grouping enabled
- Pass/fail evaluated against criteria

## 🚀 **Performance Benefits**

- **Faster Analysis**: Sort by latency to find issues immediately
- **Better Organization**: Group by axis for targeted review
- **Error Prevention**: Automatic unmatched detection
- **Visual Clarity**: Color coding for instant status recognition
- **Comprehensive Metadata**: Full context for every measurement

---
*Hardware Latency Tester v3.0 - Enhanced for professional testing workflows*