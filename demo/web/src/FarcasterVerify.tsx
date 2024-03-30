import React, { useState } from 'react'

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

function FarcasterVerify() {
  const verifyUrl = process.env.REACT_APP_VERIFY_FARCASTER_URL as string

  if (!verifyUrl) {
    throw new Error('REACT_APP_VERIFY_FARCASTER_URL is required')
  }

  const [status, setStatus] = useState<string>('wait')
  const [response, setResponse] = useState<string>('')
  const [clickData, setClickData] = useState<string>('')
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>('')

  const sendToServer = async () => {
    try {
      setResponse('')
      const response = (await (await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clickData,
        }),
      })).json()) as IVerifyResponse
      setResponse(JSON.stringify(response, null, 2))

      console.log('response', response)
      if (response.status === 'ok') {
        setStatus('ok')
        setSmartAccountAddress(response.data.verifiedSmartAccountAddress)
      } else {
        setStatus('failed')
      }
    } catch (e) {
      setStatus('failed ' + (e as Error).message)
    }
  }

  return (
    <div className="container mt-5">
      <h3>Verify via Farcaster</h3>

      <div className="input-group my-5">
        <input type="text" className="form-control" placeholder="Click data"
               aria-describedby="basic-addon1" value={clickData} onChange={e => setClickData(e.target.value)} />
      </div>

      <div>
        <button className="btn btn-primary" disabled={!Boolean(clickData)} onClick={sendToServer}>Send data to the
          server
        </button>
      </div>

      <h2 className="mt-5">Status: {status}</h2>

      <div className="mt-5">
        {smartAccountAddress && <p><strong>Smart Account Address: {smartAccountAddress}</strong></p>}
        <p>Verify URL: {verifyUrl}</p>
      </div>

      {response && <code>{response}</code>}
    </div>
  )
}

export default FarcasterVerify
