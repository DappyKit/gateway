import 'dotenv/config'

/**
 * Config data interface
 */
export interface IConfigData {
  /**
   * Google client id
   */
  googleClientId: string

  /**
   * Account factory address
   */
  accountFactoryAddress: string

  /**
   * Entry point address
   */
  entryPointAddress: string

  /**
   * RPC url
   */
  rpcUrl: string

  /**
   * Deployer mnemonic
   */
  deployerMnemonic: string

  /**
   * Dappy verification contract address for Google
   */
  googleVerificationContractAddress: string
}

/**
 * Config data
 */
let configData: IConfigData = {
  googleClientId: '',
  accountFactoryAddress: '',
  entryPointAddress: '',
  rpcUrl: '',
  deployerMnemonic: '',
  googleVerificationContractAddress: '',
}

/**
 * Gets config data from environment variables
 */
export function loadConfig(): void {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID env variable not set')
  }

  if (!process.env.ACCOUNT_FACTORY_ADDRESS) {
    throw new Error('ACCOUNT_FACTORY_ADDRESS env variable not set')
  }

  if (!process.env.RPC_URL) {
    throw new Error('RPC_URL env variable not set')
  }

  if (!process.env.ENTRY_POINT_ADDRESS) {
    throw new Error('ENTRY_POINT_ADDRESS env variable not set')
  }

  if (!process.env.DEPLOYER_MNEMONIC) {
    throw new Error('DEPLOYER_MNEMONIC env variable not set')
  }

  if (!process.env.GOOGLE_VERIFICATION_CONTRACT_ADDRESS) {
    throw new Error('GOOGLE_VERIFICATION_CONTRACT_ADDRESS env variable not set')
  }

  configData.googleClientId = process.env.GOOGLE_CLIENT_ID
  configData.accountFactoryAddress = process.env.ACCOUNT_FACTORY_ADDRESS
  configData.entryPointAddress = process.env.ENTRY_POINT_ADDRESS
  configData.rpcUrl = process.env.RPC_URL
  configData.deployerMnemonic = process.env.DEPLOYER_MNEMONIC
  configData.googleVerificationContractAddress = process.env.GOOGLE_VERIFICATION_CONTRACT_ADDRESS
}

/**
 * Gets config data
 */
export function getConfigData(): IConfigData {
  return configData
}

/**
 * Sets config data
 * @param data Config data
 */
export function setConfigData(data: IConfigData): void {
  configData = data
}
