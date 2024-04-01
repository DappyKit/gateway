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

  /**
   * Farcaster verification contract address
   */
  farcasterVerificationContractAddress: string

  /**
   * Telegram verification contract address
   */
  telegramVerificationContractAddress: string

  /**
   * Neynar API key
   */
  neynarApiKey: string

  /**
   * Allowed URLs for Farcaster Frames
   */
  farcasterAllowedUrls: string[]

  /**
   * Max minutes for Farcaster data
   */
  farcasterMaxMinutesData: number

  /**
   * Full URL of the public site
   */
  publicUrl: string

  /**
   * Clickcaster API key
   */
  clickcasterApiKey: string
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
  farcasterVerificationContractAddress: '',
  telegramVerificationContractAddress: '',
  neynarApiKey: '',
  farcasterAllowedUrls: [],
  farcasterMaxMinutesData: 0,
  publicUrl: '',
  clickcasterApiKey: '',
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

  if (!process.env.FARCASTER_VERIFICATION_CONTRACT_ADDRESS) {
    throw new Error('FARCASTER_VERIFICATION_CONTRACT_ADDRESS env variable not set')
  }

  if (!process.env.TELEGRAM_VERIFICATION_CONTRACT_ADDRESS) {
    throw new Error('TELEGRAM_VERIFICATION_CONTRACT_ADDRESS env variable not set')
  }

  if (!process.env.NEYNAR_API_KEY) {
    throw new Error('NEYNAR_API_KEY env variable not set')
  }

  if (!process.env.FARCASTER_ALLOWED_URLS) {
    throw new Error('FARCASTER_ALLOWED_URLS env variable not set')
  }

  const farcasterAllowedUrls = process.env.FARCASTER_ALLOWED_URLS.split(',')
    .map(item => item.trim())
    .filter(Boolean)

  if (!farcasterAllowedUrls.length) {
    throw new Error('FARCASTER_ALLOWED_URLS env variable is empty')
  }

  if (!process.env.FARCASTER_MAX_MINUTES_DATA) {
    throw new Error('FARCASTER_MAX_MINUTES_DATA env variable not set')
  }

  if (!process.env.PUBLIC_URL) {
    throw new Error('PUBLIC_URL env variable not set')
  }

  if (!process.env.CLICKCASTER_API_KEY) {
    throw new Error('CLICKCASTER_API_KEY env variable not set')
  }

  configData.googleClientId = process.env.GOOGLE_CLIENT_ID
  configData.accountFactoryAddress = process.env.ACCOUNT_FACTORY_ADDRESS
  configData.entryPointAddress = process.env.ENTRY_POINT_ADDRESS
  configData.rpcUrl = process.env.RPC_URL
  configData.deployerMnemonic = process.env.DEPLOYER_MNEMONIC
  configData.googleVerificationContractAddress = process.env.GOOGLE_VERIFICATION_CONTRACT_ADDRESS
  configData.farcasterVerificationContractAddress = process.env.FARCASTER_VERIFICATION_CONTRACT_ADDRESS
  configData.telegramVerificationContractAddress = process.env.TELEGRAM_VERIFICATION_CONTRACT_ADDRESS
  configData.neynarApiKey = process.env.NEYNAR_API_KEY
  configData.farcasterAllowedUrls = farcasterAllowedUrls
  configData.farcasterMaxMinutesData = Number(process.env.FARCASTER_MAX_MINUTES_DATA)
  configData.publicUrl = process.env.PUBLIC_URL
  configData.clickcasterApiKey = process.env.CLICKCASTER_API_KEY
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
