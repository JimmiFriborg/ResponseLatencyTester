# DaVinci Resolve Paired Markers - Quick Reference Card

## 🎨 Color Code (v2.0)
```
🟡 Yellow  = Tag ID        (Groups test runs)
🟢 Green   = TagOn START   (Tag placed)
🩷 Pink    = TagOn END     (Experience activated by tag)
🔵 Cyan    = TagOff START  (Tag removed)  
🍋 Lemon   = TagOff END    (Experience activated by removal)
🔷 Blue    = Ignore        (Placeholders)
🔴 Red     = Ignore        (Placeholders)
```

## ⚡ Latency Measurements
```
TagOn Latency  = Pink time - Green time
               = Time for experience to activate when tag placed

TagOff Latency = Lemon time - Cyan time
               = Time for experience to activate when tag removed
```

## 📝 Marker Naming Format
```
Yellow: Tile Tag 1.0 #10
Green:  AB6 TagOn - TileTag 1.0 #10.1
Pink:   [Any name - auto-pairs with Green]
Cyan:   AB6 TagOff - TileTag 1.0 #10.1
Lemon:  [Any name - auto-pairs with Cyan]
```

## 🔢 Numbering System
```
#10.1  = Tag 10, Run 1
#10.2  = Tag 10, Run 2
#10.12 = Tag 10, Run 12
```

## 📊 Example Timeline
```
Time        Color   Event                    Latency
────────────────────────────────────────────────────
00:05.000   Green   TagOn #10.1              ┐
00:06.500   Pink    Experience activates     ┴ 1.500s
00:10.000   Cyan    TagOff #10.1             ┐
00:11.333   Lemon   Experience activates     ┴ 1.333s
            (Tag placed → experience on)
            (Tag removed → experience on again)
```

## ✅ Import Checklist
- [ ] Markers use correct colors
- [ ] Green always followed by Pink
- [ ] Cyan always followed by Lemon
- [ ] Tag numbers consistent
- [ ] Run numbers sequential
- [ ] Export as CSV (not EDL)

## 🚀 Quick Import Steps
1. Export: File → Export → Timeline Markers → CSV
2. Import: Click Import → Select CSV
3. Review: Check paired events have latencies
4. Analyze: View statistics and outliers

## ⚠️ Common Issues
- **No latency shown**: Missing Pink/Lemon marker
- **Wrong pairing**: Check marker order in timeline
- **Import fails**: Verify CSV format (not EDL)

---
*Keep this card handy while marking in DaVinci Resolve!*