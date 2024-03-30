import { Request, Response, NextFunction } from 'express'
import done from './page/done'
import { RpcHelperUtils, SDK } from '@dappykit/sdk'
import { optimismMainnetConfig } from '@dappykit/sdk/dist/src/network-config'
import { Wallet } from 'ethers'

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const clickData = req.body?.trustedData?.messageBytes

      if (clickData) {
        const sdk = new SDK(
          optimismMainnetConfig,
          RpcHelperUtils.convertHDNodeWalletToAccountSigner(Wallet.createRandom()),
        )

        await sdk.gateway.verification.verifyFarcaster(clickData)
      }
    } catch (e) {}
    res.send(done())
  } catch (e) {
    next(e)
  }
}
