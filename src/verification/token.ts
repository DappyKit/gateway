import { Contract, ContractTransactionResponse, hashMessage, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers'
import UserVerificationABI from '../contracts/user-verification/UserVerificationABI.json'

/**
 * Verification token type
 */
export type VerificationToken = string

/**
 * Verification services
 */
export enum VerificationService {
  Google = 'google',
}

/**
 * Get verification token
 * @param service Verification service
 * @param userId User ID
 */
export function getVerificationToken(service: VerificationService, userId: string): VerificationToken {
  return hashMessage(`${service}_${userId}`)
}

/**
 * Get verification contract
 * @param rpcUrl RPC URL
 * @param verificationContractAddress Verification contract addressSimpleAccountFactoryABI
 * @param serviceWallet Wallet of the service
 */
export function getVerificationContract(
  rpcUrl: string,
  verificationContractAddress: string,
  serviceWallet: HDNodeWallet | Wallet,
): Contract {
  return new Contract(
    verificationContractAddress,
    UserVerificationABI,
    serviceWallet.connect(new JsonRpcProvider(rpcUrl)),
  )
}

/**
 * Send verification token to the smart account
 * @param serviceWallet Wallet of the service which sends the verification token
 * @param rpcUrl RPC URL
 * @param verificationContractAddress Verification contract address
 * @param smartAccountAddress Smart account address to send the verification token
 */
export async function sendVerificationToken(
  serviceWallet: HDNodeWallet | Wallet,
  rpcUrl: string,
  verificationContractAddress: string,
  smartAccountAddress: string,
): Promise<ContractTransactionResponse> {
  if (!(rpcUrl && verificationContractAddress && smartAccountAddress)) {
    throw new Error('rpcUrl, accountFactoryAddress and smartAccountAddress are required')
  }
  const verificationContract = getVerificationContract(rpcUrl, verificationContractAddress, serviceWallet)
  const tokenId = getVerificationToken(VerificationService.Google, smartAccountAddress)

  return verificationContract.issueToken(smartAccountAddress, tokenId)
}
