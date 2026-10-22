import type { User } from "@/lib/types"
import { ServiceError } from "./errors"
import {
  AUTH_STORAGE_KEY,
  isRecord,
  readJson,
  removeStorageItem,
  simulateDelay,
  userCollectionKey,
  writeJson,
} from "./storage"

export type SignUpInput = {
  name: string
  email: string
  password: string
}

export type LogInInput = {
  email: string
  password: string
}

type StoredUser = User & { password: string }

type StoredAuth = {
  users: StoredUser[]
  sessionUserId: string | null
}

const EMPTY_AUTH: StoredAuth = { users: [], sessionUserId: null }

function isStoredUser(value: unknown): value is StoredUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.password === "string"
  )
}

function isStoredAuth(value: unknown): value is StoredAuth {
  return (
    isRecord(value) &&
    Array.isArray(value.users) &&
    value.users.every(isStoredUser) &&
    (value.sessionUserId === null || typeof value.sessionUserId === "string")
  )
}

function readAuth(): StoredAuth {
  return readJson(AUTH_STORAGE_KEY, isStoredAuth) ?? EMPTY_AUTH
}

function writeAuth(auth: StoredAuth): void {
  writeJson(AUTH_STORAGE_KEY, auth)
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function toUser(user: StoredUser): User {
  return { id: user.id, name: user.name, email: user.email }
}

function findUser(auth: StoredAuth, userId: string | null): StoredUser | null {
  if (!userId) return null
  return auth.users.find((user) => user.id === userId) ?? null
}

export const DEFAULT_USER_NAME = "You"

/**
 * Resolves the profile used while sign-in is disabled: the active session,
 * otherwise the most recently saved account, otherwise a new local profile.
 */
function resolveLocalUser(): StoredUser {
  const auth = readAuth()
  const sessionUser = findUser(auth, auth.sessionUserId)
  if (sessionUser) return sessionUser

  const latestUser = auth.users[auth.users.length - 1]
  if (latestUser) {
    writeAuth({ ...auth, sessionUserId: latestUser.id })
    return latestUser
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: DEFAULT_USER_NAME,
    email: "",
    password: "",
  }

  writeAuth({ users: [user], sessionUserId: user.id })
  return user
}

/** Used by the habit and completion services. */
export function requireSessionUserId(): string {
  return resolveLocalUser().id
}

/** Loads the local profile shown by the app while sign-in is disabled. */
export async function getLocalUser(): Promise<User> {
  await simulateDelay()
  return toUser(resolveLocalUser())
}

export async function signUp(input: SignUpInput): Promise<User> {
  await simulateDelay()

  const name = input.name.trim()
  const email = normalizeEmail(input.email)

  if (!name) {
    throw new ServiceError("validation", "Enter your name.")
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ServiceError("validation", "Enter a valid email address.")
  }
  if (!input.password) {
    throw new ServiceError("validation", "Enter a password.")
  }

  const auth = readAuth()
  const exists = auth.users.some((user) => normalizeEmail(user.email) === email)
  if (exists) {
    throw new ServiceError("auth", "An account with this email already exists.")
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: input.password,
  }

  writeAuth({
    users: [...auth.users, user],
    sessionUserId: user.id,
  })

  return toUser(user)
}

export async function logIn(input: LogInInput): Promise<User> {
  await simulateDelay()

  const email = normalizeEmail(input.email)
  const auth = readAuth()
  const user = auth.users.find(
    (candidate) => normalizeEmail(candidate.email) === email,
  )

  if (!user || user.password !== input.password) {
    throw new ServiceError("auth", "Incorrect email or password.")
  }

  writeAuth({ ...auth, sessionUserId: user.id })
  return toUser(user)
}

export async function logOut(): Promise<void> {
  await simulateDelay()

  const auth = readAuth()
  writeAuth({ ...auth, sessionUserId: null })
}

export async function getCurrentUser(): Promise<User | null> {
  await simulateDelay()

  const auth = readAuth()
  const user = findUser(auth, auth.sessionUserId)
  return user ? toUser(user) : null
}

export async function updateName(name: string): Promise<User> {
  await simulateDelay()

  const userId = requireSessionUserId()
  const trimmed = name.trim()

  if (!trimmed) {
    throw new ServiceError("validation", "Enter your name.")
  }

  const auth = readAuth()
  const users = auth.users.map((user) =>
    user.id === userId ? { ...user, name: trimmed } : user,
  )

  writeAuth({ ...auth, users })

  const updated = users.find((user) => user.id === userId)
  if (!updated) {
    throw new ServiceError("not-found", "Your account could not be found.")
  }

  return toUser(updated)
}

/** Clears habits and check-ins but keeps the local profile and theme. */
export async function resetLocalData(): Promise<void> {
  await simulateDelay()

  const userId = requireSessionUserId()
  removeStorageItem(userCollectionKey(userId, "habits"))
  removeStorageItem(userCollectionKey(userId, "completions"))
}

export async function deleteAccount(): Promise<void> {
  await simulateDelay()

  const userId = requireSessionUserId()
  const auth = readAuth()

  removeStorageItem(userCollectionKey(userId, "habits"))
  removeStorageItem(userCollectionKey(userId, "completions"))
  writeAuth({
    users: auth.users.filter((user) => user.id !== userId),
    sessionUserId: null,
  })
}
