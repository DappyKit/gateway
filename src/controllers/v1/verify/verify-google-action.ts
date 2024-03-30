import { NextFunction, Request, Response } from 'express'
import { IVerifyResponse } from './interface/IVerifyResponse'
import { verifyGoogleToken } from '../../../verification/google'
import { getConfigData } from '../../../config'
import { extract, verifyWalletData } from './utils/google-data'
import { IConnection } from '../../../contracts/aa/account'
import { insertInfo } from './utils/db'
import { AuthService } from '../../../db/ServiceModel'

export default async (req: Request, res: Response<IVerifyResponse>, next: NextFunction): Promise<void> => {
  try {
    const { googleClientId, rpcUrl, accountFactoryAddress, entryPointAddress } = getConfigData()
    const connection: IConnection = {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    }

    const { data, eoaSignature } = extract(req.body)
    const verifiedData = await verifyGoogleToken(googleClientId, data)
    const userId = verifiedData.sub
    const { recoveredAddress, smartAccountAddress: verifiedSmartAccountAddress } = await verifyWalletData(
      connection,
      data,
      eoaSignature,
    )

    const { deploymentTaskId, verificationTaskId } = await insertInfo(
      userId,
      recoveredAddress,
      verifiedSmartAccountAddress,
      AuthService.GOOGLE,
    )

    res.json({
      status: 'ok',
      data: {
        recoveredAddress,
        verifiedSmartAccountAddress,
        deploymentTaskId,
        verificationTaskId,
      },
    })
  } catch (e) {
    next(e)
  }
}
