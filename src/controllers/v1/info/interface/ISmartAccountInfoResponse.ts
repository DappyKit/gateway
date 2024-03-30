export type VerifiedBy = 'google' | 'telegram' | 'farcaster'

export interface INetworkAccountInfo {
  isDeployed: boolean
  verifiedBy: VerifiedBy[]
}

export interface ISmartAccountInfoResponse {
  smartAccountAddress: string
  optimismMainnet: INetworkAccountInfo
}
