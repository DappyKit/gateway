import app from '../../src/app'
import supertest from 'supertest'
import { ISmartAccountInfoResponse } from '../../src/controllers/v1/info/interface/ISmartAccountInfoResponse'
import { setConfigData } from '../../src/config'

describe('Info OP mainnet', () => {
  beforeAll(() => {
    setConfigData({
      rpcUrl: 'https://mainnet.optimism.io',
      // LightAccount
      accountFactoryAddress: '0x00004EC70002a32400f8ae005A26081065620D20',
      entryPointAddress: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
      googleClientId: '---',
      deployerMnemonic: '',
      googleVerificationContractAddress: '0xBA44aaa2809931401ec099D798A5376cd678a12a',
      farcasterVerificationContractAddress: '0x02e4227ed20379db2999511609b8e2b28f73f0e0',
      telegramVerificationContractAddress: '',
      neynarApiKey: '---',
      farcasterAllowedUrls: [],
      farcasterMaxMinutesData: 0,
      publicUrl: '',
    })
  })

  it('should return info about not deployed and not verified smart account', async () => {
    const address = '0x76515270D603FfC5aaA44aa35e2f49adA50CEF34'
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/info/smart-account?address=${address}`)).body as ISmartAccountInfoResponse
    expect(data).toEqual({
      smartAccountAddress: '0x0E1FBD24ff2B31359F1cb1fB4cf729AB6b3349bF',
      optimismMainnet: {
        isDeployed: false,
        verifiedBy: [],
      },
    })
  })

  it('should return info about deployed and not verified smart account', async () => {
    const address = '0xeDb2B3134cFDA860F1c3C68a7a7Df9d09D73982f'
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/info/smart-account?address=${address}`)).body as ISmartAccountInfoResponse
    expect(data).toEqual({
      smartAccountAddress: '0x777BaEA06B5bb8b6a1584B139cdd0df7789182DA',
      optimismMainnet: {
        isDeployed: true,
        verifiedBy: [],
      },
    })
  })

  it('should return info about deployed and verified smart account', async () => {
    const address = '0xDb0c6C27C2C1ea4193d808bAB25be0Fc27fa4867'
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/info/smart-account?address=${address}`)).body as ISmartAccountInfoResponse
    expect(data).toEqual({
      smartAccountAddress: '0x4FFC738603dDAa0E1CeDe748166E5f7b73DDa7Dc',
      optimismMainnet: {
        isDeployed: true,
        verifiedBy: ['farcaster'],
      },
    })
  })
})
