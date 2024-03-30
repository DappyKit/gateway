import './App.css'
import GoogleVerify from './GoogleVerify'
import FarcasterVerify from './FarcasterVerify'

function App() {

  return (
    <>
      <div className="container mb-5">
        <GoogleVerify />
        <hr />
        <FarcasterVerify />
      </div>
    </>
  )
}

export default App
