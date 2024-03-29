import { existsRawSignature, insertRawSignature } from '../../../../db/RawSignatureModel'
import { AuthService } from '../../../../db/ServiceModel'
import {
  checkAddressExists,
  DeploySmartAccountStatus,
  insertDeploySmartAccount,
} from '../../../../db/DeploySmartAccountModel'
import {
  checkSmartAccountAddressExists,
  insertVerifySmartAccount,
  VerifySmartAccountStatus,
} from '../../../../db/VerifySmartAccountModel'

/**
 * Insert information into the database
 * @param userId User ID
 * @param eoaAddress EOA address
 * @param smartAccountAddress Smart account address
 * @param authService Authentication service
 */
export async function insertInfo(
  userId: string,
  eoaAddress: string,
  smartAccountAddress: string,
  authService: AuthService,
): Promise<{ rawSignatureId: number; deploymentTaskId: number; verificationTaskId: number }> {
  const preparedEoaAddress = eoaAddress.replace('0x', '').toLowerCase()
  const preparedSmartAccountAddress = smartAccountAddress.replace('0x', '').toLowerCase()

  if (await existsRawSignature(userId, authService)) {
    throw new Error('Service signature for the user already exists in the raw signature table')
  }

  if (await checkAddressExists(preparedEoaAddress, preparedSmartAccountAddress)) {
    throw new Error('Either EOA address or Smart Account address already exists in the deploy table')
  }

  if (await checkSmartAccountAddressExists(preparedSmartAccountAddress)) {
    throw new Error('Smart Account address already exists in the verify table')
  }

  const rawSignatureId = await insertRawSignature({
    eoa_address: preparedEoaAddress,
    user_id: userId,
    service_id: authService,
  })

  const deploymentTaskId = await insertDeploySmartAccount({
    eoa_address: preparedEoaAddress,
    smart_account_address: preparedSmartAccountAddress,
    raw_signature_id: rawSignatureId,
    status: DeploySmartAccountStatus.IDLE,
  })

  const verificationTaskId = await insertVerifySmartAccount({
    smart_account_address: preparedSmartAccountAddress,
    raw_signature_id: rawSignatureId,
    status: VerifySmartAccountStatus.IDLE,
  })

  return {
    rawSignatureId,
    deploymentTaskId,
    verificationTaskId,
  }
}
