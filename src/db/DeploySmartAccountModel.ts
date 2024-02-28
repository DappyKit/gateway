import { currentYMDHIS } from './utils'
import { db } from './index'

/**
 * The name of the table.
 */
export const TABLE_NAME = 'deploy_smart_account'

export interface DeploySmartAccountModel {
  /**
   * ID of the record.
   */
  id: bigint | number

  /**
   * Status of the deployment.
   */
  status: DeploySmartAccountStatus

  /**
   * EOA address. Cannot deploy two times, so it is unique. Lowercased.
   */
  eoa_address: string

  /**
   * Calculated Smart Account address. Deterministic from the EOA address or passed by the user. Lowercased.
   */
  smart_account_address: string

  /**
   * Additional data
   */
  data?: string

  /**
   * ID of the raw signature.
   */
  raw_signature_id: bigint | number

  /**
   * Date of creation.
   */
  created_at: Date

  /**
   * Date of the last update.
   */
  updated_at: Date
}

/**
 * Status of the deployment.
 */
export enum DeploySmartAccountStatus {
  /**
   *
   */
  IDLE = 'idle',

  /**
   *
   */
  IN_PROGRESS = 'in_progress',

  /**
   * The deployment is successful.
   */
  SUCCESS = 'success',

  /**
   * The deployment is failed.
   */
  FAILED = 'failed',
}

/**
 * Inserts information about the smart account deployment into the database.
 * @param item Information about the smart account deployment.
 */
export async function insertDeploySmartAccount(
  item: Omit<DeploySmartAccountModel, 'id' | 'created_at' | 'updated_at'>,
): Promise<number> {
  const currentDate = currentYMDHIS()
  const [id] = await db(TABLE_NAME).insert({
    ...item,
    eoa_address: item.eoa_address.toLowerCase(),
    smart_account_address: item.smart_account_address.toLowerCase(),
    created_at: currentDate,
    updated_at: currentDate,
  })

  return id
}

/**
 * Gets one record by status.
 * @param status Status
 */
export async function getOneByStatus(status: DeploySmartAccountStatus): Promise<DeploySmartAccountModel | undefined> {
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
  status: DeploySmartAccountStatus,
  data?: string,
): Promise<void> {
  const updateObject = {
    status,
    updated_at: db.fn.now(),
    ...(data !== undefined && { data }),
  }

  await db(TABLE_NAME).where({ id }).update(updateObject)
}

/**
 * Checks if either the EOA address or the Smart Account address already exists in the table.
 * @param eoaAddress The EOA address to check.
 * @param smartAccountAddress The Smart Account address to check.
 * @returns A promise that resolves to true if either address exists, or false otherwise.
 */
export async function checkAddressExists(eoaAddress: string, smartAccountAddress: string): Promise<boolean> {
  const result = await db(TABLE_NAME)
    .where('eoa_address', eoaAddress.toLowerCase())
    .orWhere('smart_account_address', smartAccountAddress.toLowerCase())
    .first()

  return Boolean(result)
}
