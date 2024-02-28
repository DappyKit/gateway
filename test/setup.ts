import { isContractDeployed } from '../src/contracts/aa/account'
import { getConfigData, loadConfig } from '../src/config'
import { Wallet } from 'ethers'
import { getOwnableContract } from '../src/contracts/utils'

export default async function testsSetup(): Promise<void> {
  loadConfig()
  const { rpcUrl, accountFactoryAddress, entryPointAddress, googleVerificationContractAddress } = getConfigData()

  const hardhatWallet = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

  if (!(await isContractDeployed(rpcUrl, accountFactoryAddress))) {
    throw new Error('Account factory is not deployed')
  }

  if (!(await isContractDeployed(rpcUrl, entryPointAddress))) {
    throw new Error('Entry point is not deployed')
  }

  if (!(await isContractDeployed(rpcUrl, googleVerificationContractAddress))) {
    throw new Error('Google verification contract is not deployed')
  }

  if ((await getOwnableContract(rpcUrl, googleVerificationContractAddress).owner()) !== hardhatWallet.address) {
    throw new Error(`${hardhatWallet.address} is not the owner of the contract ${googleVerificationContractAddress}`)
  }
}
