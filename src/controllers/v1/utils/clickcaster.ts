import { Wallet } from 'ethers'
import { getConfigData } from '../../../config'

/**
 * Log the click data in Clickcaster
 * @param clickData The click data
 */
export async function clickLog(clickData: string): Promise<unknown> {
  const { clickcasterApiKey } = getConfigData()
  const signer = new Wallet(clickcasterApiKey)
  const signature = await signer.signMessage(clickData)

  return (
    await fetch('https://api.clickcaster.xyz/v1/click/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clickData, signature }),
    })
  ).json()
}
