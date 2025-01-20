import { db } from './index'

export const TABLE_NAME = 'verify_smart_account'

/**
 * Model for VerifySmartAccount
 */
export interface VerifySmartAccountModel {
  /**
   * ID
   */
  id: bigint

  /**
   * Status
   */
  status: VerifySmartAccountStatus

  /**
   * Smart account address. Lowercased.
   */
  smart_account_address: string

  /**
   * Networks list in form of JSON or empty string.
   */
  networks: string

  /**
   * ID of the raw signature.
   */
  raw_signature_id: bigint | number

  /**
   * Date of creation
   */
  created_at: Date

  /**
   * Date of the last update
   */
  updated_at: Date

  /**
   * Additional data
   */
  data?: string
}

export enum VerifySmartAccountStatus {
  /**
   * Idle
   */
  IDLE = 'idle',

  /**
   * In progress
   */
  IN_PROGRESS = 'in_progress',

  /**
   * Verified
   */
  SUCCESS = 'verified',

  /**
   * Failed
   */
  FAILED = 'failed',
}

/**
 * Inserts a new record into the table
 * @param item Item to insert
 */
export async function insertVerifySmartAccount(
  item: Omit<VerifySmartAccountModel, 'id' | 'created_at' | 'updated_at'>,
): Promise<number> {
  const currentDate = db.fn.now()
  const [id] = await db(TABLE_NAME).insert({
    ...item,
    smart_account_address: item.smart_account_address.toLowerCase(),
    created_at: currentDate,
    updated_at: currentDate,
  })

  return id
}

/**
 * Checks if the specified Smart Account address exists in the table.
 * @param smartAccountAddress The Smart Account address to check.
 * @returns A promise that resolves to true if the address exists, or false otherwise.
 */
export async function checkSmartAccountAddressExists(smartAccountAddress: string): Promise<boolean> {
  const result = await db(TABLE_NAME).where('smart_account_address', smartAccountAddress.toLowerCase()).first()

  return Boolean(result)
}

/**
 * Gets one record by status.
 * @param status Status
 */
export async function getOneByStatus(status: VerifySmartAccountStatus): Promise<VerifySmartAccountModel | undefined> {
  return db(TABLE_NAME).where({ status }).orderBy('id').first()
}

/**
 * Updates the status of the item by ID.
 * @param id ID
 * @param status New status
 * @param data Additional data
 */
export async function updateStatusById(
  id: bigint | number,
  status: VerifySmartAccountStatus,
  data?: string,
): Promise<void> {
  const updateObject = {
    status,
    updated_at: db.fn.now(),
    ...(data !== undefined && { data }),
  }

  await db(TABLE_NAME).where({ id }).update(updateObject)
}
