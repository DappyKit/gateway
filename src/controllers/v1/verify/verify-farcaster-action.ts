import { Request, Response, NextFunction } from 'express'
import { IVerifyResponse } from './interface/IVerifyResponse'
import { getConfigData } from '../../../config'
import { getSimpleSmartAccountAddress, IConnection } from '../../../contracts/aa/account'
import { extractVerifyFarcasterRequest, verifyIdentity } from './utils/farcaster-data'
import { insertInfo } from './utils/db'
import { AuthService } from '../../../db/ServiceModel'
import { isWithinMaxMinutes } from '../../../utils/time'
import { IVerifyFarcasterRequest } from './interface/IVerifyFarcasterRequest'

export default async (
  req: Request<IVerifyFarcasterRequest>,
  res: Response<IVerifyResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
      neynarApiKey,
      farcasterAllowedUrls,
      farcasterMaxMinutesData,
    } = getConfigData()
    const connection: IConnection = {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    }

    const { clickData } = extractVerifyFarcasterRequest(req.body)
    const verifiedData = await verifyIdentity(neynarApiKey, clickData, farcasterAllowedUrls)

    if (!isWithinMaxMinutes(verifiedData.timestamp, farcasterMaxMinutesData)) {
      throw new Error(`Frame data is expired. Max allowed time is ${farcasterMaxMinutesData} minutes.`)
    }

    const smartAccountAddress = await getSimpleSmartAccountAddress(connection, verifiedData.address)
    const { deploymentTaskId, verificationTaskId } = await insertInfo(
      verifiedData.fid.toString(),
      verifiedData.address,
      smartAccountAddress,
      AuthService.FARCASTER,
    )

    res.json({
      status: 'ok',
      data: {
        recoveredAddress: verifiedData.address,
        verifiedSmartAccountAddress: smartAccountAddress,
        deploymentTaskId,
        verificationTaskId,
      },
    })
  } catch (e) {
    next(e)
  }
}
