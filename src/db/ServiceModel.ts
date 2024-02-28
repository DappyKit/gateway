/**
 * AuthServices Enum
 */
export enum AuthService {
  GOOGLE = 1,
  APPLE = 2,
  FARCASTER = 3,
  TELEGRAM = 4,
}

/**
 * Service Model
 */
export interface Service {
  /**
   * ID of the record.
   */
  id: number

  /**
   * Name of the service.
   */
  name: string
}
