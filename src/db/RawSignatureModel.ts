import { db } from './index'
import { currentYMDHIS } from './utils'

/**
 * The name of the table.
 */
export const TABLE_NAME = 'raw_signature'

/**
 * The model.
 */
export interface RawSignature {
  id: bigint
  eoa_address: string
  user_id: string
  service_id: number
  created_at: Date
  updated_at: Date
}

/**
 * Inserts a raw signature into the database.
 * @param item The raw signature to insert.
 */
export async function insertRawSignature(
  item: Omit<RawSignature, 'id' | 'created_at' | 'updated_at'>,
): Promise<number> {
  const currentDate = currentYMDHIS()
  const [id] = await db(TABLE_NAME).insert({
    ...item,
    // for search optimization
    eoa_address: item.eoa_address.toLowerCase(),
    created_at: currentDate,
    updated_at: currentDate,
  })

  return id
}

/**
 * Gets a raw signature from the database.
 * @param id ID
 */
export async function getRawSignatureById(id: number): Promise<RawSignature> {
  return db(TABLE_NAME).where({ id }).first()
}

/**
 * Gets a raw signature from the database by EOA address.
 * @param eoaAddress EOA address
 */
export async function getRawSignatureByEoa(eoaAddress: string): Promise<RawSignature | undefined> {
  eoaAddress = eoaAddress.toLowerCase()

  return db(TABLE_NAME).where({ eoa_address: eoaAddress }).first()
}

/**
 * Gets a raw signature from the database by user ID.
 * @param userId User ID
 */
export async function getRawSignatureByUserId(userId: number): Promise<RawSignature[]> {
  return db(TABLE_NAME).where({ user_id: userId })
}

/**
 * Checks if a raw signature exists by user ID or EOA address.
 * @param userId The user ID to search for.
 * @param serviceId The service ID to search for.
 * @returns True if a raw signature is found for either the user ID or EOA address.
 */
export async function existsRawSignature(userId: string, serviceId: number): Promise<boolean> {
  const result = await db(TABLE_NAME).where({ user_id: userId, service_id: serviceId }).first()

  return Boolean(result)
}
