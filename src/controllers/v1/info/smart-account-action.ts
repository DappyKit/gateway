import { Request, Response, NextFunction } from 'express'
import { ISmartAccountInfoResponse, VerifiedBy } from './interface/ISmartAccountInfoResponse'
import { ISmartAccountInfoRequest } from './interface/ISmartAccountInfoRequest'
import { extractAccountInfoRequest } from '../verify/utils/farcaster-data'
import { getSimpleSmartAccountAddress, IConnection, isContractDeployed } from '../../../contracts/aa/account'
import { getConfigData } from '../../../config'
import { getIsVerified } from '../../../contracts/user-verification'

export default async (
  req: Request<ISmartAccountInfoRequest>,
  res: Response<ISmartAccountInfoResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { address } = extractAccountInfoRequest(req.query)
    const {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
      farcasterVerificationContractAddress,
      googleVerificationContractAddress,
    } = getConfigData()
    const connection: IConnection = {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    }
    const smartAccountAddress = await getSimpleSmartAccountAddress(connection, address)
    const verifiedBy: VerifiedBy[] = []

    if (await getIsVerified(rpcUrl, smartAccountAddress, farcasterVerificationContractAddress)) {
      verifiedBy.push('farcaster')
    }

    if (await getIsVerified(rpcUrl, smartAccountAddress, googleVerificationContractAddress)) {
      verifiedBy.push('google')
    }

    const response = {
      smartAccountAddress,
      optimismMainnet: {
        isDeployed: await isContractDeployed(rpcUrl, smartAccountAddress),
        verifiedBy,
      },
    }
    res.json(response)
  } catch (e) {
    next(e)
  }
}
