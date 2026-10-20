export type ServiceErrorCode =
  | "storage-unavailable"
  | "corrupted-data"
  | "not-signed-in"
  | "not-found"
  | "validation"
  | "auth"

export class ServiceError extends Error {
  readonly code: ServiceErrorCode

  constructor(code: ServiceErrorCode, message: string) {
    super(message)
    this.name = "ServiceError"
    this.code = code
  }
}

export function getServiceErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof ServiceError ? error.message : fallback
}
