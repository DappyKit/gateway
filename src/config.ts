import 'dotenv/config'

/**
 * Config data interface
 */
export interface IConfigData {
  /**
   * Google client id
   */
  googleClientId: string
}

/**
 * Config data
 */
let configData: IConfigData = {
  googleClientId: '',
}

/**
 * Gets config data from environment variables
 */
export function loadConfig(): void {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID env variable not set')
  }

  configData.googleClientId = process.env.GOOGLE_CLIENT_ID
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
