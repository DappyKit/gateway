import { Request, Response, NextFunction } from 'express'
import { IVerifyResponse } from './interface/IVerifyResponse'
import { verifyGoogleToken } from '../../../verify/google'
import { getConfigData } from '../../../config'
import { extract, verifyWalletData } from './utils/google-data'
import { IConnection } from '../../../aa/account'

export default async (req: Request, res: Response<IVerifyResponse>, next: NextFunction): Promise<void> => {
  try {
    const { googleClientId, rpcUrl, accountFactoryAddress, entryPointAddress } = getConfigData()
    const connection: IConnection = {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    }
    const { data, eoaSignature, smartAccountAddress } = extract(req.body)
    const verifiedData = await verifyGoogleToken(googleClientId, data)
    const { recoveredAddress, smartAccountAddress: verifiedSmartAccountAddress } = await verifyWalletData(
      connection,
      verifiedData.sub,
      eoaSignature,
      smartAccountAddress,
    )

    res.json({
      status: 'ok',
      data: {
        recoveredAddress,
        verifiedSmartAccountAddress,
      },
    })
  } catch (e) {
    next(e)
  }
}
