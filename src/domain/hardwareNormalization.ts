export interface HardwareProfile {
  id: string;
  name: string;
  tagType: string;
  firmware?: string;
  accessories?: string[];
  notes?: string;
}

export const normalizeHardwareProfile = (profile: HardwareProfile): HardwareProfile => ({
  ...profile,
  name: profile.name.trim(),
  tagType: profile.tagType.trim(),
  firmware: profile.firmware?.trim(),
  accessories: (profile.accessories || []).map((item) => item.trim()).filter(Boolean)
});

export const buildTraceabilitySummary = (profiles: HardwareProfile[]): string => {
  if (!profiles.length) return 'No hardware traceability data captured yet.';
  const normalized = profiles.map(normalizeHardwareProfile);
  return normalized
    .map((profile) => `${profile.name} (${profile.tagType}${profile.firmware ? ` · FW ${profile.firmware}` : ''})`)
    .join(' • ');
};
