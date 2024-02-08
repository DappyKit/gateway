import { Request, Response, NextFunction } from 'express'
import { IVerifyResponse } from './interface/IVerifyResponse'
import { verifyGoogleToken } from '../../../verify/google'
import { getConfigData } from '../../../config'
import { extract } from './utils/google-data'

export default async (req: Request, res: Response<IVerifyResponse>, next: NextFunction): Promise<void> => {
  try {
    const config = getConfigData()
    const { data } = extract(req.body)
    const verifiedData = await verifyGoogleToken(config.googleClientId, data)

    if (!verifiedData.email_verified) {
      throw new Error('Email is not verified')
    }

    res.json({
      status: 'ok',
    })
  } catch (e) {
    next(e)
  }
}
