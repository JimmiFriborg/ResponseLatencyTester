import { describe, expect, it } from 'vitest';
import { createVersionedStorage } from '../src/domain/storage';

describe('versioned storage', () => {
  it('migrates older payloads and persists new versions', () => {
    const memory: Record<string, string> = {};
    const storage: Storage = {
      length: 0,
      clear: () => Object.keys(memory).forEach((key) => delete memory[key]),
      getItem: (key: string) => memory[key] || null,
      key: (index: number) => Object.keys(memory)[index] || null,
      removeItem: (key: string) => delete memory[key],
      setItem: (key: string, value: string) => {
        memory[key] = value;
        return null as any;
      }
    };

    const storeV1 = createVersionedStorage<{ queue: string[] }>({ key: 'k', version: 1, storage });
    storeV1.write({ queue: ['a'] });

    const storeV2 = createVersionedStorage<{ queue: string[]; mode: string }>({
      key: 'k',
      version: 2,
      storage,
      migrations: { 2: (data) => ({ queue: data.queue || [], mode: 'full' }) }
    });

    const value = storeV2.read({ queue: [], mode: 'full' });
    expect(value.mode).toBe('full');
    expect(value.queue).toContain('a');
  });
});
