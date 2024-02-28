import { Contract, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers'
import SimpleAccountFactoryABI from './SimpleAccountFactoryABI.json'

/**
 * Get the simple account factory contract
 * @param rpcUrl RPC URL
 * @param address Address of the contract
 * @param wallet Wallet to make transactions
 */
export function getSimpleAccountFactoryContract(
  address: string,
  rpcUrl?: string,
  wallet?: Wallet | HDNodeWallet,
): Contract {
  let runner

  if (rpcUrl) {
    const provider = new JsonRpcProvider(rpcUrl)
    runner = wallet ? wallet.connect(provider) : provider
  }

  return new Contract(address, SimpleAccountFactoryABI, runner)
}
