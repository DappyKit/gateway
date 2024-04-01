# DappyKit - Deploy and Verify

Smart Account Deployment and Verification Service.

The service performs OAuth and other authentication methods verification. Based on the verified data, an on-chain [Soulbound](https://github.com/DappyKit/contracts/blob/master/contracts/UserVerification.sol) token is issued at the expense of the service, confirming the verification of a person's Smart Account. In addition to verification, the service deploys the Smart Account at its own expense for verified accounts.

### OP Mainnet
* API: https://verify.dappykit.org

### OP Sepolia
* Demo: https://verify-demo-test.dappykit.org
* API: https://verify-api-test.dappykit.org

### Farcaster Frame
* https://verify.dappykit.org/v1/farcaster/verify

## Components

The project consists of 3 components: API, Deployer, and Verifier.

- **API**: A Node.js server written in TypeScript that handles user requests for the verification and deployment of their Smart Accounts. The service checks the correctness of external verification data, recovers the EOA (Externally Owned Account) address from signed data, and queues tasks for deployment and verification. The task queue is stored on a MySQL server.

- **Deployer**: A service written in TypeScript and Node.js for deploying people's Smart Accounts based on their EOA addresses. The service utilizes multiple wallets to conduct several operations in parallel.

- **Verifier**: A service written in TypeScript and Node.js for issuing Soulbound tokens to a person's Smart Account. Like the Deployer, it uses multiple wallets to perform numerous operations simultaneously.

- **Demo**: To demonstrate how the project works, you can find a React project in the `demo/web` directory that authenticates a user with Google, signs the server's response, and sends the data to the DappyKit API.


## How does it work?

The main goal of this service is to verify and deploy a person's Smart Account with just one request.

A person has an EOA (Externally Owned Account) and their account, for example, in Google. Having an account on an external service signifies that the service has conducted basic verification on the person. At least, one person cannot simply and cheaply create millions of accounts, unlike with EOA.

When a person authenticates with an external service, they additionally sign the service's response using their EOA. The signed response from the service is verified using utilities provided by the service. This way, we can be sure that the person indeed owns the EOA and the external account.

Based on the EOA's signature, the service extracts the ETH address and calculates the Smart Account address. Thanks to account factories, the account deployment happens at a deterministic address, and the owner of such an account will be the EOA owner, not the account that performed the deployment. When using a test network, the deployment of the smart account is carried out using Simple Account Factory.

After the account deployment, we also issue a Soulbound token to the Smart Account address for 6 months. Subsequently, these tokens can be extended, revoked, or reissued to another EOA.

Thus, DappyKit projects and any external projects can verify that a person has performed verification through our service.
The token ID is the person's ID in the external service, hashed using keccak256. In the case of Google, the ID is an internal identifier, not an Email. In the event of a brute force attack on the registry identifier, a hacker would not be able to obtain the Email database, at most - a database of identifiers.
Email and other sensitive data are not stored on our servers.

```mermaid
sequenceDiagram
    participant Client as Client
    participant DappyAuth as Dappy Auth
    participant Server as Server
    participant DB as DB
    participant Deployer as Deployer
    participant GoogleAuth as Google Authorize

    Client->>DappyAuth: Opens Dappy Auth website
    DappyAuth->>GoogleAuth: Redirects to Google Authorize page
    GoogleAuth->>Client: User approves Verify App
    DappyAuth->>Client: Sign user's email with EOA
    Client->>Server: Sends signed user email
    Server->>DB: Checks signature, stores data
    DB->>Deployer: New data available
    Deployer->>Deployer: Deploys smart account, issues token
    Deployer->>DB: Marks DB task as completed

```

## Start components & Development

[Documentation](./docs/START_COMPONENTS.md)
