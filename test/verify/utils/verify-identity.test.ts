import { verifyIdentity } from '../../../src/controllers/v1/verify/utils/farcaster-data'
import { getConfigData, loadConfig } from '../../../src/config'
import { isWithinMaxMinutes } from '../../../src/utils/time'

describe('Verify Real Data', () => {
  beforeAll(() => {
    loadConfig()
  })

  it('should return correct data', async () => {
    const { neynarApiKey } = getConfigData()
    const data =
      '0a62080d10edd2151880d2e13020018201520a3268747470733a2f2f776172702e64617070796b69742e6f72672f76312f6170702f667269656e64733f69643d33353436363910011a1a08edd215121407895dc3b4a4ba0cf9d895255801a3941b126d521214d488a7676f7c37381154a36e25653a293c84b51b18012240dc0aced6c7f1ab9df17e6607e0256543a08ba2ed462d862b15bfcba07c94e450b86c61b0f3ded9411aa822de9ca9b1bb92dd6400130844f8fdc18c3dff2e840b28013220cd7187a37ac577dd0884b3fe7e443bc36cca4753f502339be8ad3c0d387a82ec'
    const result = await verifyIdentity(neynarApiKey, data, ['https://warp.dappykit.org/v1/app/friends?id=354669'])
    expect(result.fid).toEqual(354669)
    expect(result.address).toEqual('0xdb0c6c27c2c1ea4193d808bab25be0fc27fa4867')
    expect(result.rawData).toBeDefined()
    // 2024-03-29T14:24:00.000Z
    expect(isWithinMaxMinutes(result.timestamp, 365 * 24 * 60)).toBeTruthy()
  })

  it('should fail with timestamp', async () => {
    const { neynarApiKey } = getConfigData()
    const data =
      '0a62080d10edd2151880d2e13020018201520a3268747470733a2f2f776172702e64617070796b69742e6f72672f76312f6170702f667269656e64733f69643d33353436363910011a1a08edd215121407895dc3b4a4ba0cf9d895255801a3941b126d521214d488a7676f7c37381154a36e25653a293c84b51b18012240dc0aced6c7f1ab9df17e6607e0256543a08ba2ed462d862b15bfcba07c94e450b86c61b0f3ded9411aa822de9ca9b1bb92dd6400130844f8fdc18c3dff2e840b28013220cd7187a37ac577dd0884b3fe7e443bc36cca4753f502339be8ad3c0d387a82ec'
    const result = await verifyIdentity(neynarApiKey, data, ['https://warp.dappykit.org/v1/app/friends?id=354669'])
    // 2024-03-29T14:24:00.000Z
    expect(isWithinMaxMinutes(result.timestamp, 10)).toBeFalsy()
  })
})
