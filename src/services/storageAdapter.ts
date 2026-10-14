/**
 * Vastramay Versioned Storage Engine & Resilience Layer
 *
 * Implements a fault-tolerant, versioned storage adapter with:
 * 1. Schema versioning & envelope wrapping ({ schemaVersion, timestamp, data })
 * 2. Automatic migration recovery from legacy/unversioned payloads
 * 3. Invalid JSON corruption detection & graceful recovery
 * 4. In-memory fallback if localStorage is disabled or throws QuotaExceededError
 * 5. Strict prevention of sensitive credential/payment persistence
 */

export const CURRENT_SCHEMA_VERSION = 2;

export interface StorageEnvelope<T> {
  schemaVersion: number;
  timestamp: string;
  data: T;
}

export interface StorageAdapter {
  getItem<T>(key: string, defaultValue: T): Promise<T>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  isStorageAvailable(): boolean;
  getSchemaVersion(): number;
}

export class VersionedLocalStorageAdapter implements StorageAdapter {
  private prefix: string;
  private simulateDelayMs: number;
  private memoryFallback: Map<string, string>;
  private isLocalStorageSupported: boolean;

  // Sensitive field names that must never be committed to client persistence
  private sensitiveKeyBlacklist = new Set([
    'password',
    'admin_password',
    'cvv',
    'credit_card',
    'bank_credentials',
    'stripe_secret',
    'auth_token_raw',
  ]);

  constructor(prefix = 'vastramay_v2_', simulateDelayMs = 25) {
    this.prefix = prefix;
    this.simulateDelayMs = simulateDelayMs;
    this.memoryFallback = new Map<string, string>();
    this.isLocalStorageSupported = this.checkStorageAvailability();
  }

  private checkStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = `__vastramay_probe_${Date.now()}`;
      window.localStorage.setItem(testKey, 'probe');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn(
        '[StorageAdapter] localStorage is unavailable (private mode or disabled). Falling back to in-memory state.'
      );
      return false;
    }
  }

  public isStorageAvailable(): boolean {
    return this.isLocalStorageSupported;
  }

  public getSchemaVersion(): number {
    return CURRENT_SCHEMA_VERSION;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private async delay(): Promise<void> {
    if (this.simulateDelayMs <= 0) return;
    return new Promise((resolve) => setTimeout(resolve, this.simulateDelayMs));
  }

  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    await this.delay();
    const fullKey = this.getKey(key);

    try {
      let rawData: string | null = null;

      if (this.isLocalStorageSupported) {
        rawData = window.localStorage.getItem(fullKey);
      } else {
        rawData = this.memoryFallback.get(fullKey) || null;
      }

      if (rawData === null) {
        return defaultValue;
      }

      // Parse JSON and inspect version envelope
      const parsed = JSON.parse(rawData);

      // Handle envelope wrapped payload
      if (
        parsed &&
        typeof parsed === 'object' &&
        'schemaVersion' in parsed &&
        'data' in parsed
      ) {
        const envelope = parsed as StorageEnvelope<T>;

        // Schema migration check
        if (envelope.schemaVersion < CURRENT_SCHEMA_VERSION) {
          console.info(
            `[StorageAdapter] Migrating key "${key}" from schema v${envelope.schemaVersion} to v${CURRENT_SCHEMA_VERSION}`
          );
          // Automatically re-wrap and save upgraded record
          await this.setItem(key, envelope.data);
          return envelope.data;
        }

        return envelope.data;
      }

      // Legacy unversioned record recovery: automatically upgrade to current schema envelope
      console.warn(
        `[StorageAdapter] Upgrading unversioned payload for key "${key}" to schema v${CURRENT_SCHEMA_VERSION}`
      );
      const migratedData = parsed as T;
      await this.setItem(key, migratedData);
      return migratedData;
    } catch (err) {
      console.error(
        `[StorageAdapter] Corrupted JSON detected for key "${key}". Resetting to default fallback. Error:`,
        err
      );
      // Clean up corrupted key to prevent cascading failures
      await this.removeItem(key);
      return defaultValue;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await this.delay();

    // Security guard: Reject sensitive credential leaks
    if (this.sensitiveKeyBlacklist.has(key.toLowerCase())) {
      console.error(
        `[StorageAdapter Security Guard] Blocked attempt to persist sensitive key "${key}" to browser storage.`
      );
      return;
    }

    const fullKey = this.getKey(key);
    const envelope: StorageEnvelope<T> = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      data: value,
    };

    const serialized = JSON.stringify(envelope);

    if (this.isLocalStorageSupported) {
      try {
        window.localStorage.setItem(fullKey, serialized);
      } catch (err: any) {
        if (
          err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          console.error(
            `[StorageAdapter] Storage quota exceeded while saving "${key}". Evicting into in-memory store.`,
            err
          );
          this.memoryFallback.set(fullKey, serialized);
        } else {
          console.error(`[StorageAdapter] Failed to set key "${key}":`, err);
          this.memoryFallback.set(fullKey, serialized);
        }
      }
    } else {
      this.memoryFallback.set(fullKey, serialized);
    }
  }

  async removeItem(key: string): Promise<void> {
    await this.delay();
    const fullKey = this.getKey(key);

    if (this.isLocalStorageSupported) {
      try {
        window.localStorage.removeItem(fullKey);
      } catch (err) {
        console.error(`[StorageAdapter] Failed to remove key "${key}":`, err);
      }
    }
    this.memoryFallback.delete(fullKey);
  }

  async clear(): Promise<void> {
    await this.delay();
    if (this.isLocalStorageSupported) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (
            k &&
            (k.startsWith(this.prefix) || k.startsWith('vastramay_v1_'))
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } catch (err) {
        console.error('[StorageAdapter] Failed to clear keys:', err);
      }
    }
    this.memoryFallback.clear();
  }
}

// Global resilient singleton instance
export const storage = new VersionedLocalStorageAdapter();
