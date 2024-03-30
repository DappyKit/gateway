import { ISmartAccountInfoRequest } from '../../info/interface/ISmartAccountInfoRequest'
import { is0xEthAddress } from '../../../../utils/eth'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { ValidateFrameActionResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { IVerifyFarcasterRequest } from '../interface/IVerifyFarcasterRequest'

/**
 * Farcaster data
 */
export interface IFarcasterData {
  /**
   * ID of the user
   */
  fid: number
  /**
   * Address of the user's main wallet (tied to the mnemonic phrase)
   */
  address: string
  /**
   * Timestamp of the action
   */
  timestamp: string
  /**
   * Raw data from the Farcaster
   */
  rawData: ValidateFrameActionResponse
}

/**
 * Extracts data from the request
 * @param requestData Request data
 */
export function extractAccountInfoRequest(requestData: unknown): ISmartAccountInfoRequest {
  const { address } = requestData as ISmartAccountInfoRequest

  if (!is0xEthAddress(address)) {
    throw new Error('SmartAccountInfoRequest: "address" is not a valid Ethereum address')
  }

  return {
    address,
  }
}

/**
 * Extracts data from the request
 * @param requestData Request data
 */
export function extractVerifyFarcasterRequest(requestData: unknown): IVerifyFarcasterRequest {
  const { clickData } = requestData as IVerifyFarcasterRequest

  if (!clickData) {
    throw new Error('VerifyFarcasterRequest: "clickData" is not defined')
  }

  return {
    clickData,
  }
}

/**
 * Verifies the identity of the user
 * @param neynarApiKey API key for the Neynar to verify the identity
 * @param clickData Data from the Farcaster
 * @param allowedUrls Allowed URLs of Frames
 */
export async function verifyIdentity(
  neynarApiKey: string,
  clickData: string,
  allowedUrls: string[],
): Promise<IFarcasterData> {
  const client = new NeynarAPIClient(neynarApiKey)
  let result
  try {
    result = await client.validateFrameAction(clickData)
  } catch (e) {
    throw new Error(`Invalid frame data: ${(e as Error).message}`)
  }

  if (!result.valid) {
    throw new Error('Invalid frame data')
  }

  if (!allowedUrls.includes(result.action.url)) {
    throw new Error('Frame URL is not allowed')
  }

  return {
    fid: result.action.interactor.fid,
    // the address that tied to the mnemonic phrase of the user
    address: result.action.interactor.custody_address,
    timestamp: result.action.timestamp,
    rawData: result,
  }
}
