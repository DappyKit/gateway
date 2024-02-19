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
   * Multicall3 address
   */
  multicall3Address: string

  /**
   * Deployer mnemonic
   */
  deployerMnemonic: string

  /**
   * Google verification address
   */
  googleVerificationAddress: string
}

/**
 * Config data
 */
let configData: IConfigData = {
  googleClientId: '',
  accountFactoryAddress: '',
  entryPointAddress: '',
  rpcUrl: '',
  multicall3Address: '',
  deployerMnemonic: '',
  googleVerificationAddress: '',
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

  if (!process.env.MULTICALL3_ADDRESS) {
    throw new Error('MULTICALL3_ADDRESS env variable not set')
  }

  if (!process.env.DEPLOYER_MNEMONIC) {
    throw new Error('DEPLOYER_MNEMONIC env variable not set')
  }

  if (!process.env.GOOGLE_VERIFICATION_ADDRESS) {
    throw new Error('GOOGLE_VERIFICATION_ADDRESS env variable not set')
  }

  configData.googleClientId = process.env.GOOGLE_CLIENT_ID
  configData.accountFactoryAddress = process.env.ACCOUNT_FACTORY_ADDRESS
  configData.entryPointAddress = process.env.ENTRY_POINT_ADDRESS
  configData.rpcUrl = process.env.RPC_URL
  configData.multicall3Address = process.env.MULTICALL3_ADDRESS
  configData.deployerMnemonic = process.env.DEPLOYER_MNEMONIC
  configData.googleVerificationAddress = process.env.GOOGLE_VERIFICATION_ADDRESS
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
