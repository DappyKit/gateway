import { isContractDeployed } from '../src/contracts/aa/account'
import { getConfigData, loadConfig } from '../src/config'

export default async function testsSetup(): Promise<void> {
  loadConfig()
  const { rpcUrl, accountFactoryAddress, entryPointAddress, googleVerificationContractAddress } = getConfigData()

  if (!(await isContractDeployed(rpcUrl, accountFactoryAddress))) {
    throw new Error('Account factory is not deployed')
  }

  if (!(await isContractDeployed(rpcUrl, entryPointAddress))) {
    throw new Error('Entry point is not deployed')
  }

  if (!(await isContractDeployed(rpcUrl, googleVerificationContractAddress))) {
    throw new Error('Google verification contract is not deployed')
  }

  // is not suitable for mainnet tests
  // if ((await getOwnableContract(rpcUrl, googleVerificationContractAddress).owner()) !== hardhatWallet.address) {
  //   throw new Error(`${hardhatWallet.address} is not the owner of the contract ${googleVerificationContractAddress}`)
  // }
}
