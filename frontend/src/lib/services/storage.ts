import { ServiceError } from "./errors"

const STORAGE_PREFIX = "everyday"
const LEGACY_STORAGE_PREFIX = "fitency"

let hasMigratedLegacyStorage = false

/** Copies pre-rename keys into the new namespace once, leaving originals intact. */
function migrateLegacyStorage(storage: Storage): void {
  if (hasMigratedLegacyStorage) return
  hasMigratedLegacyStorage = true

  try {
    const legacyPrefix = `${LEGACY_STORAGE_PREFIX}:`
    const legacyKeys: string[] = []

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key?.startsWith(legacyPrefix)) legacyKeys.push(key)
    }

    for (const key of legacyKeys) {
      const value = storage.getItem(key)
      const migratedKey = `${STORAGE_PREFIX}${key.slice(LEGACY_STORAGE_PREFIX.length)}`
      if (value !== null && storage.getItem(migratedKey) === null) {
        storage.setItem(migratedKey, value)
      }
    }
  } catch {
    // Best-effort only: a failed migration leaves the old keys untouched.
  }
}

export const AUTH_STORAGE_KEY = `${STORAGE_PREFIX}:auth`

const CORRUPTED_MESSAGE =
  "Your saved data appears to be corrupted. Reload the app or clear this site's data to start fresh."

export type UserCollection = "habits" | "completions"

export function userCollectionKey(
  userId: string,
  collection: UserCollection,
): string {
  return `${STORAGE_PREFIX}:data:${userId}:${collection}`
}

/** Returns localStorage, or throws a user-facing ServiceError. */
export function getLocalStorage(): Storage {
  try {
    const storage = globalThis.localStorage
    if (!storage) throw new Error("localStorage is unavailable")

    // Writes can fail even when reading works (for example when storage is full).
    const probeKey = `${STORAGE_PREFIX}:probe`
    storage.setItem(probeKey, "1")
    storage.removeItem(probeKey)
    migrateLegacyStorage(storage)

    return storage
  } catch {
    throw new ServiceError(
      "storage-unavailable",
      "Browser storage is unavailable. Enable site data for this app and try again.",
    )
  }
}

export function readJson<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): T | null {
  const storage = getLocalStorage()
  let raw: string | null

  try {
    raw = storage.getItem(key)
  } catch {
    throw new ServiceError(
      "storage-unavailable",
      "Browser storage is unavailable. Enable site data for this app and try again.",
    )
  }

  if (raw === null) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new ServiceError("corrupted-data", CORRUPTED_MESSAGE)
  }

  if (!isValid(parsed)) {
    throw new ServiceError("corrupted-data", CORRUPTED_MESSAGE)
  }

  return parsed
}

export function writeJson(key: string, value: unknown): void {
  try {
    getLocalStorage().setItem(key, JSON.stringify(value))
  } catch (error) {
    if (error instanceof ServiceError) throw error
    throw new ServiceError(
      "storage-unavailable",
      "Your changes could not be saved. Check your browser storage and try again.",
    )
  }
}

export function removeStorageItem(key: string): void {
  try {
    getLocalStorage().removeItem(key)
  } catch (error) {
    if (error instanceof ServiceError) throw error
    throw new ServiceError(
      "storage-unavailable",
      "Your saved data could not be removed. Check your browser storage and try again.",
    )
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function simulateDelay(): Promise<void> {
  const min = 200
  const max = 500
  const milliseconds = Math.round(min + Math.random() * (max - min))

  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
