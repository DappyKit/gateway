import { verifyMessage } from 'ethers'
import { getSimpleSmartAccountAddress, IConnection } from '../../../../contracts/aa/account'
import { ETH_SIGNATURE_0X_HEX_LENGTH, is0xEthSignature } from '../../../../utils/eth'
import { getOwnableContract } from '../../../../contracts/utils'

/**
 * Interface for the request to verify Google's OAuth
 */
export interface IVerifyGoogleRequest {
  /**
   * Data with credentials from Google's OAuth
   */
  data: string

  /**
   * EOA signature of the user id
   */
  eoaSignature: string

  /**
   * Smart account address that already deployed
   */
  smartAccountAddress?: string
}

/**
 * Interface for the verified wallet response
 */
export interface IVerifiedWallet {
  /**
   * Recovered address from the signature
   */
  recoveredAddress: string

  /**
   * Smart account address
   */
  smartAccountAddress: string
}

/**
 * Extracts data from the request
 * @param requestData Request data
 */
export function extract(requestData: unknown): IVerifyGoogleRequest {
  const { data, eoaSignature, smartAccountAddress } = requestData as IVerifyGoogleRequest

  if (!data) {
    throw new Error('VerifyGoogleRequest: "data" is not defined')
  }

  if (!eoaSignature) {
    throw new Error('VerifyGoogleRequest: "eoaSignature" is not defined')
  }

  if (!is0xEthSignature(eoaSignature)) {
    throw new Error(
      `VerifyGoogleRequest: "eoaSignature" is not a valid signature. Expected length: ${ETH_SIGNATURE_0X_HEX_LENGTH}`,
    )
  }

  if (smartAccountAddress) {
    // an ability to verify already deployed smart account can be added later
    // verify an address with: is0xEthAddress(smartAccountAddress)
    throw new Error(
      'The smart account address is undefined. Verification is available only for accounts that have not been deployed.',
    )
  }

  return {
    data,
    eoaSignature,
    smartAccountAddress,
  }
}

/**
 * Verifies the wallet data
 * @param connection Connection object
 * @param rawData Raw data
 * @param eoaSignature EOA signature
 * @param smartAccountAddress Smart account address for which EOA is the owner or skip if the default or not deployed
 */
export async function verifyWalletData(
  connection: IConnection,
  rawData: string,
  eoaSignature: string,
  smartAccountAddress?: string,
): Promise<IVerifiedWallet> {
  const recoveredAddress = verifyMessage(rawData, eoaSignature)

  if (smartAccountAddress) {
    if ((await getOwnableContract(connection.rpcUrl, smartAccountAddress).owner()) !== recoveredAddress) {
      throw new Error('Smart account owner does not match the signer')
    }
  } else {
    smartAccountAddress = await getSimpleSmartAccountAddress(connection, recoveredAddress)
  }

  return { recoveredAddress, smartAccountAddress }
}
