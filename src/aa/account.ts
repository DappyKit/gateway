import { Contract, JsonRpcProvider, concat, BytesLike } from 'ethers'
import SimpleAccountFactoryABI from './SimpleAccountFactoryABI.json'
import EntryPointABI from './EntryPointABI.json'

/**
 * Connection object interface
 */
export interface IConnection {
  /**
   * RPC URL
   */
  rpcUrl: string

  /**
   * Account factory address
   */
  accountFactoryAddress: string

  /**
   * Entry point address
   */
  entryPointAddress: string
}

/**
 * Error object for account address retrieval
 */
export interface IAccountError {
  message: string
  revert: {
    args: string[]
  }
}

/**
 * Get the init code for creating a smart account
 * @param accountFactoryAddress Address of the account factory
 * @param owner Address of the owner
 * @param salt Salt for the smart account
 */
export function getAccountInitCode(accountFactoryAddress: string, owner: string, salt = 0): BytesLike {
  const factory = new Contract(accountFactoryAddress, SimpleAccountFactoryABI)
  const data = factory.interface.encodeFunctionData('createAccount', [owner, salt])

  return concat([accountFactoryAddress, data])
}

/**
 * Get the smart account address
 * @param connection Connection object
 * @param eoaAddress Address of the EOA
 */
export async function getSmartAccountAddress(connection: IConnection, eoaAddress: string): Promise<string> {
  const { rpcUrl, accountFactoryAddress, entryPointAddress } = connection

  if (!(rpcUrl && accountFactoryAddress && entryPointAddress && eoaAddress)) {
    throw new Error('rpcUrl, accountFactoryAddress, entryPointAddress, and eoaAddress are required')
  }

  let result = ''
  const initCode = getAccountInitCode(accountFactoryAddress, eoaAddress)
  const entryPoint = new Contract(entryPointAddress, EntryPointABI, new JsonRpcProvider(rpcUrl))

  try {
    await entryPoint.getSenderAddress.staticCall(initCode)
  } catch (e) {
    const error = e as IAccountError

    if (error?.revert?.args?.length) {
      result = error?.revert?.args[0]
    }
  }

  if (!result) {
    throw new Error('Smart Account address is not available for retrieving')
  }

  return result
}
