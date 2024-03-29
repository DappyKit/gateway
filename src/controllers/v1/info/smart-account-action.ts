import { Request, Response, NextFunction } from 'express'
import { ISmartAccountInfoResponse } from './interface/ISmartAccountInfoResponse'
import { ISmartAccountInfoRequest } from './interface/ISmartAccountInfoRequest'
import { extractAccountInfoRequest } from '../verify/utils/farcaster-data'
import { getSimpleSmartAccountAddress, IConnection, isContractDeployed } from '../../../contracts/aa/account'
import { getConfigData } from '../../../config'

export default async (
  req: Request<ISmartAccountInfoRequest>,
  res: Response<ISmartAccountInfoResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { address } = extractAccountInfoRequest(req.query)
    const { rpcUrl, accountFactoryAddress, entryPointAddress } = getConfigData()
    const connection: IConnection = {
      rpcUrl,
      accountFactoryAddress,
      entryPointAddress,
    }
    const smartAccountAddress = await getSimpleSmartAccountAddress(connection, address)
    const response = {
      smartAccountAddress,
      optimismMainnet: {
        isDeployed: await isContractDeployed(rpcUrl, smartAccountAddress),
        verifiedBy: [],
      },
    }
    res.json(response)
  } catch (e) {
    next(e)
  }
}
