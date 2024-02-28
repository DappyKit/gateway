import { getAccountInitCode } from '../../src/contracts/aa/account'

describe('AA', () => {
  it('should correctly verify wallet data from the response', () => {
    const code = getAccountInitCode(
      '0x9406Cc6185a346906296840746125a0E44976454',
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    )
    expect(code).toEqual(
      '0x9406cc6185a346906296840746125a0e449764545fbfb9cf000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000',
    )
  })
})
