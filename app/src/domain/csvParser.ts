export interface ColumnMapping {
  marker: string;
  color: string;
  timecode: string;
  comment: string;
  track?: string;
}

export interface ParsedMarker {
  marker: string;
  color: string;
  timecode: string;
  timestampMs: number | null;
  comment: string;
  track?: string;
}

export interface CsvParseIssue {
  type: 'error' | 'warning';
  message: string;
  hint?: string;
}

export interface CsvParseResult {
  records: ParsedMarker[];
  mappingUsed: ColumnMapping;
  issues: CsvParseIssue[];
  troubleshooting: string[];
}

export const DEFAULT_COLUMN_MAPPING: ColumnMapping = {
  marker: 'Marker Name',
  color: 'Color',
  timecode: 'Timecode',
  comment: 'Comment',
  track: 'Track'
};

const EXPECTED_MARKERS = ['TagOff', 'MotionStart', 'MotionPeak', 'MotionSettle'];

const normalizeHeader = (value: string) => value.trim().toLowerCase();

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
};

export const parseTimecodeToMs = (timecode: string): number | null => {
  const pattern = /^(\d{1,2}):(\d{2}):(\d{2})(?:[:.](\d{2,3}))?$/;
  const match = timecode.trim().match(pattern);
  if (!match) return null;
  const [, hh, mm, ss, frames] = match;
  const hours = Number(hh);
  const minutes = Number(mm);
  const seconds = Number(ss);
  const remainder = frames ? Number(frames) : 0;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const msFromFrames = frames && frames.length === 2 ? (Number(frames) / 30) * 1000 : remainder;
  return Math.round(totalSeconds * 1000 + msFromFrames);
};

const resolveMapping = (headers: string[], preferred: ColumnMapping): { mapping: ColumnMapping; issues: CsvParseIssue[] } => {
  const normalized = headers.map(normalizeHeader);
  const findColumn = (fallback: string): string => {
    const normalizedFallback = normalizeHeader(fallback);
    const index = normalized.indexOf(normalizedFallback);
    return index >= 0 ? headers[index] : fallback;
  };

  const mapping: ColumnMapping = {
    marker: findColumn(preferred.marker),
    color: findColumn(preferred.color),
    timecode: findColumn(preferred.timecode),
    comment: findColumn(preferred.comment),
    track: preferred.track ? findColumn(preferred.track) : undefined
  };

  const issues: CsvParseIssue[] = [];
  ['marker', 'timecode', 'color'].forEach((key) => {
    const typedKey = key as keyof ColumnMapping;
    if (!normalized.includes(normalizeHeader(mapping[typedKey] as string))) {
      issues.push({
        type: 'error',
        message: `Expected a "${preferred[typedKey] || typedKey}" column but it was not found.`,
        hint: 'Ensure DaVinci Resolve CSV exports include marker name, timecode, and color columns.'
      });
    }
  });

  return { mapping, issues };
};

export const parseCsv = (source: string, preferredMapping: ColumnMapping = DEFAULT_COLUMN_MAPPING): CsvParseResult => {
  const lines = source.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const issues: CsvParseIssue[] = [];
  const troubleshooting: string[] = [];

  if (lines.length === 0) {
    return {
      records: [],
      mappingUsed: preferredMapping,
      issues: [
        {
          type: 'error',
          message: 'No CSV content detected.',
          hint: 'Re-export the markers from DaVinci Resolve and try again.'
        }
      ],
      troubleshooting
    };
  }

  const header = parseCsvLine(lines[0]);
  const { mapping, issues: mappingIssues } = resolveMapping(header, preferredMapping);
  issues.push(...mappingIssues);

  const records: ParsedMarker[] = [];
  const missingColors: string[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const row = parseCsvLine(lines[i]);
    const headerMap = header.reduce<Record<string, string>>((acc, value, index) => {
      acc[normalizeHeader(value)] = row[index] ?? '';
      return acc;
    }, {});

    const marker = headerMap[normalizeHeader(mapping.marker)] || '';
    const color = headerMap[normalizeHeader(mapping.color)] || '';
    const timecode = headerMap[normalizeHeader(mapping.timecode)] || '';
    const comment = headerMap[normalizeHeader(mapping.comment)] || '';
    const track = mapping.track ? headerMap[normalizeHeader(mapping.track)] : undefined;

    if (!marker && !timecode) {
      continue;
    }

    if (!color) {
      missingColors.push(marker || `row ${i + 1}`);
    }

    records.push({
      marker,
      color,
      timecode,
      timestampMs: parseTimecodeToMs(timecode),
      comment,
      track
    });
  }

  if (missingColors.length > 0) {
    issues.push({
      type: 'warning',
      message: 'Some markers were missing colors, which are required for pattern detection.',
      hint: `Rows affected: ${missingColors.slice(0, 6).join(', ')}${missingColors.length > 6 ? '…' : ''}`
    });
  }

  const missingRequiredMarkers = EXPECTED_MARKERS.filter(
    (marker) => !records.some((record) => record.marker.toLowerCase().includes(marker.toLowerCase()))
  );
  if (missingRequiredMarkers.length > 0) {
    issues.push({
      type: 'warning',
      message: 'Expected marker names were not found in the CSV.',
      hint: `Missing: ${missingRequiredMarkers.join(', ')}. Check marker naming or color coding in DaVinci.`
    });
  }

  if (!issues.some((issue) => issue.type === 'error')) {
    troubleshooting.push(
      'If marker patterns still look off, confirm that paired marker colours match the quick reference guide.',
      'When DaVinci exports omit colours, enable the "Export marker colours" checkbox or include the colour column manually.',
      'If timestamps are misaligned, verify your timeline frame rate and re-export after locking the track frame rate.'
    );
  }

  return {
    records,
    mappingUsed: mapping,
    issues,
    troubleshooting
  };
};
