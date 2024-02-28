import { Contract, HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers'

/**
 * Get the contract instance with `owner` method available
 * @param rpcUrl RPC URL
 * @param address Contract address
 * @param wallet Wallet
 */
export function getOwnableContract(rpcUrl: string, address: string, wallet?: Wallet | HDNodeWallet): Contract {
  const provider = new JsonRpcProvider(rpcUrl)

  return new Contract(
    address,
    ['function owner() view returns (address)'],
    wallet ? wallet.connect(provider) : provider,
  )
}
