import { formatEther, HDNodeWallet, JsonRpcProvider, Mnemonic, parseEther } from 'ethers'
import { getConfigData, loadConfig } from '../config'
import { log, sleep } from '../utils/other'
import 'dotenv/config'
import { deploySimpleSmartAccount, IConnection } from '../contracts/aa/account'
import * as Deploy from '../db/DeploySmartAccountModel'
import * as Verify from '../db/VerifySmartAccountModel'
import { VerifySmartAccountModel, VerifySmartAccountStatus } from '../db/VerifySmartAccountModel'
import { DeploySmartAccountModel } from '../db/DeploySmartAccountModel'
import { getVerificationContract, sendVerificationToken } from '../verification/token'
import { getRawSignatureById } from '../db/RawSignatureModel'
import { AuthService } from '../db/ServiceModel'
import { extractJsonNetworks } from '../db/utils'

/**
 * Wait confirmations
 */
const WAIT_CONFIRMATIONS = 15

/**
 * Minimum wallet balance
 */
const MIN_WALLET_BALANCE = parseEther('0.01')

const IS_DEV = process.env.DEPLOYER_ENV === 'development'

export interface WalletInfo {
  wallet: HDNodeWallet
  balance: bigint
}

loadConfig()

function getWallets(mnemonicPhrase: string, count = 10): HDNodeWallet[] {
  const result = []
  const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase)
  for (let i = 0; i < count; i++) {
    // the way how myetherwallet generates addresses
    result.push(HDNodeWallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`))
  }

  return result
}

/**
 * Print balances of the wallets
 * @param balances
 */
async function printBalances(balances: WalletInfo[]): Promise<void> {
  for (const balanceInfo of balances) {
    // eslint-disable-next-line no-console
    log(`Address: ${balanceInfo.wallet.address}, balance: ${formatEther(balanceInfo.balance)} ETH`)
  }
}

/**
 * Check balances of the wallets
 * @param balances Balances
 */
async function checkBalances(balances: WalletInfo[]): Promise<void> {
  for (const balanceInfo of balances) {
    if (balanceInfo.balance < MIN_WALLET_BALANCE) {
      throw new Error(`Wallet ${balanceInfo.wallet.address} has insufficient balance`)
    }
  }
}

/**
 * Get balances of the wallets
 * @param provider Provider
 * @param wallets Wallets
 */
async function getBalances(provider: JsonRpcProvider, wallets: HDNodeWallet[]): Promise<WalletInfo[]> {
  const result = []
  for (const wallet of wallets) {
    result.push({
      wallet,
      balance: await provider.getBalance(wallet.address),
    })
  }

  return result
}

/**
 * Deploy the smart account
 * @param deployTask Deploy task
 * @param currentWallet Current wallet
 * @param connections Connections list
 */
async function deploy(
  deployTask: DeploySmartAccountModel,
  currentWallet: HDNodeWallet,
  connections: { [key: string]: IConnection },
): Promise<void> {
  await Deploy.updateStatusById(deployTask.id, Deploy.DeploySmartAccountStatus.IN_PROGRESS)
  const eoaAddress = `0x${deployTask.eoa_address}`
  const smartAccountAddress = `0x${deployTask.smart_account_address}`

  log(
    `Deployment task ID found: ${deployTask.id}. Deploying the smart account ${smartAccountAddress} for the EOA: ${eoaAddress}`,
  )
  try {
    for (const network of extractJsonNetworks(deployTask.networks)) {
      const connection = connections[network]
      log(`Deploying on network: ${network}...`)

      if (!connection) {
        log(`Network ${network} is empty. Continue.`)
        continue
      }

      const tx = await deploySimpleSmartAccount(currentWallet, connection, eoaAddress)
      await Deploy.updateStatusById(
        deployTask.id,
        Deploy.DeploySmartAccountStatus.SUCCESS,
        JSON.stringify({ txHash: tx.hash }),
      )

      if (!IS_DEV) {
        await tx.wait(WAIT_CONFIRMATIONS)
      }

      log(`Smart account ${smartAccountAddress} deployed successfully!`)
    }
  } catch (e) {
    const errorMessage = (e as Error).message
    log(`Deployment failed with error: ${errorMessage}`)
    await Deploy.updateStatusById(
      deployTask.id,
      Deploy.DeploySmartAccountStatus.FAILED,
      JSON.stringify({ error: (e as Error).message }),
    )
  }
}

/**
 * Send verify token to the address
 * @param verifyTask Verify task
 * @param currentWallet Current wallet
 * @param connections Connections list
 * @param verificationContractAddress Verification contract address
 */
async function verify(
  verifyTask: VerifySmartAccountModel,
  currentWallet: HDNodeWallet,
  connections: { [key: string]: IConnection },
  verificationContractAddress: string,
): Promise<void> {
  await Verify.updateStatusById(verifyTask.id, Verify.VerifySmartAccountStatus.IN_PROGRESS)
  const smartAccountAddress = `0x${verifyTask.smart_account_address}`
  log(`Verification task ID found: ${verifyTask.id}. Verifying the smart account: ${smartAccountAddress} `)
  try {
    for (const network of extractJsonNetworks(verifyTask.networks)) {
      const connection = connections[network]

      if (!connection) {
        continue
      }

      const { rpcUrl } = connection
      const tx = await sendVerificationToken(currentWallet, rpcUrl, verificationContractAddress, smartAccountAddress)
      await Verify.updateStatusById(
        verifyTask.id,
        Verify.VerifySmartAccountStatus.SUCCESS,
        JSON.stringify({ txHash: tx.hash }),
      )

      if (!IS_DEV) {
        await tx.wait(WAIT_CONFIRMATIONS)
      }
      log(`Smart account ${smartAccountAddress} verified successfully!`)
    }
  } catch (e) {
    const errorMessage = (e as Error).message
    log(`Verification failed with error: ${errorMessage}`)
    await Verify.updateStatusById(
      verifyTask.id,
      Verify.VerifySmartAccountStatus.FAILED,
      JSON.stringify({ error: (e as Error).message }),
    )
  }
}

/**
 * Check managers of the contract
 * @param rpcUrl RPC URL
 * @param contractAddress Contract address
 * @param wallets Wallets
 */
async function checkOwnership(rpcUrl: string, contractAddress: string, wallets: HDNodeWallet[]): Promise<void> {
  const contract = getVerificationContract(rpcUrl, contractAddress, wallets[0])
  for (const wallet of wallets) {
    if (!(await contract.isManager(wallet.address))) {
      throw new Error(`Wallet ${wallet.address} is not the owner of the contract ${contractAddress}`)
    }
  }
}

/**
 * Start the deployer
 */
async function start(): Promise<void> {
  let currentWalletIndex = 0
  const loopSleepMs = 1000

  function nextWallet(): HDNodeWallet {
    const currentWallet = wallets[currentWalletIndex]
    log(`Switch to wallet: ${currentWalletIndex + 1}/${wallets.length}, address: ${currentWallet.address}`)

    // rotate the wallet
    if (currentWalletIndex + 1 >= wallets.length) {
      currentWalletIndex = 0
    } else {
      currentWalletIndex++
    }

    return currentWallet
  }

  const {
    deployerMnemonic,
    rpcUrl,
    accountFactoryAddress,
    entryPointAddress,
    googleVerificationContractAddress,
    farcasterVerificationContractAddress,
    telegramVerificationContractAddress,
    allowedNetworks,
    otherNetworks,
  } = getConfigData()

  // object with network names as keys and connection data as values. {'optimism-mainnet': {rpcUrl, accountFactoryAddress, entryPointAddress}}
  const otherNetworksObject = JSON.parse(otherNetworks)
  // list of networks. example: ['optimism-mainnet']
  const allowedNetworksList = JSON.parse(allowedNetworks)

  if (!otherNetworksObject) {
    throw new Error('Other networks is empty')
  }

  if (!Object.keys(allowedNetworksList) || allowedNetworksList.length === 0) {
    throw new Error('Allowed networks list is empty')
  }

  log(
    `Allowed networks: ${allowedNetworksList.join(', ')}. Other networks: ${Object.keys(otherNetworksObject).join(', ')}`,
  )

  const connections: { [key: string]: IConnection } = {
    'optimism-mainnet': {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    },
  }
  allowedNetworksList.forEach((network: string) => {
    if (otherNetworksObject[network]) {
      connections[network] = otherNetworksObject[network]
    }
  })
  const wallets = getWallets(deployerMnemonic, 1)
  log(`RPC_URL: ${rpcUrl}`)
  log(`ACCOUNT_FACTORY_ADDRESS: ${accountFactoryAddress}`)
  log(`ENTRY_POINT_ADDRESS: ${entryPointAddress}`)
  const balances = await getBalances(new JsonRpcProvider(rpcUrl), wallets)
  await printBalances(balances)
  await checkBalances(balances)
  await checkOwnership(rpcUrl, googleVerificationContractAddress, wallets)
  await checkOwnership(rpcUrl, farcasterVerificationContractAddress, wallets)
  await checkOwnership(rpcUrl, telegramVerificationContractAddress, wallets)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(loopSleepMs)

    try {
      const deployTask = await Deploy.getOneByStatus(Deploy.DeploySmartAccountStatus.IDLE)

      if (deployTask) {
        await deploy(deployTask, nextWallet(), connections)
      }

      const verifyTask = await Verify.getOneByStatus(VerifySmartAccountStatus.IDLE)

      if (verifyTask) {
        const rawSignature = await getRawSignatureById(Number(verifyTask.raw_signature_id))

        let verificationContractAddress: string

        if (rawSignature.service_id === AuthService.GOOGLE) {
          verificationContractAddress = googleVerificationContractAddress
        } else if (rawSignature.service_id === AuthService.FARCASTER) {
          verificationContractAddress = farcasterVerificationContractAddress
        } else if (rawSignature.service_id === AuthService.TELEGRAM) {
          verificationContractAddress = telegramVerificationContractAddress
        } else {
          throw new Error(`Unknown service ID: ${rawSignature.service_id}`)
        }

        await verify(verifyTask, nextWallet(), connections, verificationContractAddress)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }
}

start().then()
