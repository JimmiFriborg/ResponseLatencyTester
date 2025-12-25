export interface DeviceProfile {
  id: string;
  name: string;
  tagType: string;
  firmware?: string;
  accessories?: string[];
  notes?: string;
}

export const normalizeDeviceProfile = (profile: DeviceProfile): DeviceProfile => ({
  ...profile,
  name: profile.name.trim(),
  tagType: profile.tagType.trim(),
  firmware: profile.firmware?.trim(),
  accessories: (profile.accessories || []).map((item) => item.trim()).filter(Boolean)
});

export const buildTraceabilitySummary = (profiles: DeviceProfile[]): string => {
  if (!profiles.length) return 'No device traceability data captured yet.';
  const normalized = profiles.map(normalizeDeviceProfile);
  return normalized
    .map((profile) => `${profile.name} (${profile.tagType}${profile.firmware ? ` · FW ${profile.firmware}` : ''})`)
    .join(' • ');
};
