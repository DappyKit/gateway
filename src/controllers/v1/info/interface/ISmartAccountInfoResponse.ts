export interface INetworkAccountInfo {
  isDeployed: boolean
  verifiedBy: ('google' | 'telegram' | 'farcaster')[]
}

export interface ISmartAccountInfoResponse {
  smartAccountAddress: string
  optimismMainnet: INetworkAccountInfo
}
