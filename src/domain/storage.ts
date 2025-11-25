export interface VersionedStorageOptions<T> {
  key: string;
  version: number;
  storage?: Storage;
  migrations?: Record<number, (data: any) => any>;
}

export const createVersionedStorage = <T>({
  key,
  version,
  storage = typeof window !== 'undefined' ? window.localStorage : undefined,
  migrations = {}
}: VersionedStorageOptions<T>) => {
  const read = (fallback: T): T => {
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version === version) {
        return parsed.data as T;
      }
      if (parsed.version < version) {
        let migrated = parsed.data;
        for (let v = parsed.version + 1; v <= version; v += 1) {
          if (migrations[v]) {
            migrated = migrations[v](migrated);
          }
        }
        storage.setItem(key, JSON.stringify({ version, data: migrated }));
        return migrated as T;
      }
    } catch (error) {
      console.warn('Failed to read versioned storage', error);
    }
    return fallback;
  };

  const write = (value: T) => {
    if (!storage) return;
    storage.setItem(key, JSON.stringify({ version, data: value }));
  };

  const clear = () => {
    if (!storage) return;
    storage.removeItem(key);
  };

  return { read, write, clear };
};
