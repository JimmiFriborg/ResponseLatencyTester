# Hardware Latency Tester - Portable Edition

> **Note:** This guide documents the legacy Babel-enabled portable builds that now live under `archive/legacy-html/`. The active React/TypeScript source compiles to a single `dist/latency-tester.html` via `npm run build`, which should be opened for the current portable experience.

## 🚀 Quick Start

### Option 1: Direct Browser (Easiest)
1. Download `latency-tester-portable.html`
2. Double-click the file to open in your default browser
3. Start testing immediately!

### Option 2: USB Drive
1. Save `latency-tester-portable.html` to a USB drive
2. Plug into any computer
3. Open the file with any modern browser
4. All data is saved locally in the browser

### Option 3: Network Share
1. Place `latency-tester-portable.html` on a network share
2. Access from any device on your network
3. Each device maintains its own local data

### Option 4: Email/Cloud
1. Email the HTML file or upload to cloud storage
2. Download on any device
3. Run locally with full functionality

## 🎬 DaVinci Resolve Integration (v2.0)

### NEW: Paired Marker System for Precise Latency Measurement

The tool now supports an advanced paired marker system that measures exact latencies between trigger events and experience responses!

#### Marker Color System:
- 🟡 **Yellow** = Tag identification (groups test runs)
- 🟢 **Green → 🩷 Pink** = TagOn trigger → Experience activated by tag placement
- 🔵 **Cyan → 🍋 Lemon** = TagOff trigger → Experience activated by tag removal  
- 🔷 **Blue/Red** = Ignored placeholders

#### How It Works:
1. **Paired Events**: 
   - Green→Pink: Measures time for experience to activate when tag is placed
   - Cyan→Lemon: Measures time for experience to activate when tag is removed
2. **Both are activations**: Pink and Lemon both represent the experience turning ON
3. **Different triggers**: Pink responds to placement, Lemon responds to removal
4. **Automatic Calculation**: The tool calculates the time between paired markers

#### Export from DaVinci Resolve:
1. In DaVinci Resolve, open your timeline with markers
2. Go to **File → Export → Timeline Markers to EDL**
3. Choose **CSV** format
4. Save the file

#### Naming Conventions:
- Tag identification: `Tile Tag 1.0 #[tag_number]`
- TagOn trigger: `AB6 TagOn - TileTag 1.0 #[tag].[run]`
- TagOff trigger: `AB6 TagOff - TileTag 1.0 #[tag].[run]`
- Experience markers: Any identifier (paired with previous trigger)

Example: `#10.2` means Tag #10, Test Run #2

#### Import Results:
When you import a DaVinci CSV with paired markers:
- Green→Pink pairs show TagOn latency
- Cyan→Lemon pairs show TagOff latency
- Unpaired markers are flagged
- Statistics calculated per tag and run
- Visual indicators show paired relationships (→)

## 💾 Data Persistence
- Data automatically saves to browser's localStorage
- Persists across sessions on the same device
- Export to JSON/CSV for backup or sharing
- Import previous test data on any device
- Import DaVinci Resolve CSV marker exports

## 🌐 Browser Compatibility
Works on all modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## 📱 Device Compatibility
- Windows PC
- Mac
- Linux
- Chromebooks
- Tablets with browsers
- Even smartphones (limited UI)

## 🔒 Security & Privacy
- **100% Offline**: No internet connection required
- **Local Storage Only**: Data never leaves your device
- **No Installation**: Zero footprint, no registry changes
- **No Dependencies**: Everything included in one file

## 📊 Features
- ⏱️ Precise latency measurements (seconds.milliseconds)
- 📈 Real-time statistics (min/avg/max/outliers)
- 🏷️ Customizable labels (TagOn/TagOff/Error)
- 📋 Excel copy/paste support
- 🎬 DaVinci Resolve CSV import support
- 🔄 Multi-test comparison
- ✅ Pass/fail criteria
- 💾 Auto-save with manual override
- 📤 Export to JSON/CSV
- 🖨️ Print-friendly reports
- ⏰ Timecode conversion (HH:MM:SS:FF → seconds.ms)

## 🛠️ Technical Details
- **Size**: ~65KB (single file)
- **Technology**: React 18, Tailwind CSS, Lucide Icons
- **Storage**: Browser localStorage (5-10MB typical limit)
- **Performance**: Handles 1000+ timestamps smoothly
- **Import Formats**: JSON, DaVinci Resolve CSV
- **Export Formats**: JSON, CSV

## 📝 Tips
1. **Excel Integration**: Copy columns from Excel and paste directly into the timestamp table
2. **DaVinci Integration**: Export timeline markers as CSV and import directly
3. **Backup**: Regularly export to JSON for permanent backups
4. **Sharing**: Export data as JSON to share with colleagues
5. **Multiple Projects**: Use different browsers/profiles for separate projects
6. **Video Sync**: Use DaVinci markers to sync latency tests with video footage

## 🆘 Troubleshooting

### Data not saving?
- Check if browser allows localStorage
- Try a different browser
- Clear browser cache if storage is full

### Can't paste from Excel?
- Click in the timestamp table first
- Ensure data is tab-separated
- Try Ctrl+V (Windows) or Cmd+V (Mac)

### DaVinci CSV not importing?
- Ensure you exported as CSV (not EDL)
- Check marker colors match conventions
- Verify marker notes follow naming format
- Try opening CSV in text editor to verify format

### Need to transfer data?
1. Export as JSON from device A
2. Import JSON on device B
3. Continue testing seamlessly

## 📧 Distribution
This is a standalone HTML file that can be:
- Emailed to colleagues
- Hosted on any web server
- Shared via cloud storage
- Distributed on physical media
- Embedded in documentation

No installation, no configuration, just open and test!

---
*Hardware Latency Tester - Portable Edition v1.1*
*Now with DaVinci Resolve integration!*
*Zero installation, maximum portability, professional testing*