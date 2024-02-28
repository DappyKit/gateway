import { JsonRpcProvider, parseEther, Wallet } from 'ethers'

/**
 * The script for transferring ETH to the specified address
 * from package.json
 */
const toAddress = process.argv[2]

if (!(toAddress && toAddress.length === 42)) {
  // eslint-disable-next-line no-console
  console.error('Invalid address')
  process.exit(1)
}

// hardhat private key from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
const wallet = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80').connect(
  new JsonRpcProvider('http://localhost:8545'),
)

wallet
  .sendTransaction({
    to: toAddress,
    value: parseEther('1.0'),
  })
  // eslint-disable-next-line no-console
  .then(console.log)
  // eslint-disable-next-line no-console
  .catch(console.error)
