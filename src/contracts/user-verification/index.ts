import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import abi from './UserVerificationABI.json'

/**
 * Check if the smart account is verified by the verifier
 * @param rpcUrl RPC URL
 * @param smartAccountAddress Smart account address
 * @param verifierAddress Verifier address
 */
export async function getIsVerified(
  rpcUrl: string,
  smartAccountAddress: string,
  verifierAddress: string,
): Promise<boolean> {
  try {
    return (await getTokenId(rpcUrl, smartAccountAddress, verifierAddress)) !== '0'
  } catch (e) {
    return false
  }
}

/**
 * Get the token ID of the smart account
 * @param rpcUrl RPC URL
 * @param smartAccountAddress Smart account address
 * @param verifierAddress Verifier address
 */
export async function getTokenId(
  rpcUrl: string,
  smartAccountAddress: string,
  verifierAddress: string,
): Promise<string> {
  const contract = new Contract(verifierAddress, abi, new JsonRpcProvider(rpcUrl))

  return (await contract.callStatic.getTokenId(smartAccountAddress)).toString()
}
