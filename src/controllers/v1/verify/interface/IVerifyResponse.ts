/**
 * Verify response interface
 */
export interface IVerifyResponse {
  /**
   * Status
   */
  status: string

  /**
   * Data
   */
  data: {
    /**
     * Recovered EOA address
     */
    recoveredAddress: string

    /**
     * Verified smart account address
     */
    verifiedSmartAccountAddress: string

    /**
     * Deployment task ID
     */
    deploymentTaskId: number

    /**
     * Verification task ID
     */
    verificationTaskId: number
  }
}
