import {
  deploySimpleSmartAccount,
  getSimpleSmartAccountAddress,
  isContractDeployed,
} from '../../../src/contracts/aa/account'
import { Contract, hashMessage, JsonRpcProvider, Wallet } from 'ethers'
import UserVerificationABI from '../../../src/contracts/user-verification/UserVerificationABI.json'
import { generateRandomString } from '../../utils/data'
import { getConfigData, loadConfig } from '../../../src/config'

describe('Verify', () => {
  loadConfig()
  const { rpcUrl, accountFactoryAddress, entryPointAddress, googleVerificationContractAddress } = getConfigData()
  const connection = {
    rpcUrl,
    accountFactoryAddress,
    entryPointAddress,
  }

  it('should correctly deploy the smart account and verify', async () => {
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Hardhat Wallet)
    const serviceWallet = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
    const userVerificationContract = new Contract(
      googleVerificationContractAddress,
      UserVerificationABI,
      serviceWallet.connect(new JsonRpcProvider(rpcUrl)),
    )

    const userWallet = Wallet.createRandom()
    const smartAccountAddress = await getSimpleSmartAccountAddress(connection, userWallet.address)
    expect(await isContractDeployed(rpcUrl, smartAccountAddress)).toEqual(false)
    await deploySimpleSmartAccount(serviceWallet, connection, userWallet.address)
    expect(await isContractDeployed(rpcUrl, smartAccountAddress)).toEqual(true)

    // issue verification token
    const tokenId = hashMessage(generateRandomString())
    expect(await userVerificationContract.balanceOf(userWallet.address)).toEqual(0n)
    await userVerificationContract.issueToken(userWallet.address, tokenId)
    expect(await userVerificationContract.balanceOf(userWallet.address)).toEqual(1n)
  })
})
