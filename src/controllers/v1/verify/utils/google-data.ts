/**
 * Interface for the request to verify Google's OAuth
 */
export interface IVerifyGoogleRequest {
  /**
   * Data with credentials from Google's OAuth
   */
  data: string
}

/**
 * Extracts data from the request
 * @param requestData Request data
 */
export function extract(requestData: unknown): IVerifyGoogleRequest {
  const {data} = requestData as IVerifyGoogleRequest

  if (!data) {
    throw new Error('VerifyGoogleRequest: "data" is not defined')
  }

  return {
    data
  }
}
