import React, { useMemo, useState } from 'react'
import './App.css'
import { CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

function App() {
  const verifyUrl = 'http://localhost:1234/v1/verify/google'
  const clientId = '205494731540-ctvqvohakcrfu4p21e0023h6hnfcb4ch.apps.googleusercontent.com'
  const [credentialResponse, setCredentialResponse] =
      useState<CredentialResponse | null>()
  const [status, setStatus] = useState<string>('wait')

  const user = useMemo(() => {
    if (!credentialResponse?.credential) return
    return jwtDecode(credentialResponse.credential)
  }, [credentialResponse])

  return (
      <div className="container mt-5">
        {/*<button className="btn btn-primary" onClick={()=>{*/}

        {/*}}>Login</button>*/}

        <h3>Sign In With Google</h3>

        <div className="mt-5">
          <GoogleOAuthProvider clientId={clientId}>

            <GoogleLogin
                onSuccess={async credentialResponse => {
                  setCredentialResponse(credentialResponse)

                  try {
                    const response = await (await fetch(verifyUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({data: credentialResponse.credential})
                    })).json()

                    console.log('response', response)
                    if (response.status === 'ok') {
                      setStatus('ok')
                    } else {
                      setStatus('failed')
                    }
                  } catch (e) {
                    setStatus('failed ' + (e as Error).message)
                  }

                }}
                onError={() => {
                  console.log('Login Failed')
                }}
            />

            {/*<h3>One-tap</h3>*/}
            {/*<GoogleLogin*/}
            {/*    onSuccess={credentialResponse => {*/}
            {/*      console.log(credentialResponse);*/}
            {/*    }}*/}
            {/*    onError={() => {*/}
            {/*      console.log('Login Failed');*/}
            {/*    }}*/}
            {/*    useOneTap*/}
            {/*/>*/}
          </GoogleOAuthProvider>
        </div>

        <h2 className="mt-5">Status: {status}</h2>

        <div className="mt-5">
          <p>Test App ID: {clientId}</p>
          <p>Verify URL: {verifyUrl}</p>

          <p>
            {user ? JSON.stringify(user, null, 2) : undefined}
          </p>
        </div>

      </div>
  )
}

export default App
